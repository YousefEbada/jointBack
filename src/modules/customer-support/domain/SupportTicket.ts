export interface SupportTicket {
    _id?: string;
    ticketId?: string;
    patientId: string;
    patientName: string;
    contact: string;
    inquiryDept: string;
    whenToCall: Date;
    message: string;
    completed: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}