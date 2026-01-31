import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env.js';
import { resolve } from '../../../app/container.js';
import { SendMessage } from '../application/use-cases/SendMessage.js';
import { MarkMessagesAsRead } from '../application/use-cases/MarkMessagesAsRead.js';
import { GetChatRooms } from '../application/use-cases/GetChatRooms.js';
import { CHAT_MESSAGE_REPO, CHAT_ROOM_REPO } from '../../../app/container.bindings.js';
export class ChatSocketService {
    io;
    onlineUsers = new Map(); // userId -> OnlineUser
    userSockets = new Map(); // userId -> socketId
    typingUsers = new Map(); // roomId -> TypingStatus[]
    constructor(httpServer) {
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
    setupMiddleware() {
        // Authentication middleware
        this.io.use(async (socket, next) => {
            try {
                console.log('Socket handshake auth:', socket.handshake.auth);
                const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
                if (!token) {
                    return next(new Error('Authentication token missing'));
                }
                const decoded = jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET);
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
            }
            catch (error) {
                console.error('Socket authentication error:', error);
                next(new Error('Authentication failed'));
            }
        });
    }
    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            if (!socket.user)
                return;
            console.log(`User ${socket.user.id} (${socket.user.userType}) connected`);
            this.handleUserConnection(socket);
            this.handleJoinRooms(socket);
            this.handleSendMessage(socket);
            this.handleTypingEvents(socket);
            this.handleMarkAsRead(socket);
            this.handleDisconnection(socket);
        });
    }
    handleUserConnection(socket) {
        if (!socket.user)
            return;
        const onlineUser = {
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
    handleJoinRooms(socket) {
        socket.on('rooms:join', async (data) => {
            if (!socket.user)
                return;
            try {
                // Verify user has access to these rooms
                const getChatRooms = new GetChatRooms(resolve(CHAT_ROOM_REPO));
                const result = await getChatRooms.exec(socket.user.id, socket.user.userType);
                if (!result.ok || !result.data)
                    return;
                const userRoomIds = result.data.map((room) => room.roomId);
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
            }
            catch (error) {
                console.error('Join rooms error:', error);
                socket.emit('error', { message: 'Failed to join rooms' });
            }
        });
    }
    handleSendMessage(socket) {
        socket.on('message:send', async (data) => {
            if (!socket.user)
                return;
            try {
                const sendMessage = new SendMessage(resolve(CHAT_MESSAGE_REPO), resolve(CHAT_ROOM_REPO));
                const result = await sendMessage.exec(data.roomId, socket.user.id, socket.user.userType, data.messageType, data.content, data.fileData, data.metadata);
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
            }
            catch (error) {
                console.error('Send message error:', error);
                socket.emit('message:error', { error: 'Failed to send message' });
            }
        });
    }
    handleTypingEvents(socket) {
        socket.on('typing:start', (data) => {
            if (!socket.user)
                return;
            const typingStatus = {
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
        socket.on('typing:stop', (data) => {
            if (!socket.user)
                return;
            this.removeTypingStatus(data.roomId, socket.user.id);
            socket.to(`room:${data.roomId}`).emit('typing:update', {
                roomId: data.roomId,
                userId: socket.user.id,
                userType: socket.user.userType,
                isTyping: false
            });
        });
    }
    handleMarkAsRead(socket) {
        socket.on('messages:mark-read', async (data) => {
            if (!socket.user)
                return;
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
            }
            catch (error) {
                console.error('Mark messages as read error:', error);
            }
        });
    }
    handleDisconnection(socket) {
        socket.on('disconnect', () => {
            if (!socket.user)
                return;
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
    updateTypingStatus(status) {
        const roomTyping = this.typingUsers.get(status.roomId) || [];
        const existingIndex = roomTyping.findIndex(t => t.userId === status.userId);
        if (existingIndex >= 0) {
            roomTyping[existingIndex] = status;
        }
        else {
            roomTyping.push(status);
        }
        this.typingUsers.set(status.roomId, roomTyping);
        // Clean up old typing statuses (older than 30 seconds)
        const now = new Date().getTime();
        const cleanedTyping = roomTyping.filter(t => now - t.timestamp.getTime() < 30000);
        if (cleanedTyping.length !== roomTyping.length) {
            this.typingUsers.set(status.roomId, cleanedTyping);
        }
    }
    removeTypingStatus(roomId, userId) {
        const roomTyping = this.typingUsers.get(roomId);
        if (!roomTyping)
            return;
        const filtered = roomTyping.filter(t => t.userId !== userId);
        this.typingUsers.set(roomId, filtered);
    }
    getIO() {
        return this.io;
    }
    getOnlineUsers() {
        return this.onlineUsers;
    }
}
