export class DeleteTicket {
    supportRepo;
    constructor(supportRepo) {
        this.supportRepo = supportRepo;
    }
    async exec(ticketId) {
        try {
            const ticket = await this.supportRepo.getSupportTicket(ticketId);
            if (!ticket) {
                return { ok: false, message: "Support ticket not found" };
            }
            const result = await this.supportRepo.deleteSupportTicket(ticketId);
            if (result) {
                return { ok: true, message: "Support ticket deleted successfully" };
            }
            return { ok: false, message: "Failed to delete support ticket" };
        }
        catch (error) {
            console.error("[DeleteTicket] Error:", error);
            return { ok: false, message: "Failed to delete support ticket" };
        }
    }
}
