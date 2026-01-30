import mongoose, { Schema } from 'mongoose';

const schema = new Schema({
  // patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
  // doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
  // branchId: { type: Schema.Types.ObjectId, ref: "Branch", required: false },
  // sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: false },
  patientNixpendId: { type: String, required: true },
  doctorNixpendId: { type: String, required: true },
  branchId: { type: String, required: false },
  sessionId: { type: String,  required: false },
  eventName: { type: String, required: true },
  appointmentNixpendId: { type: String, required: true, unique: true },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
  slotStart: { type: Date, required: false },
  slotEnd: { type: Date, required: false },   
  appointmentDuration: { type: Number, required: true },
  department: { type: String, required: true },
  company: { type: String, required: true, default: 'Joint Clinic' },
  bookingType: { type: String, enum: ['consultation', 'followUp', 'emergency', 'session'], default: 'consultation' },
  reminder24hSent: { type: Boolean, default: false },
  reminder1hSent: { type: Boolean, default: false },
  status: { type: String, enum: ['confirmed', 'rescheduled', 'cancelled', 'noShow', 'inProgress', 'pending'], default: 'confirmed' }
}, { timestamps: true });     

export const BookingModel = mongoose.model('Booking', schema);
