import { Booking } from '../../domain/Booking.js';
export interface BookingRepoPort {
  findById(id: string): Promise<Booking | null>;
  getAllBookings(): Promise<Booking[]>;
  book(b: Omit<Booking, '_id'|'createdAt'|'updatedAt'|'status'|'reminder24hSent'|'reminder1hSent'>, options?: { tx?: any }): Promise<Booking>;
  reschedule(b: Omit<Partial<Booking>, 'createdAt'|'updatedAt'>, options?: { tx?: any }): Promise<Booking>;
  cancel(b: Booking, options?: { tx?: any }): Promise<Boolean>
  // I should put reminders here
  findBookingsByPatient(patientId: string): Promise<Booking[]>;
  // findBookingsByDoctorAndPatient(patientId: string, doctorId: string): Promise<{ _id: string; name: string } | null>;
  // to get patients related by doctors through booking
  findPatientsByDoctorAndStatus(doctorId: string, status?: 'active' | 'inactive'): Promise<{_id: string, name: string, injury: string, status: string}[]>;
  findBookingsByDoctor(doctorId: string): Promise<Booking[]>;
  findBookingsByDoctorAndDay(doctorId: string, day: Date): Promise<Booking[]>;
  findBookingsByDoctorAndWeek(doctorId: string, weekStart: Date): Promise<Booking[]>;
  findBookingsByDoctorAndMonth(doctorId: string, monthStart: Date): Promise<Booking[]>;
  existsOverlap(doctorId: string, start: Date, end: Date): Promise<boolean>;
  setStatus(id: string, status: Booking['status']): Promise<void>;
}
