export class GetTickets {
    supportRepo;
    constructor(supportRepo) {
        this.supportRepo = supportRepo;
    }
    async exec() {
        try {
            const tickets = await this.supportRepo.getSupportTickets();
            if (!tickets || tickets.length === 0) {
                return { ok: false, message: "No support tickets found" };
            }
            return { ok: true, tickets };
        }
        catch (error) {
            console.error("[GetTickets] Error:", error);
            return { ok: false, message: "Failed to retrieve support tickets" };
        }
    }
}
