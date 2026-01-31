export class UpdateTicket {
    supportRepo;
    constructor(supportRepo) {
        this.supportRepo = supportRepo;
    }
    async exec(ticketId, completed) {
        try {
            const result = await this.supportRepo.updateSupportTicketStatus(ticketId, completed);
            if (!result) {
                return { ok: false, message: "Support ticket not found or status unchanged" };
            }
            return { ok: true, message: "Support ticket status updated successfully" };
        }
        catch (error) {
            console.error("[UpdateTicket] Error:", error);
            return { ok: false, message: "Failed to update support ticket status" };
        }
    }
}
