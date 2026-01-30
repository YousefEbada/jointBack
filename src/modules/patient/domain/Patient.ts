export interface Patient {
    _id?: string;
    userId: string;
    nixpendId: string;
    // Note: Guardian information is accessed through User.guardianInformation via userId reference
    // medicalRecordNumber?: string;
    // insuranceId?: string;
    // bloodGroup?: string;
    // allergies?: string[];
    // medicalHistory?: string[];
    injuryDetails?: {
        affectedArea?: string;
        startDate?: Date;
        receivedTreatment?: boolean;
        painSeverity?: number; // 0-10 scale
        howDidInjurHappened?: string;
        painOccasionalOrConstant?: 'occasional' | 'constant';
        affectDailyActivities?: boolean;
        additionalNotes?: string;
        // check this from the report module and how to sync it
        medicalReports?: string[];
    };
    status?: 'active' | 'inactive';
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}