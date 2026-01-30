import { Session, SessionProgress } from '../../domain/Session.js';

export interface SessionRepoPort {
  // Session management
  createSession(session: Omit<Session, '_id' | 'createdAt' | 'updatedAt'>): Promise<Session>;
  createSessionsBatch(sessions: Omit<Session, '_id' | 'createdAt' | 'updatedAt'>[], options?: { tx?: any }): Promise<Session[]>;
  findSessionById(id: string, options?: { tx?: any }): Promise<Session | null>;
  updateSession(id: string, updates: Partial<Session>, options?: { tx?: any }): Promise<Session | null>;
  deleteSession(id: string, options?: { tx?: any }): Promise<boolean>;
  startTransaction(): Promise<{
    session: any;
    commit(): Promise<void>;
    abort(): Promise<void>;
  }>;
  
  // Patient session queries
  findSessionsByPatient(patientId: string): Promise<Session[]>;
  findUpcomingSessionsByPatient(patientId: string): Promise<Session[]>;
  findCompletedSessionsByPatient(patientId: string): Promise<Session[]>;
  
  // Doctor session queries
  findSessionsByDoctor(doctorId: string): Promise<Session[]>;
  findSessionsByDoctorAndDate(doctorId: string, date: Date): Promise<Session[]>;
  findSessionsByDoctorAndWeek(doctorId: string, weekStart: Date): Promise<Session[]>;
  findSessionsByDoctorAndMonth(doctorId: string, monthStart: Date): Promise<Session[]>;
  
  // Treatment plan management
  getCompletedSessionsByTreatmentPlan(patientId: string, treatmentPlanId: string): Promise<number>;
  getSessionsByTreatmentPlan(patientId: string, treatmentPlanId: string): Promise<Session[] | null>;
  findNextUpcomingSessionByPatientAndTreatmentPlan(patientId: string, treatmentPlanId: string): Promise<Session | null>;
  
  // Progress tracking
  // getPatientProgress(patientId: string): Promise<SessionProgress | null>;
  updateSessionStatus(sessionId: string, status: Session['status']): Promise<void>;
  // markSessionCompleted(sessionId: string, progressNotes?: string): Promise<void>;
}