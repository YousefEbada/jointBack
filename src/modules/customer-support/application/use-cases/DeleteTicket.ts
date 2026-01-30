import { SupportRepoPort } from "../ports/supportRepoPort.js";

export class DeleteTicket {
    constructor(private supportRepo: SupportRepoPort) {}
    
    async exec(ticketId: string) {
        try {
            const ticket = await this.supportRepo.getSupportTicket(ticketId as string);
            if (!ticket) {
                return {ok: false, message: "Support ticket not found"} as any;
            }
            
            const result = await this.supportRepo.deleteSupportTicket(ticketId as string);
            if(result) {
                return {ok: true, message: "Support ticket deleted successfully"} as any;
            }

            return {ok: false, message: "Failed to delete support ticket"} as any;
        } catch (error) {
            console.error("[DeleteTicket] Error:", error);
            return {ok: false, message: "Failed to delete support ticket"} as any;
        }
    }
}