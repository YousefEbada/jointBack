export class CreateTicket {
    supportRepo;
    constructor(supportRepo) {
        this.supportRepo = supportRepo;
    }
    async exec(data) {
        try {
            const ticketExist = await this.supportRepo.getSupportTicket(data.ticketId);
            if (ticketExist) {
                return { ok: false, message: "Support ticket with this ID already exists" };
            }
            const ticket = await this.supportRepo.createSupportTicket(data);
            return { ok: true, ticket };
        }
        catch (error) {
            console.error("[CreateTicket] Error:", error);
            return { ok: false, message: "Failed to create support ticket" };
        }
    }
}
