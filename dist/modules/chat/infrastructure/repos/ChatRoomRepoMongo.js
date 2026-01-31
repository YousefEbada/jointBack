import { ChatRoomModel } from '../models/ChatRoomModel.js';
export const ChatRoomRepoMongo = {
    async createRoom(room) {
        const newRoom = new ChatRoomModel(room);
        const savedRoom = await newRoom.save();
        return savedRoom.toObject();
    },
    async getRoomById(roomId) {
        const room = await ChatRoomModel.findOne({ roomId }).lean();
        return room;
    },
    async getRoomByParticipants(patientId, doctorId) {
        const room = await ChatRoomModel.findOne({
            patientId,
            doctorId
        }).lean();
        return room;
    },
    async getRoomsByPatientId(patientId) {
        const rooms = await ChatRoomModel.find({
            patientId,
            status: { $in: ['active', 'closed'] }
        })
            .sort({ lastMessageAt: -1, updatedAt: -1 })
            .lean();
        return rooms;
    },
    async getRoomsByDoctorId(doctorId) {
        const rooms = await ChatRoomModel.find({
            doctorId,
            status: { $in: ['active', 'closed'] }
        })
            .sort({ lastMessageAt: -1, updatedAt: -1 })
            .lean();
        return rooms;
    },
    async updateRoom(roomId, updates) {
        const updatedRoom = await ChatRoomModel.findOneAndUpdate({ roomId }, { ...updates, updatedAt: new Date() }, { new: true }).lean();
        return updatedRoom;
    },
    async updateLastMessageTime(roomId) {
        await ChatRoomModel.updateOne({ roomId }, {
            lastMessageAt: new Date(),
            updatedAt: new Date()
        });
    },
    async closeRoom(roomId) {
        return this.updateRoom(roomId, { status: 'closed' });
    },
    async archiveRoom(roomId) {
        return this.updateRoom(roomId, { status: 'archived' });
    }
};
