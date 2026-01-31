import { SupportTicketModel } from "../models/SupportModel.js";
export const SupportRepoMongo = {
    async createSupportTicket(data) {
        const newTicket = new SupportTicketModel({
            ...data,
            whenToCall: new Date(data.whenToCall)
        });
        await newTicket.save();
        return newTicket || null;
    },
    async getSupportTickets(query) {
        const filter = {};
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
        return tickets || null;
    },
    async getsupportTicketsByPatient(patientId) {
        const tickets = await SupportTicketModel.find({ patientId })
            .populate('patientId', 'fullName email phoneNumber')
            .lean();
        return tickets || null;
    },
    async getSupportTicket(id) {
        const ticket = await SupportTicketModel.findOne({ _id: id })
            .populate('patientId', 'fullName email phoneNumber')
            .lean();
        return ticket || null;
    },
    async updateSupportTicketStatus(ticketId, completed) {
        const ticket = await SupportTicketModel.updateOne({ _id: ticketId }, { $set: { completed } });
        return ticket || null;
    },
    async deleteSupportTicket(id) {
        const result = await SupportTicketModel.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }
};
