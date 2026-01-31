export class GetTicketsByPatient {
    supportRepo;
    constructor(supportRepo) {
        this.supportRepo = supportRepo;
    }
    async execute(patientId) {
        try {
            const tickets = await this.supportRepo.getsupportTicketsByPatient(patientId);
            if (!tickets || tickets.length === 0) {
                return { ok: false, message: "No support tickets found for this patient" };
            }
            return { ok: true, tickets };
        }
        catch (error) {
            console.error("[GetTicketsByPatient] Error:", error);
            return { ok: false, message: "Failed to retrieve support tickets" };
        }
    }
}
