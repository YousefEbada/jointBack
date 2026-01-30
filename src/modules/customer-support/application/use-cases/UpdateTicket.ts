import { SupportRepoPort } from "../ports/supportRepoPort.js";

export class UpdateTicket {
    constructor(private supportRepo: SupportRepoPort) {}
    async exec(ticketId: string, completed: boolean): Promise<any> {
        try {
            const result = await this.supportRepo.updateSupportTicketStatus(ticketId, completed);
            if (!result) {
                return {ok: false, message: "Support ticket not found or status unchanged"} as any;
            }
            return {ok: true, message: "Support ticket status updated successfully"} as any;
        } catch (error) {
            console.error("[UpdateTicket] Error:", error);
            return {ok: false, message: "Failed to update support ticket status"} as any;
        }
    }
}