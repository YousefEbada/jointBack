import { ChatMessageRepoPort } from '../ports/ChatMessageRepoPort.js';
import { ChatRoomRepoPort } from '../ports/ChatRoomRepoPort.js';
import { ChatMessage } from '../../domain/ChatMessage.js';

export class SendMessage {
    constructor(
        private chatMessageRepo: ChatMessageRepoPort,
        private chatRoomRepo: ChatRoomRepoPort
    ) {}

    async exec(
        roomId: string,
        senderId: string,
        senderType: 'patient' | 'doctor',
        messageType: ChatMessage['messageType'],
        content: string,
        fileData?: {
            fileUrl: string;
            fileName: string;
            fileSize: number;
            mimeType: string;
        },
        metadata?: ChatMessage['metadata']
    ): Promise<{ ok: boolean; data?: ChatMessage; error?: string }> {
        try {
            // Verify room exists and is active
            const room = await this.chatRoomRepo.getRoomById(roomId);
            if (!room) {
                return { ok: false, error: 'Chat room not found' };
            }

            if (room.status !== 'active') {
                return { ok: false, error: 'Chat room is not active' };
            }

            // Verify sender is participant
            if (senderType === 'patient' && room.patientId !== senderId) {
                return { ok: false, error: 'Unauthorized: Not a participant' };
            }
            if (senderType === 'doctor' && room.doctorId !== senderId) {
                return { ok: false, error: 'Unauthorized: Not a participant' };
            }

            // Create message
            const messageData: Partial<ChatMessage> = {
                roomId,
                senderId,
                senderType,
                messageType,
                content,
                isRead: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                ...fileData,
                metadata
            };

            const newMessage = await this.chatMessageRepo.createMessage(messageData);
            
            // Update room's last message time
            await this.chatRoomRepo.updateLastMessageTime(roomId);

            return { ok: true, data: newMessage };

        } catch (error) {
            console.error('SendMessage error:', error);
            return { ok: false, error: 'Failed to send message' };
        }
    }
}