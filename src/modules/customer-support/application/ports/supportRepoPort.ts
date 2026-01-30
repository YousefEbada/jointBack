import { SupportTicket } from "modules/customer-support/domain/SupportTicket.js";

export interface SupportRepoPort {
  createSupportTicket(data: SupportTicket): Promise<SupportTicket | null>;
  getSupportTickets(): Promise<Array<SupportTicket | any>>;
  getsupportTicketsByPatient(patientId: string): Promise<Array<SupportTicket | any>>;
  getSupportTicket(id: string): Promise<SupportTicket | null>;
  updateSupportTicketStatus(ticketId: string, completed: boolean): Promise<any>;
  deleteSupportTicket(id: string): Promise<boolean>;
}