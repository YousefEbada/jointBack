import mongoose, { Schema } from "mongoose";

const SupportTicketSchema = new Schema({
    patientId: { type: Schema.Types.ObjectId, required: true },
    patientName: { type: String, required: true }, // Added patientName
    contact: { type: String, required: true },
    inquiryDept: { type: String, required: true },
    whenToCall: { type: Date, required: true },
    message: { type: String, required: true },
    completed: { type: Boolean, default: false },
}, { timestamps: true })

export const SupportTicketModel = mongoose.model('SupportTicket', SupportTicketSchema);