import {z} from 'zod';

export const TreatmentPlanSchema = z.object({
    patientId: z.string().min(1),
    doctorId: z.string().min(1),
    totalSessions: z.number().min(1),
    treatmentLength: z.number().min(1),
    sessionsPerWeek: z.number().min(1),
    treatmentStartDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format" }).transform(val => new Date(val)),
    treatmentEndDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format" }).optional().transform(val => val ? new Date(val) : undefined),
    treatmentGoals: z.array(z.string().min(1)).min(1),
    status: z.enum(['active', 'completed', 'cancelled', 'paused']).optional()
});