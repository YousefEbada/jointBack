import { Doctor } from "modules/doctor/domain/Doctor.js";

export interface DoctorRepoPort {
  saveMany(practitioners: any[]): Promise<void>;
  getAll(branch?: string, department?: string): Promise<any[]>;
  findById(id: string): Promise<Partial<Doctor> | null>;
  findByNixpendId(id: string): Promise<Partial<Doctor> | null>;
  assignExercise(doctorNixpendId: string, patientNixpendId: string, exerciseId: string, dueDate?: Date): Promise<any>;
  getAssignedExercises(doctorNixpendId: string, patientNixpendId: string): Promise<any[]>;
  clear(): Promise<void>;
}