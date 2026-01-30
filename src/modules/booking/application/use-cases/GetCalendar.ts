import { BookingRepoPort } from '../ports/BookingRepoPort.js';

export class GetCalendar {
  constructor(private repo: BookingRepoPort) {}
  async exec(doctorId: string, day: Date) {
    return this.repo.findBookingsByDoctorAndDay(doctorId, day);
  }
}
