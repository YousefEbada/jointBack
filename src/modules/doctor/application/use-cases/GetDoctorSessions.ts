import { BookingRepoPort } from '../../../booking/application/ports/BookingRepoPort.js';
import { SessionRepoPort } from '../../../session/application/ports/SessionRepoPort.js';

export class GetDoctorSessions {
  constructor(private repo: BookingRepoPort, private sessionRepo: SessionRepoPort) {}
  async exec(doctorId: string, period: 'day' | 'week' | 'month' | null | undefined, date: Date) {
    try {
      // i prefer to be new Date but i want to make sure should i get it from the controller or the frontend or initalize it here
      // or should i use startOfweek or something like that from dayjs
      const targetDate = date || new Date();
      let sessions;
      switch (period) {
        case 'day':
          console.log('Getting sessions for day:', targetDate);
          sessions = await this.sessionRepo.findSessionsByDoctorAndDate(doctorId, targetDate);
          break;
        case 'week':
          console.log('Getting sessions for week of:', targetDate);
          sessions = await this.sessionRepo.findSessionsByDoctorAndWeek(doctorId, targetDate);
          break;
        case 'month':
          console.log('Getting sessions for month of:', targetDate);
          sessions = await this.sessionRepo.findSessionsByDoctorAndMonth(doctorId, targetDate);
          break;
        default:
          console.log('Getting all sessions for doctor:', doctorId);
          sessions = await this.sessionRepo.findSessionsByDoctor(doctorId);
          break;
      }
      if (!sessions) {
        return {ok: false, error: 'No sessions found for this doctor'};
      }
      return {ok: true, sessions};
    } catch (error) {
      console.error('Error getting doctor sessions:', (error as Error).message);
      return { ok: false, error: 'Failed to get doctor sessions data' };
    }
  }
}

// private calculateStats(sessions: Session[]) {
//   return sessions.reduce((acc, session) => {
//     acc[session.status] = (acc[session.status] || 0) + 1;
//     return acc;
//   }, {} as Record<string, number>);
// }

// private groupSessionsByStatus(sessions: Session[]) {
//   return {
//     scheduled: sessions.filter(s => s.status === 'scheduled'),
//     inProgress: sessions.filter(s => s.status === 'inProgress'),
//     completed: sessions.filter(s => s.status === 'completed'),
//     cancelled: sessions.filter(s => s.status === 'cancelled'),
//     noShow: sessions.filter(s => s.status === 'noShow')
//   };
// }