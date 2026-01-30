export interface TreatmentPlan {
    _id?: string;
    patientId: string;
    doctorId: string;
    totalSessions: number;
    treatmentLength: number;
    sessionsPerWeek: number;
    treatmentStartDate: Date;
    treatmentEndDate?: Date;
    treatmentGoals: string[];
    status: 'active' | 'completed' | 'cancelled' | 'paused';
    createdAt: Date;
    updatedAt: Date;
}