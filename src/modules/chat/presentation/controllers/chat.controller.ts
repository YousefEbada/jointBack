import { Request, Response } from 'express';
import { resolve } from 'app/container.js';
import { CreateChatRoom } from '../../application/use-cases/CreateChatRoom.js';
import { GetChatRooms } from '../../application/use-cases/GetChatRooms.js';
import { GetChatMessages } from '../../application/use-cases/GetChatMessages.js';
import { SendMessage } from '../../application/use-cases/SendMessage.js';
import { MarkMessagesAsRead } from '../../application/use-cases/MarkMessagesAsRead.js';
import { ApiResponse } from "shared/http/ApiResponse.js";
import { HttpError } from 'shared/http/HttpError.js';
import { 
    createRoomSchema, 
    sendMessageSchema, 
    getRoomMessagesSchema,
    markMessagesReadSchema
} from '../validation/chat.schemas.js';
import { CHAT_MESSAGE_REPO, CHAT_ROOM_REPO } from 'app/container.bindings.js';

export class ChatController {
    
    // GET /api/chat/rooms
    static async getRooms(req: Request, res: Response): Promise<void> {
        try {
            const user = (req as any).user;
            if (!user) {
                throw new HttpError(401, 'Unauthorized');
            }

            const uc = new GetChatRooms(resolve(CHAT_ROOM_REPO));
            const result = await uc.exec(user.id, user.userType);
            
            if (!result.ok) {
                throw new HttpError(400, result.error || 'Failed to get rooms');
            }

            ApiResponse.success(res, result.data, 'Rooms retrieved successfully');
        } catch (error) {
            ApiResponse.error(res, error);
        }
    }

    // POST /api/chat/rooms
    static async createRoom(req: Request, res: Response): Promise<void> {
        try {
            const user = (req as any).user;
            if (!user) {
                throw new HttpError(401, 'Unauthorized');
            }

            const validatedData = createRoomSchema.parse(req.body);
            
            // Determine user type and validate access
            let patientId: string, doctorId: string;
            
            if (user.userType === 'patient') {
                if (validatedData.patientId !== user.id) {
                    throw new HttpError(403, 'Cannot create room for another patient');
                }
                patientId = user.id;
                doctorId = validatedData.doctorId;
            } else if (user.userType === 'doctor') {
                if (validatedData.doctorId !== user.id) {
                    throw new HttpError(403, 'Cannot create room for another doctor');
                }
                patientId = validatedData.patientId;
                doctorId = user.id;
            } else {
                throw new HttpError(403, 'Invalid user type');
            }

            const createChatRoom = new CreateChatRoom(resolve(CHAT_ROOM_REPO));
            const result = await createChatRoom.exec(patientId, doctorId, validatedData.metadata);
            
            if (!result.ok) {
                throw new HttpError(400, result.error || 'Failed to create room');
            }

            ApiResponse.success(res, result.data, 'Room created successfully', 201);
        } catch (error) {
            ApiResponse.error(res, error);
        }
    }

    // GET /api/chat/rooms/:roomId/messages
    static async getMessages(req: Request, res: Response): Promise<void> {
        try {
            const user = (req as any).user;
            if (!user) {
                throw new HttpError(401, 'Unauthorized');
            }

            const { roomId } = req.params;
            const validatedQuery = getRoomMessagesSchema.parse({
                roomId,
                ...req.query
            });

            const getChatMessages = new GetChatMessages(resolve(CHAT_MESSAGE_REPO), resolve(CHAT_ROOM_REPO));
            const result = await getChatMessages.exec(
                validatedQuery.roomId,
                user.id,
                user.userType,
                validatedQuery.page,
                validatedQuery.limit
            );
            
            if (!result.ok) {
                throw new HttpError(400, result.error || 'Failed to get messages');
            }

            ApiResponse.success(res, result.data, 'Messages retrieved successfully');
        } catch (error) {
            ApiResponse.error(res, error);
        }
    }

    // POST /api/chat/messages
    static async sendMessage(req: Request, res: Response): Promise<void> {
        try {
            const user = (req as any).user;
            if (!user) {
                throw new HttpError(401, 'Unauthorized');
            }

            const validatedData = sendMessageSchema.parse(req.body);

            const sendMessage = new SendMessage(resolve(CHAT_MESSAGE_REPO), resolve(CHAT_ROOM_REPO));
            const result = await sendMessage.exec(
                validatedData.roomId,
                user.id,
                user.userType,
                validatedData.messageType,
                validatedData.content,
                validatedData.fileUrl ? {
                    fileUrl: validatedData.fileUrl,
                    fileName: validatedData.fileName || '',
                    fileSize: validatedData.fileSize || 0,
                    mimeType: validatedData.mimeType || ''
                } : undefined,
                validatedData.metadata
            );
            
            if (!result.ok) {
                throw new HttpError(400, result.error || 'Failed to send message');
            }

            ApiResponse.success(res, result.data, 'Message sent successfully', 201);
        } catch (error) {
            ApiResponse.error(res, error);
        }
    }

    // POST /api/chat/rooms/:roomId/mark-read
    static async markMessagesAsRead(req: Request, res: Response): Promise<void> {
        try {
            const user = (req as any).user;
            if (!user) {
                throw new HttpError(401, 'Unauthorized');
            }

            const { roomId } = req.params;
            const validatedData = markMessagesReadSchema.parse({ roomId });

            const markMessagesAsRead = new MarkMessagesAsRead(resolve(CHAT_MESSAGE_REPO), resolve(CHAT_ROOM_REPO));
            const result = await markMessagesAsRead.exec(validatedData.roomId, user.id, user.userType);
            
            if (!result.ok) {
                throw new HttpError(400, result.error || 'Failed to mark messages as read');
            }

            ApiResponse.success(res, result.data, 'Messages marked as read');
        } catch (error) {
            ApiResponse.error(res, error);
        }
    }
}