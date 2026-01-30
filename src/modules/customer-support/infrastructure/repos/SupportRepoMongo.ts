import { SupportRepoPort } from "modules/customer-support/application/ports/supportRepoPort.js";
import { SupportTicketModel } from "../models/SupportModel.js";
import { SupportTicket } from "modules/customer-support/domain/SupportTicket.js";

export const SupportRepoMongo: SupportRepoPort = {
    async createSupportTicket(data) {
        const newTicket = new SupportTicketModel({
            ...data,
            whenToCall: new Date(data.whenToCall)
        })
        await newTicket.save();
        return newTicket as unknown as SupportTicket || null;
    },

    async getSupportTickets(query?: any) {
        const filter: any = {};
        if (query?.status) {
            // Handle array (for $in) or single value
            filter.status = Array.isArray(query.status) ? { $in: query.status } : query.status;
        }

        let mongoQuery = SupportTicketModel.find(filter)
            .populate('patientId', 'fullName email phoneNumber') // Populate patient details
            .sort({ createdAt: -1 });

        if (query?.limit) {
            mongoQuery = mongoQuery.limit(Number(query.limit));
        }

        const tickets = await mongoQuery.lean();
        return tickets as unknown as Array<SupportTicket> || null;
    },

    async getsupportTicketsByPatient(patientId: string) {
        const tickets = await SupportTicketModel.find({ patientId })
            .populate('patientId', 'fullName email phoneNumber')
            .lean();
        return tickets as unknown as Array<SupportTicket> || null;
    },

    async getSupportTicket(id: string) {
        const ticket = await SupportTicketModel.findOne({ _id: id })
            .populate('patientId', 'fullName email phoneNumber')
            .lean();
        return ticket as unknown as SupportTicket || null;
    },

    async updateSupportTicketStatus(ticketId: string, completed: boolean) {
        const ticket = await SupportTicketModel.updateOne({ _id: ticketId }, { $set: { completed } });
        return ticket as unknown as SupportTicket || null;
    },

    async deleteSupportTicket(id: string) {
        const result = await SupportTicketModel.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }
}