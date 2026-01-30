import { SupportRepoPort } from "../ports/supportRepoPort.js";
import { SupportTicket } from "modules/customer-support/domain/SupportTicket.js";

export class GetTicketsByPatient {
    constructor(private supportRepo: SupportRepoPort) {}
    async execute(patientId: string) {
        try {
            const tickets = await this.supportRepo.getsupportTicketsByPatient(patientId);
            if(!tickets || tickets.length === 0) {
                return {ok: false, message: "No support tickets found for this patient"} as any;
            }

            return {ok: true, tickets} as any;
        } catch (error) {
            console.error("[GetTicketsByPatient] Error:", error);
            return {ok: false, message: "Failed to retrieve support tickets"} as any;
        }
    }
}