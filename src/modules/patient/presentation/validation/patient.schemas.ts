import { z } from 'zod';

// Injury details schema
const injuryDetailsSchema = z.object({
  affectedArea: z.string().optional(),
  startDate: z.date().optional(),
  receivedTreatment: z.boolean().optional(),
  painSeverity: z.number().min(0).max(10).optional(), // 0-10 scale
  howDidInjurHappened: z.string().optional(),
  affectDailyActivities: z.boolean().optional(),
  additionalNotes: z.string().optional(),
  // check this from the report module and how to sync it
  medicalReports: z.array(z.string()).optional(),
}).optional();

// Main patient schema
export const patientSchema = z.object({
  userId: z.string(),
  nixpendId: z.string(),
  // Note: Guardian information is accessed through User.guardianInformation via userId reference
  medicalRecordNumber: z.string().optional(),
  insuranceId: z.string().optional(),
  bloodGroup: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  medicalHistory: z.array(z.string()).optional(),
  injuryDetails: injuryDetailsSchema,
  status: z.enum(['active', 'inactive']).optional(),
  notes: z.string().optional(),
});

// // Type inference for TypeScript
// export type PatientSchema = z.infer<typeof patientSchema>;

// // Create patient schema (for POST requests - might exclude some fields like userId)
// export const createPatientSchema = patientSchema.omit({ userId: true });

// // Update patient schema (all fields optional except identifiers)
// export const updatePatientSchema = patientSchema.partial().required({ 
//   userId: true,
//   nixpendId: true 
// });

// // Patient query/filter schema
// export const patientQuerySchema = z.object({
//   userId: z.string().optional(),
//   nixpendId: z.string().optional(),
//   status: z.enum(['active', 'inactive']).optional(),
//   bloodGroup: z.string().optional(),
// }).optional();
