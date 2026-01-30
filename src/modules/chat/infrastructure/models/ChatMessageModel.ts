import { Schema, model } from 'mongoose';
import { ChatMessage } from '../../domain/ChatMessage.js';

const chatMessageSchema = new Schema<ChatMessage>({
    roomId: {
        type: String,
        required: true,
        index: true
    },
    senderId: {
        type: String,
        required: true,
        index: true
    },
    senderType: {
        type: String,
        enum: ['patient', 'doctor'],
        required: true
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'file', 'system'],
        default: 'text'
    },
    content: {
        type: String,
        required: true
    },
    fileUrl: String,
    fileName: String,
    fileSize: Number,
    mimeType: String,
    isRead: {
        type: Boolean,
        default: false,
        index: true
    },
    readAt: Date,
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    metadata: {
        replyTo: String,
        edited: {
            type: Boolean,
            default: false
        },
        editedAt: Date
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    collection: 'chat_messages'
});

// Compound indexes for efficient queries
chatMessageSchema.index({ roomId: 1, createdAt: -1 });
chatMessageSchema.index({ roomId: 1, isRead: 1 });
chatMessageSchema.index({ senderId: 1, createdAt: -1 });

export const ChatMessageModel = model<ChatMessage>('ChatMessage', chatMessageSchema);