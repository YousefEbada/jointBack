import { ChatRoomRepoPort } from '../ports/ChatRoomRepoPort.js';
import { ChatRoom } from '../../domain/ChatRoom.js';

export class GetChatRooms {
    constructor(private chatRoomRepo: ChatRoomRepoPort) {}

    async exec(userId: string, userType: 'patient' | 'doctor'): Promise<{ ok: boolean; data?: ChatRoom[]; error?: string }> {
        try {
            let rooms: ChatRoom[];
            
            if (userType === 'patient') {
                rooms = await this.chatRoomRepo.getRoomsByPatientId(userId);
            } else {
                rooms = await this.chatRoomRepo.getRoomsByDoctorId(userId);
            }

            // Sort by last message time (most recent first)
            rooms.sort((a, b) => {
                const timeA = a.lastMessageAt || a.updatedAt || a.createdAt || new Date(0);
                const timeB = b.lastMessageAt || b.updatedAt || b.createdAt || new Date(0);
                return new Date(timeB).getTime() - new Date(timeA).getTime();
            });

            return { ok: true, data: rooms };

        } catch (error) {
            console.error('GetChatRooms error:', error);
            return { ok: false, error: 'Failed to fetch chat rooms' };
        }
    }
}