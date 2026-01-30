import { z } from 'zod';
export const UploadReportSchema = z.object({
  patientId: z.string().min(1),
  visitId: z.string().optional(),
  fileBase64: z.string().min(10)
});
