import { ChatMessageRepoPort } from '../../application/ports/ChatMessageRepoPort.js';
import { ChatMessage } from '../../domain/ChatMessage.js';
import { ChatMessageModel } from '../models/ChatMessageModel.js';

export const ChatMessageRepoMongo: ChatMessageRepoPort = {
    
    async createMessage(message: Partial<ChatMessage>): Promise<ChatMessage> {
        const newMessage = new ChatMessageModel(message);
        const savedMessage = await newMessage.save();
        return savedMessage.toObject();
    },

    async getMessageById(messageId: string): Promise<ChatMessage | null> {
        const message = await ChatMessageModel.findById(messageId).lean();
        return message;
    },

    async getMessagesByRoomId(
        roomId: string, 
        page: number = 1, 
        limit: number = 50
    ): Promise<{ messages: ChatMessage[]; totalCount: number; hasMore: boolean }> {
        const skip = (page - 1) * limit;
        
        const [messages, totalCount] = await Promise.all([
            ChatMessageModel.find({ roomId })
                .sort({ createdAt: -1 }) // Most recent first
                .skip(skip)
                .limit(limit)
                .lean(),
            ChatMessageModel.countDocuments({ roomId })
        ]);

        const hasMore = skip + messages.length < totalCount;
        
        // Reverse to show oldest first in the array
        messages.reverse();

        return {
            messages,
            totalCount,
            hasMore
        };
    },

    async markMessageAsRead(messageId: string, readAt: Date = new Date()): Promise<ChatMessage | null> {
        const updatedMessage = await ChatMessageModel.findByIdAndUpdate(
            messageId,
            { 
                isRead: true, 
                readAt,
                updatedAt: new Date()
            },
            { new: true }
        ).lean();
        return updatedMessage;
    },

    async markMessagesAsRead(
        roomId: string, 
        userId: string, 
        readAt: Date = new Date()
    ): Promise<number> {
        // Mark messages as read that were NOT sent by the current user
        const result = await ChatMessageModel.updateMany(
            { 
                roomId, 
                senderId: { $ne: userId },
                isRead: false 
            },
            { 
                isRead: true, 
                readAt,
                updatedAt: new Date()
            }
        );
        
        return result.modifiedCount;
    },

    async getUnreadMessageCount(roomId: string, userId: string): Promise<number> {
        const count = await ChatMessageModel.countDocuments({
            roomId,
            senderId: { $ne: userId }, // Messages not sent by the user
            isRead: false
        });
        return count;
    },

    async updateMessage(messageId: string, updates: Partial<ChatMessage>): Promise<ChatMessage | null> {
        const updatedMessage = await ChatMessageModel.findByIdAndUpdate(
            messageId,
            { 
                ...updates, 
                updatedAt: new Date(),
                'metadata.edited': true,
                'metadata.editedAt': new Date()
            },
            { new: true }
        ).lean();
        return updatedMessage;
    },

    async deleteMessage(messageId: string): Promise<boolean> {
        const result = await ChatMessageModel.findByIdAndDelete(messageId);
        return !!result;
    },

    async getLatestMessage(roomId: string): Promise<ChatMessage | null> {
        const message = await ChatMessageModel.findOne({ roomId })
            .sort({ createdAt: -1 })
            .lean();
        return message;
    }
}