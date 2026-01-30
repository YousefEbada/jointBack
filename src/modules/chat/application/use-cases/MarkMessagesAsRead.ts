import { ChatMessageRepoPort } from '../ports/ChatMessageRepoPort.js';
import { ChatRoomRepoPort } from '../ports/ChatRoomRepoPort.js';

export class MarkMessagesAsRead {
    constructor(
        private chatMessageRepo: ChatMessageRepoPort,
        private chatRoomRepo: ChatRoomRepoPort
    ) {}

    async exec(roomId: string, userId: string, userType: 'patient' | 'doctor'): Promise<{ ok: boolean; data?: { count: number }; error?: string }> {
        try {
            // Verify user is participant in the room
            const room = await this.chatRoomRepo.getRoomById(roomId);
            if (!room) {
                return { ok: false, error: 'Chat room not found' };
            }

            if (userType === 'patient' && room.patientId !== userId) {
                return { ok: false, error: 'Unauthorized: Not a participant' };
            }
            if (userType === 'doctor' && room.doctorId !== userId) {
                return { ok: false, error: 'Unauthorized: Not a participant' };
            }

            // Mark all unread messages as read
            const count = await this.chatMessageRepo.markMessagesAsRead(roomId, userId, new Date());
            
            return { ok: true, data: { count } };

        } catch (error) {
            console.error('MarkMessagesAsRead error:', error);
            return { ok: false, error: 'Failed to mark messages as read' };
        }
    }
}