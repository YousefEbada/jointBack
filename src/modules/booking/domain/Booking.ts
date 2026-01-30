import { Schema } from "mongoose";

export type BookingStatus = 'confirmed' | 'rescheduled' | 'cancelled' | 'noShow' | 'inProgress' | 'pending';
export type BookingType = 'consultation' | 'followUp' | 'emergency' | 'session';

export interface Booking {
  _id: string;
  patientNixpendId: string;
  doctorNixpendId: string;
  branchId?: string;
  sessionId?: string | Schema.Types.ObjectId | null;
  eventName: string;
  appointmentNixpendId: string;
  appointmentDate: Date;
  appointmentTime: string;
  slotStart?: Date;
  slotEnd?: Date;
  appointmentDuration: number;
  bookingType: BookingType;
  status: BookingStatus;
  department: string;
  company: string;
  reminder24hSent: boolean;
  reminder1hSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}
