import { Booking } from "modules/booking/domain/Booking.js";
import { BookingRepoPort } from "../ports/BookingRepoPort.js";

export class UpdateBookingStatus {
    constructor(private repo: BookingRepoPort) {}
    async exec(bookingId: string, status: Booking['status']) {
        try {
            await this.repo.setStatus(bookingId, status);
            return { ok: true, message: 'Status updated successfully' };
        } catch (error) {
            return { ok: false, error: 'Internal server error' };
        }
    }
}