export class SendMessage {
    chatMessageRepo;
    chatRoomRepo;
    constructor(chatMessageRepo, chatRoomRepo) {
        this.chatMessageRepo = chatMessageRepo;
        this.chatRoomRepo = chatRoomRepo;
    }
    async exec(roomId, senderId, senderType, messageType, content, fileData, metadata) {
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
            const messageData = {
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
        }
        catch (error) {
            console.error('SendMessage error:', error);
            return { ok: false, error: 'Failed to send message' };
        }
    }
}
