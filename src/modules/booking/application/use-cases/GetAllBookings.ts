import { BookingRepoPort } from "../ports/BookingRepoPort.js";

export class GetAllBookings {
    constructor(private bookingRepo: BookingRepoPort) {}
    async exec() {
        try {
            const bookings = await this.bookingRepo.getAllBookings();
            if (!bookings) {
                return { ok: false, error: 'No bookings found' };
            }
            return { ok: true, data: bookings };
        } catch (error) {
            return { ok: false, error: 'Failed to retrieve bookings' };
        }
    }
}