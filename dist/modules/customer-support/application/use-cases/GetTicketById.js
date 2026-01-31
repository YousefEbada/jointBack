export class GetTicketById {
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
            return { ok: true, ticket };
        }
        catch (error) {
            console.error("[GetTicketById] Error:", error);
            return { ok: false, message: "Failed to retrieve support ticket" };
        }
    }
}
