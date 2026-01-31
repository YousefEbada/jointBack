export class CancelBooking {
    repo;
    nixpendAdapter;
    constructor(repo, nixpendAdapter) {
        this.repo = repo;
        this.nixpendAdapter = nixpendAdapter;
    }
    async exec(bookingId, data) {
        const booking = await this.repo.findById(bookingId);
        if (!booking) {
            return { ok: false, error: 'Booking not found' };
        }
        try {
            const res = await this.nixpendAdapter.cancelAppointment(data);
            if (!res || !res.success) {
                return { ok: false, error: 'Failed to cancel appointment in Nixpend' };
            }
            const canceled = await this.repo.cancel(booking);
            console.log("Booking canceled:", canceled);
            return { ok: true, booking: canceled };
        }
        catch (error) {
            console.error("Exception during cancellation:", error.message);
            return { ok: false, error: 'Exception occurred during cancellation' };
        }
    }
}
