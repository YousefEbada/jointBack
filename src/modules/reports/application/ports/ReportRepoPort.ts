import { MedicalReport } from '../../domain/MedicalReport.js';
export interface ReportRepoPort {
  // create(r: Omit<MedicalReport, '_id' | 'createdAt'>): Promise<MedicalReport>;
  create(r: Omit<MedicalReport, '_id'>): Promise<MedicalReport>;
  findById(id: string): Promise<MedicalReport | null>;
}
