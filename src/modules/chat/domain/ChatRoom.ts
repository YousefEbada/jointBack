export interface ChatRoom {
    _id?: string;
    patientId: string;
    doctorId: string;
    roomId: string; // Unique identifier for the chat room
    status: 'active' | 'closed' | 'archived';
    createdAt?: Date;
    updatedAt?: Date;
    lastMessageAt?: Date;
    metadata?: {
        patientName?: string;
        doctorName?: string;
        bookingId?: string; // Optional reference to booking if chat is related to a booking
    };
}