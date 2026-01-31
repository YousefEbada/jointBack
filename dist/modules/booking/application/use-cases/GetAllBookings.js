export class GetAllBookings {
    bookingRepo;
    constructor(bookingRepo) {
        this.bookingRepo = bookingRepo;
    }
    async exec() {
        try {
            const bookings = await this.bookingRepo.getAllBookings();
            if (!bookings) {
                return { ok: false, error: 'No bookings found' };
            }
            return { ok: true, data: bookings };
        }
        catch (error) {
            return { ok: false, error: 'Failed to retrieve bookings' };
        }
    }
}
