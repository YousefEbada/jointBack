import { ChatMessageRepoPort } from '../ports/ChatMessageRepoPort.js';
import { ChatRoomRepoPort } from '../ports/ChatRoomRepoPort.js';
import { ChatMessage } from '../../domain/ChatMessage.js';

export class GetChatMessages {
    constructor(
        private chatMessageRepo: ChatMessageRepoPort,
        private chatRoomRepo: ChatRoomRepoPort
    ) {}

    async exec(
        roomId: string,
        userId: string,
        userType: 'patient' | 'doctor',
        page: number = 1,
        limit: number = 50
    ): Promise<{ ok: boolean; data?: { messages: ChatMessage[]; totalCount: number; hasMore: boolean }; error?: string }> {
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

            // Get messages with pagination
            const result = await this.chatMessageRepo.getMessagesByRoomId(roomId, page, limit);
            
            return { ok: true, data: result };

        } catch (error) {
            console.error('GetChatMessages error:', error);
            return { ok: false, error: 'Failed to fetch messages' };
        }
    }
}