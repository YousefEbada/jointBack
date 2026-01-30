// import { SessionRepoPort } from '../ports/SessionRepoPort.js';
// import { Session, SessionType } from '../../domain/Session.js';

// type CreateSessionInput = {
//   patientId: string;
//   doctorId: string;
//   sessionType: SessionType;
//   scheduledDate: Date;
//   scheduledTime: string;
//   duration?: number;
//   treatmentPlanId: string;
//   sessionNumber: number;
//   notes?: string;
// };

// type CreateSessionResult = 
//   | { ok: true; session: Session }
//   | { ok: false; error: string };

// export class CreateSession {
//   constructor(private repo: SessionRepoPort) {}

//   async exec(data: CreateSessionInput): Promise<CreateSessionResult> {
//     try {
//       // Validate treatment plan exists
//       const treatmentPlan = await this.repo.findTreatmentPlanById(data.treatmentPlanId);
//       if (!treatmentPlan) {
//         return { ok: false, error: 'Treatment plan not found' };
//       }

//       // Check if session number already exists for this treatment plan
//       const existingSessions = await this.repo.findSessionsByPatient(data.patientId);
//       const existingSession = existingSessions.find(s => 
//         s.treatmentPlanId === data.treatmentPlanId && 
//         s.sessionNumber === data.sessionNumber
//       );

//       if (existingSession) {
//         return { ok: false, error: 'Session number already exists for this treatment plan' };
//       }

//       const session = await this.repo.createSession({
//         ...data,
//         duration: data.duration || 60,
//         status: 'scheduled'
//       });

//       return { ok: true, session };
//     } catch (error) {
//       console.error('Error creating session:', error);
//       return { ok: false, error: 'Failed to create session' };
//     }
//   }
// }