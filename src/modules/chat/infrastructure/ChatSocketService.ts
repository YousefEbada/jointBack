import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from 'config/env.js';
import { resolve } from 'app/container.js';
import { SendMessage } from '../application/use-cases/SendMessage.js';
import { MarkMessagesAsRead } from '../application/use-cases/MarkMessagesAsRead.js';
import { GetChatRooms } from '../application/use-cases/GetChatRooms.js';
import { OnlineUser, TypingStatus } from '../domain/ChatStatus.js';
import { CHAT_MESSAGE_REPO, CHAT_ROOM_REPO } from 'app/container.bindings.js';

interface AuthenticatedSocket extends Socket {
    user?: {
        id: string;
        userType: 'patient' | 'doctor';
        email: string;
    };
}

export class ChatSocketService {
    private io: Server;
    private onlineUsers = new Map<string, OnlineUser>(); // userId -> OnlineUser
    private userSockets = new Map<string, string>(); // userId -> socketId
    private typingUsers = new Map<string, TypingStatus[]>(); // roomId -> TypingStatus[]

    constructor(httpServer: HttpServer) {
        this.io = new Server(httpServer, {
            cors: {
                origin: (env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean),
                methods: ['GET', 'POST'],
                credentials: false
            }
        });

        this.setupMiddleware();
        this.setupEventHandlers();
    }

    private setupMiddleware(): void {
        // Authentication middleware
        this.io.use(async (socket: AuthenticatedSocket, next) => {
            try {
                console.log('Socket handshake auth:', socket.handshake.auth);
                const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
                
                if (!token) {   
                    return next(new Error('Authentication token missing'));
                }

                const decoded = jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET) as any;
                console.log('Decoded token:', decoded);
                
                // Validate user data
                if (!decoded.userId || !decoded.userType || !['patient', 'doctor'].includes(decoded.userType)) {
                    return next(new Error('Invalid token payload'));
                }

                socket.user = {
                    id: decoded.userId,
                    userType: decoded.userType,
                    email: decoded.email
                };

                next();
            } catch (error) {
                console.error('Socket authentication error:', error);
                next(new Error('Authentication failed'));
            }
        });
    }

    private setupEventHandlers(): void {
        this.io.on('connection', (socket: AuthenticatedSocket) => {
            if (!socket.user) return;

            console.log(`User ${socket.user.id} (${socket.user.userType}) connected`);
            
            this.handleUserConnection(socket);
            this.handleJoinRooms(socket);
            this.handleSendMessage(socket);
            this.handleTypingEvents(socket);
            this.handleMarkAsRead(socket);
            this.handleDisconnection(socket);
        });
    }

    private handleUserConnection(socket: AuthenticatedSocket): void {
        if (!socket.user) return;

        const onlineUser: OnlineUser = {
            userId: socket.user.id,
            userType: socket.user.userType,
            socketId: socket.id,
            roomIds: [],
            lastSeen: new Date()
        };

        this.onlineUsers.set(socket.user.id, onlineUser);
        this.userSockets.set(socket.user.id, socket.id);

        // Emit user online status
        socket.broadcast.emit('user:online', {
            userId: socket.user.id,
            userType: socket.user.userType,
            lastSeen: new Date()
        });
    }

    private handleJoinRooms(socket: AuthenticatedSocket): void {
        socket.on('rooms:join', async (data: { roomIds: string[] }) => {
            if (!socket.user) return;

            try {
                // Verify user has access to these rooms
                const getChatRooms = new GetChatRooms(resolve(CHAT_ROOM_REPO));
                const result = await getChatRooms.exec(socket.user.id, socket.user.userType);
                
                if (!result.ok || !result.data) return;

                const userRoomIds = result.data.map((room: any) => room.roomId);
                const validRoomIds = data.roomIds.filter(roomId => userRoomIds.includes(roomId));

                // Join socket rooms
                for (const roomId of validRoomIds) {
                    await socket.join(`room:${roomId}`);
                }

                // Update online user data
                const onlineUser = this.onlineUsers.get(socket.user.id);
                if (onlineUser) {
                    onlineUser.roomIds = validRoomIds;
                    this.onlineUsers.set(socket.user.id, onlineUser);
                }

                socket.emit('rooms:joined', { roomIds: validRoomIds });

                // Notify other participants that user is online
                for (const roomId of validRoomIds) {
                    socket.to(`room:${roomId}`).emit('user:room-online', {
                        roomId,
                        userId: socket.user.id,
                        userType: socket.user.userType
                    });
                }

            } catch (error) {
                console.error('Join rooms error:', error);
                socket.emit('error', { message: 'Failed to join rooms' });
            }
        });
    }

    private handleSendMessage(socket: AuthenticatedSocket): void {
        socket.on('message:send', async (data: {
            roomId: string;
            messageType: 'text' | 'image' | 'file' | 'system';
            content: string;
            fileData?: {
                fileUrl: string;
                fileName: string;
                fileSize: number;
                mimeType: string;
            };
            metadata?: {
                replyTo?: string;
            };
        }) => {
            if (!socket.user) return;

            try {
                const sendMessage = new SendMessage(resolve(CHAT_MESSAGE_REPO), resolve(CHAT_ROOM_REPO));
                const result = await sendMessage.exec(
                    data.roomId,
                    socket.user.id,
                    socket.user.userType,
                    data.messageType,
                    data.content,
                    data.fileData,
                    data.metadata
                );

                if (!result.ok || !result.data) {
                    socket.emit('message:error', { 
                        error: result.error || 'Failed to send message' 
                    });
                    return;
                }

                // Broadcast message to room participants
                this.io.to(`room:${data.roomId}`).emit('message:received', {
                    ...result.data,
                    senderName: socket.user.userType === 'patient' ? 'Patient' : 'Doctor'
                });

                // Remove typing indicator for this user
                this.removeTypingStatus(data.roomId, socket.user.id);

            } catch (error) {
                console.error('Send message error:', error);
                socket.emit('message:error', { error: 'Failed to send message' });
            }
        });
    }

    private handleTypingEvents(socket: AuthenticatedSocket): void {
        socket.on('typing:start', (data: { roomId: string }) => {
            if (!socket.user) return;

            const typingStatus: TypingStatus = {
                roomId: data.roomId,
                userId: socket.user.id,
                userType: socket.user.userType,
                userName: socket.user.userType === 'patient' ? 'Patient' : 'Doctor',
                isTyping: true,
                timestamp: new Date()
            };

            this.updateTypingStatus(typingStatus);
            
            socket.to(`room:${data.roomId}`).emit('typing:update', {
                roomId: data.roomId,
                userId: socket.user.id,
                userType: socket.user.userType,
                userName: typingStatus.userName,
                isTyping: true
            });
        });

        socket.on('typing:stop', (data: { roomId: string }) => {
            if (!socket.user) return;

            this.removeTypingStatus(data.roomId, socket.user.id);
            
            socket.to(`room:${data.roomId}`).emit('typing:update', {
                roomId: data.roomId,
                userId: socket.user.id,
                userType: socket.user.userType,
                isTyping: false
            });
        });
    }

    private handleMarkAsRead(socket: AuthenticatedSocket): void {
        socket.on('messages:mark-read', async (data: { roomId: string }) => {
            if (!socket.user) return;

            try {
                const markMessagesAsRead = new MarkMessagesAsRead(resolve(CHAT_MESSAGE_REPO), resolve(CHAT_ROOM_REPO));
                const result = await markMessagesAsRead.exec(data.roomId, socket.user.id, socket.user.userType);

                if (result.ok) {
                    // Notify other participants that messages were read
                    socket.to(`room:${data.roomId}`).emit('messages:read', {
                        roomId: data.roomId,
                        userId: socket.user.id,
                        userType: socket.user.userType,
                        readAt: new Date()
                    });
                }

            } catch (error) {
                console.error('Mark messages as read error:', error);
            }
        });
    }

    private handleDisconnection(socket: AuthenticatedSocket): void {
        socket.on('disconnect', () => {
            if (!socket.user) return;

            console.log(`User ${socket.user.id} (${socket.user.userType}) disconnected`);

            const onlineUser = this.onlineUsers.get(socket.user.id);
            if (onlineUser) {
                // Notify rooms that user went offline
                for (const roomId of onlineUser.roomIds) {
                    socket.to(`room:${roomId}`).emit('user:room-offline', {
                        roomId,
                        userId: socket.user.id,
                        userType: socket.user.userType,
                        lastSeen: new Date()
                    });

                    // Remove typing status
                    this.removeTypingStatus(roomId, socket.user.id);
                }
            }

            this.onlineUsers.delete(socket.user.id);
            this.userSockets.delete(socket.user.id);

            // Broadcast user offline status
            socket.broadcast.emit('user:offline', {
                userId: socket.user.id,
                userType: socket.user.userType,
                lastSeen: new Date()
            });
        });
    }

    private updateTypingStatus(status: TypingStatus): void {
        const roomTyping = this.typingUsers.get(status.roomId) || [];
        const existingIndex = roomTyping.findIndex(t => t.userId === status.userId);
        
        if (existingIndex >= 0) {
            roomTyping[existingIndex] = status;
        } else {
            roomTyping.push(status);
        }
        
        this.typingUsers.set(status.roomId, roomTyping);
        
        // Clean up old typing statuses (older than 30 seconds)
        const now = new Date().getTime();
        const cleanedTyping = roomTyping.filter(t => 
            now - t.timestamp.getTime() < 30000
        );
        
        if (cleanedTyping.length !== roomTyping.length) {
            this.typingUsers.set(status.roomId, cleanedTyping);
        }
    }

    private removeTypingStatus(roomId: string, userId: string): void {
        const roomTyping = this.typingUsers.get(roomId);
        if (!roomTyping) return;
        
        const filtered = roomTyping.filter(t => t.userId !== userId);
        this.typingUsers.set(roomId, filtered);
    }

    public getIO(): Server {
        return this.io;
    }

    public getOnlineUsers(): Map<string, OnlineUser> {
        return this.onlineUsers;
    }
}