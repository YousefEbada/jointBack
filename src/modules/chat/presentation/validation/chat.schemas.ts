import { z } from 'zod';

export const createRoomSchema = z.object({
    patientId: z.string().min(1, 'Patient ID is required'),
    doctorId: z.string().min(1, 'Doctor ID is required'),
    metadata: z.object({
        patientName: z.string().optional(),
        doctorName: z.string().optional(),
        bookingId: z.string().optional()
    }).optional()
});

export const sendMessageSchema = z.object({
    roomId: z.string().min(1, 'Room ID is required'),
    messageType: z.enum(['text', 'image', 'file', 'system']).default('text'),
    content: z.string().min(1, 'Message content is required'),
    fileUrl: z.string().url().optional(),
    fileName: z.string().optional(),
    fileSize: z.number().positive().optional(),
    mimeType: z.string().optional(),
    metadata: z.object({
        replyTo: z.string().optional()
    }).optional()
});

export const getRoomMessagesSchema = z.object({
    roomId: z.string().min(1, 'Room ID is required'),
    page: z.string().transform(val => parseInt(val, 10)).pipe(z.number().positive()).default('1'),
    limit: z.string().transform(val => parseInt(val, 10)).pipe(z.number().positive().max(100)).default('50')
});

export const markMessagesReadSchema = z.object({
    roomId: z.string().min(1, 'Room ID is required')
});

export type CreateRoomRequest = z.infer<typeof createRoomSchema>;
export type SendMessageRequest = z.infer<typeof sendMessageSchema>;
export type GetRoomMessagesRequest = z.infer<typeof getRoomMessagesSchema>;
export type MarkMessagesReadRequest = z.infer<typeof markMessagesReadSchema>;