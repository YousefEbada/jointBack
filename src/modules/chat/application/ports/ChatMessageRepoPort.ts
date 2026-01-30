import { ChatMessage } from '../../domain/ChatMessage.js';

export interface ChatMessageRepoPort {
    createMessage(message: Partial<ChatMessage>): Promise<ChatMessage>;
    getMessageById(messageId: string): Promise<ChatMessage | null>;
    getMessagesByRoomId(roomId: string, page?: number, limit?: number): Promise<{
        messages: ChatMessage[];
        totalCount: number;
        hasMore: boolean;
    }>;
    markMessageAsRead(messageId: string, readAt?: Date): Promise<ChatMessage | null>;
    markMessagesAsRead(roomId: string, userId: string, readAt?: Date): Promise<number>; // Returns count of updated messages
    getUnreadMessageCount(roomId: string, userId: string): Promise<number>;
    updateMessage(messageId: string, updates: Partial<ChatMessage>): Promise<ChatMessage | null>;
    deleteMessage(messageId: string): Promise<boolean>;
    getLatestMessage(roomId: string): Promise<ChatMessage | null>;
}