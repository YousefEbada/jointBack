import { SupportTicket } from "modules/customer-support/domain/SupportTicket.js";
import { SupportRepoPort } from "../ports/supportRepoPort.js";

export class CreateTicket {
  constructor(private supportRepo: SupportRepoPort) {}
    async exec(data: SupportTicket): Promise<any> {
        try {
            const ticketExist = await this.supportRepo.getSupportTicket(data.ticketId as string);
            if (ticketExist) {
                return {ok: false, message: "Support ticket with this ID already exists"} as any;
            }
            const ticket = await this.supportRepo.createSupportTicket(data);
            return {ok: true, ticket} as any;
        } catch (error) {
            console.error("[CreateTicket] Error:", error);
            return {ok: false, message: "Failed to create support ticket"} as any;
        }
    }
}