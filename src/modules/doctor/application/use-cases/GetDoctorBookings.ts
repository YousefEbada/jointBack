import { BookingRepoPort } from '../../../booking/application/ports/BookingRepoPort.js';
import { SessionRepoPort } from '../../../session/application/ports/SessionRepoPort.js';

export class GetDoctorBookings {
  constructor(private repo: BookingRepoPort, private sessionRepo: SessionRepoPort) {}
  async exec(doctorId: string, period: 'day' | 'week' | 'month' | undefined | null, date: Date) {
    try {
      // i prefer to be new Date but i want to make sure should i get it from the controller or the frontend or initalize it here
      // or should i use startOfweek or something like that from dayjs
      const targetDate = date || new Date();
      let bookings;
      switch (period) {
        case 'day':
          console.log('Getting bookings for day:', targetDate);
          bookings = await this.repo.findBookingsByDoctorAndDay(doctorId, targetDate);
          break;
        case 'week':
          console.log('Getting bookings for week of:', targetDate);
          bookings = await this.repo.findBookingsByDoctorAndWeek(doctorId, targetDate);
          break;
        case 'month':
          console.log('Getting bookings for month of:', targetDate);
          bookings = await this.repo.findBookingsByDoctorAndMonth(doctorId, targetDate);
          break;
        default:
          console.log('Getting all bookings for doctor:', doctorId);
          bookings = await this.repo.findBookingsByDoctor(doctorId);
          break;
      }
      if (!bookings) {
        return {ok: false, error: 'No bookings found for this doctor'};
      }
      return {ok: true, bookings};
    } catch (error) {
      console.error('Error getting doctor dashboard:', error);
      return { ok: false, error: 'Failed to get doctor dashboard data' };
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