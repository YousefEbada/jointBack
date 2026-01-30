import { SupportRepoPort } from "../ports/supportRepoPort.js";
import { SupportTicket } from "modules/customer-support/domain/SupportTicket.js";

export class GetTickets {
    constructor(private supportRepo: SupportRepoPort) { }
    async exec() {
        try {
            const tickets = await this.supportRepo.getSupportTickets();
            if (!tickets || tickets.length === 0) {
                return { ok: false, message: "No support tickets found" } as any;
            }
            return { ok: true, tickets } as any;
        } catch (error) {
            console.error("[GetTickets] Error:", error);
            return { ok: false, message: "Failed to retrieve support tickets" } as any;
        }
    }
}