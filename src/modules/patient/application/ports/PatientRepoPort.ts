import { Patient } from "modules/patient/domain/Patient.js";

export interface PatientRepoPort {
    getPatient(id: string): Promise<Patient | null>;
    getPatientByUserId(userId: string): Promise<Patient | null>; 
    getAllPatients(): Promise<Patient[]>;
    updatePatient(id: string, data: Partial<Patient>): Promise<Patient | null>;
    createPatient(data: Partial<Patient>): Promise<Patient>;
    updatePatientStatus(id: string, status: Patient['status'], options?: { tx?: any }): Promise<void>;
}