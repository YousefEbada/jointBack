// import { SessionRepoPort } from '../ports/SessionRepoPort.js';

// export class CompleteSession {
//   constructor(private repo: SessionRepoPort) {}

//   async exec(sessionId: string, progressNotes?: string) {
//     try {
//       // Verify session exists and is in valid state
//       const session = await this.repo.findSessionById(sessionId);
//       if (!session) {
//         return { ok: false, error: 'Session not found' };
//       }

//       if (session.status === 'completed') {
//         return { ok: false, error: 'Session is already completed' };
//       }

//       if (session.status === 'cancelled') {
//         return { ok: false, error: 'Cannot complete a cancelled session' };
//       }

//       // Mark session as completed (this also updates treatment plan progress)
//       await this.repo.markSessionCompleted(sessionId, progressNotes);

//       // Get updated patient progress
//       const updatedProgress = await this.repo.getPatientProgress(session.patientId);

//       return {
//         ok: true,
//         data: {
//           message: 'Session completed successfully',
//           sessionId,
//           patientProgress: updatedProgress
//         }
//       };
//     } catch (error) {
//       console.error('Error completing session:', error);
//       return { ok: false, error: 'Failed to complete session' };
//     }
//   }
// }