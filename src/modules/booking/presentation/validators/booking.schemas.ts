import { z } from 'zod';

export const CreateBookingSchema = z.object({
  practitioner: z.string().min(1),
  patient: z.string().min(1),
  branch: z.string().optional(),
  daily_practitioner_event: z.string().min(1),
  appointment_date: z.string().min(1),
  appointment_time: z.string().min(1),
  duration: z.number().int().min(15).max(180),
  appointment_type: z.string().min(1),
  department: z.string().min(1)
});

export const CalendarQuerySchema = z.object({
  doctorId: z.string().min(1),
  day: z.coerce.date().optional() // default: today 
});

export const CancelBookingSchema = z.object({
  reason: z.string().optional(),
  cancelled_by: z.string().min(1)
});

export const RescheduleBookingSchema = z.object({
  practitioner: z.string().min(1),
  appointment_date: z.string().min(1),
  appointment_time: z.string().min(1),
  duration: z.number().int().min(15).max(180),
  appointment_type: z.string().min(1),
  department: z.string().min(1),
  company: z.string().min(1)
});

export const UpdateStatusSchema = z.object({
  status: z.enum(['confirmed', 'rescheduled', 'cancelled', 'noShow', 'inProgress', 'pending'])
});

export const DoctorBookingsQuerySchema = z.object({
  doctorId: z.string().min(1),
  period: z.enum(['day', 'week', 'month']).optional().default('day'),
  date: z.coerce.date().optional()
});