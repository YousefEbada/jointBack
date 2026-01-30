export interface ChatMessage {
    _id?: string;
    roomId: string;
    senderId: string;
    senderType: 'patient' | 'doctor';
    messageType: 'text' | 'image' | 'file' | 'system';
    content: string;
    fileUrl?: string; // For file/image messages
    fileName?: string; // Original filename for file messages
    fileSize?: number; // File size in bytes
    mimeType?: string; // MIME type for files
    isRead: boolean;
    readAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    metadata?: {
        replyTo?: string; // Message ID this message is replying to
        edited?: boolean;
        editedAt?: Date;
    };
}