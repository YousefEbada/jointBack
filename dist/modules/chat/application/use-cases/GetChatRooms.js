export class GetChatRooms {
    chatRoomRepo;
    constructor(chatRoomRepo) {
        this.chatRoomRepo = chatRoomRepo;
    }
    async exec(userId, userType) {
        try {
            let rooms;
            if (userType === 'patient') {
                rooms = await this.chatRoomRepo.getRoomsByPatientId(userId);
            }
            else {
                rooms = await this.chatRoomRepo.getRoomsByDoctorId(userId);
            }
            // Sort by last message time (most recent first)
            rooms.sort((a, b) => {
                const timeA = a.lastMessageAt || a.updatedAt || a.createdAt || new Date(0);
                const timeB = b.lastMessageAt || b.updatedAt || b.createdAt || new Date(0);
                return new Date(timeB).getTime() - new Date(timeA).getTime();
            });
            return { ok: true, data: rooms };
        }
        catch (error) {
            console.error('GetChatRooms error:', error);
            return { ok: false, error: 'Failed to fetch chat rooms' };
        }
    }
}
