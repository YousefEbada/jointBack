import { TreatmentPlan } from "modules/treatment-plan/domain/TreatmentPlan.js";

export interface RepoTxOptions {
    tx?: any; 
}

export interface TreatmentRepoPort {
    createTreatmentPlan(plan: Omit<TreatmentPlan, '_id' | 'createdAt' | 'updatedAt'>, options?: RepoTxOptions): Promise<TreatmentPlan>;
    findTreatmentPlanById(id: string): Promise<TreatmentPlan | null>;
    updateTreatmentPlan(id: string, updates: Partial<TreatmentPlan>, options?: RepoTxOptions): Promise<TreatmentPlan | null>;
    findActiveTreatmentPlanByPatient(patientId: string): Promise<TreatmentPlan | null>;
    // updateTreatmentPlan(id: string, updates: Partial<TreatmentPlan>): Promise<TreatmentPlan | null>;
    // findActiveTreatmentPlanByPatient(patientId: string): Promise<TreatmentPlan | null>;
}