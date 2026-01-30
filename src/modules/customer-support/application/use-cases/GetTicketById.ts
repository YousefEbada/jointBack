import { SupportRepoPort } from "../ports/supportRepoPort.js";
import { SupportTicket } from "modules/customer-support/domain/SupportTicket.js";

export class GetTicketById {
    constructor(private supportRepo: SupportRepoPort) {}
    
    async exec(ticketId: string) {
        try {
            const ticket = await this.supportRepo.getSupportTicket(ticketId);
            if (!ticket) {
                return {ok: false, message: "Support ticket not found"} as any;
            }
            return {ok: true, ticket} as any;
        } catch (error) {
            console.error("[GetTicketById] Error:", error);
            return {ok: false, message: "Failed to retrieve support ticket"} as any;
        }
    }
}