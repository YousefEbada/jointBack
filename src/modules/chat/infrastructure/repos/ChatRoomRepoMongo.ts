import { ChatRoomRepoPort } from '../../application/ports/ChatRoomRepoPort.js';
import { ChatRoom } from '../../domain/ChatRoom.js';
import { ChatRoomModel } from '../models/ChatRoomModel.js';

export const ChatRoomRepoMongo: ChatRoomRepoPort = {
    
    async createRoom(room: Partial<ChatRoom>): Promise<ChatRoom> {
        const newRoom = new ChatRoomModel(room);
        const savedRoom = await newRoom.save();
        return savedRoom.toObject();
    },

    async getRoomById(roomId: string): Promise<ChatRoom | null> {
        const room = await ChatRoomModel.findOne({ roomId }).lean();
        return room;
    },

    async getRoomByParticipants(patientId: string, doctorId: string): Promise<ChatRoom | null> {
        const room = await ChatRoomModel.findOne({ 
            patientId, 
            doctorId 
        }).lean();
        return room;
    },

    async getRoomsByPatientId(patientId: string): Promise<ChatRoom[]> {
        const rooms = await ChatRoomModel.find({ 
            patientId,
            status: { $in: ['active', 'closed'] }
        })
        .sort({ lastMessageAt: -1, updatedAt: -1 })
        .lean();
        return rooms;
    },

    async getRoomsByDoctorId(doctorId: string): Promise<ChatRoom[]> {
        const rooms = await ChatRoomModel.find({ 
            doctorId,
            status: { $in: ['active', 'closed'] }
        })
        .sort({ lastMessageAt: -1, updatedAt: -1 })
        .lean();
        return rooms;
    },

    async updateRoom(roomId: string, updates: Partial<ChatRoom>): Promise<ChatRoom | null> {
        const updatedRoom = await ChatRoomModel.findOneAndUpdate(
            { roomId },
            { ...updates, updatedAt: new Date() },
            { new: true }
        ).lean();
        return updatedRoom;
    },

    async updateLastMessageTime(roomId: string): Promise<void> {
        await ChatRoomModel.updateOne(
            { roomId },
            { 
                lastMessageAt: new Date(),
                updatedAt: new Date()
            }
        );
    },

    async closeRoom(roomId: string): Promise<ChatRoom | null> {
        return this.updateRoom(roomId, { status: 'closed' });
    },

    async archiveRoom(roomId: string): Promise<ChatRoom | null> {
        return this.updateRoom(roomId, { status: 'archived' });
    }
}