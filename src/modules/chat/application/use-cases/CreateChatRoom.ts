import { ChatRoomRepoPort } from '../ports/ChatRoomRepoPort.js';
import { ChatRoom } from '../../domain/ChatRoom.js';
import { v4 as uuidv4 } from 'uuid';

export class CreateChatRoom {
    constructor(private chatRoomRepo: ChatRoomRepoPort) {}

    async exec(patientId: string, doctorId: string, metadata?: ChatRoom['metadata']): Promise<{ ok: boolean; data?: ChatRoom; error?: string }> {
        try {
            // Check if room already exists between these participants
            const existingRoom = await this.chatRoomRepo.getRoomByParticipants(patientId, doctorId);
            
            if (existingRoom) {
                // Reactivate if closed
                if (existingRoom.status === 'closed' || existingRoom.status === 'archived') {
                    const updatedRoom = await this.chatRoomRepo.updateRoom(existingRoom.roomId, {
                        status: 'active',
                        updatedAt: new Date()
                    });
                    return { ok: true, data: updatedRoom || existingRoom };
                }
                return { ok: true, data: existingRoom };
            }

            // Create new room
            const roomData: Partial<ChatRoom> = {
                patientId,
                doctorId,
                roomId: uuidv4(),
                status: 'active',
                metadata,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const newRoom = await this.chatRoomRepo.createRoom(roomData);
            return { ok: true, data: newRoom };

        } catch (error) {
            console.error('CreateChatRoom error:', error);
            return { ok: false, error: 'Failed to create chat room' };
        }
    }
}