export class GetChatMessages {
    chatMessageRepo;
    chatRoomRepo;
    constructor(chatMessageRepo, chatRoomRepo) {
        this.chatMessageRepo = chatMessageRepo;
        this.chatRoomRepo = chatRoomRepo;
    }
    async exec(roomId, userId, userType, page = 1, limit = 50) {
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
        }
        catch (error) {
            console.error('GetChatMessages error:', error);
            return { ok: false, error: 'Failed to fetch messages' };
        }
    }
}
