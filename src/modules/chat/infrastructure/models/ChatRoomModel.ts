import { Schema, model } from 'mongoose';
import { ChatRoom } from '../../domain/ChatRoom.js';

const chatRoomSchema = new Schema<ChatRoom>({
    patientId: {
        type: String,
        required: true,
        index: true
    },
    doctorId: {
        type: String,
        required: true,
        index: true
    },
    roomId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    status: {
        type: String,
        enum: ['active', 'closed', 'archived'],
        default: 'active',
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    lastMessageAt: {
        type: Date,
        index: true
    },
    metadata: {
        patientName: String,
        doctorName: String,
        bookingId: String
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    collection: 'chat_rooms'
});

// Compound index for finding rooms by participants
chatRoomSchema.index({ patientId: 1, doctorId: 1 });
chatRoomSchema.index({ lastMessageAt: -1 });

export const ChatRoomModel = model<ChatRoom>('ChatRoom', chatRoomSchema);