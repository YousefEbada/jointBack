import { BookingRepoPort } from "../ports/BookingRepoPort.js";

export class FindBookingById {
  constructor(private repo: BookingRepoPort) {}
    async exec(bookingId: string) {
        try {
            const booking =  await this.repo.findById(bookingId);
            if(!booking) {
              return { ok: false, error: 'Booking not found' };
            }
            return { ok: true, booking };
        } catch (error) {
            return { ok: false, error: 'Error retrieving booking' };
        }
    }
}