import dayjs from 'dayjs';
import { z } from 'zod';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);

export const RequestOtpSchema = z.object({ subjectType: z.enum(['report', 'login', 'register']), subjectRef: z.string().min(1), contact: z.string().min(1).optional() });
export const FindUserSchema = z.object({ contact: z.string().min(1) });
export const CreatePartialUserSchema = z.object({ fullName: z.string().min(1), gender: z.enum(['Male','Female','male','female']), contact: z.string().min(1), birthdate: z.string().refine(val => dayjs(val,"YYYY-MM-DD",true).isValid(), { message: "Invalid date format, expected YYYY-MM-DD" }).transform(val => dayjs.utc(val).toDate()) });
export const VerifyOtpSchema = z.object({ otpToken: z.string().min(1), code: z.string().length(6) });
export const CreateFullUserSchema = z.object({
    userId: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(1).optional(),
    identifier: z.string().min(1).optional(),
    identifierType: z.string().min(1).optional(),
    nationality: z.string().min(1).optional(),
    address: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    maritalStatus: z.string().min(1).optional(),
    speakingLanguages: z.array(z.string().min(1)).optional(),
    guardianInformation: z.object({
        guardianName: z.string().optional(),
        guardianEmail: z.string().optional(),
        guardianPhone: z.string().optional(),
        guardianBloodType: z.string().optional(),
        guardianRelation: z.string().optional(),
        guardianIdentifier: z.string().optional(),
        guardianIdentifierType: z.string().optional(),
        patientCategory: z.string().optional(),
    }).optional(),
});
