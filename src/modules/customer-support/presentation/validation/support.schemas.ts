import { z } from 'zod';

// Support ticket schema for creation
export const createSupportTicketSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  patientName: z.string().min(1, "Patient name is required"),
  contact: z.string().min(1, "Contact information is required"),
  inquiryDept: z.string().min(1, "Inquiry department is required"),
  whenToCall: z.string().datetime("Invalid date format for whenToCall").or(z.date()),
  message: z.string().min(1, "Message is required").max(1000, "Message too long"),
});

// Support ticket schema for updates
export const updateSupportTicketSchema = z.object({
  completed: z.boolean(),
});

// Query parameters schema
export const getSupportTicketsQuerySchema = z.object({
  patientId: z.string().optional(),
  completed: z.enum(['true', 'false']).optional(),
  inquiryDept: z.string().optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  offset: z.string().regex(/^\d+$/).optional(),
});

// Path parameters schema
export const supportTicketParamsSchema = z.object({
  ticketId: z.string().min(1, "Ticket ID is required"),
});

export const patientParamsSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
});

// Type inference for TypeScript
export type CreateSupportTicketSchema = z.infer<typeof createSupportTicketSchema>;
export type UpdateSupportTicketSchema = z.infer<typeof updateSupportTicketSchema>;
export type GetSupportTicketsQuerySchema = z.infer<typeof getSupportTicketsQuerySchema>;
export type SupportTicketParamsSchema = z.infer<typeof supportTicketParamsSchema>;
export type PatientParamsSchema = z.infer<typeof patientParamsSchema>;