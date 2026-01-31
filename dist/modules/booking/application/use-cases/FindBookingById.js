export class FindBookingById {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async exec(bookingId) {
        try {
            const booking = await this.repo.findById(bookingId);
            if (!booking) {
                return { ok: false, error: 'Booking not found' };
            }
            return { ok: true, booking };
        }
        catch (error) {
            return { ok: false, error: 'Error retrieving booking' };
        }
    }
}
