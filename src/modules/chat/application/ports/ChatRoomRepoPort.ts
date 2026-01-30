import { ChatRoom } from '../../domain/ChatRoom.js';

export interface ChatRoomRepoPort {
    createRoom(room: Partial<ChatRoom>): Promise<ChatRoom>;
    getRoomById(roomId: string): Promise<ChatRoom | null>;
    getRoomByParticipants(patientId: string, doctorId: string): Promise<ChatRoom | null>;
    getRoomsByPatientId(patientId: string): Promise<ChatRoom[]>;
    getRoomsByDoctorId(doctorId: string): Promise<ChatRoom[]>;
    updateRoom(roomId: string, updates: Partial<ChatRoom>): Promise<ChatRoom | null>;
    updateLastMessageTime(roomId: string): Promise<void>;
    closeRoom(roomId: string): Promise<ChatRoom | null>;
    archiveRoom(roomId: string): Promise<ChatRoom | null>;
}