export class UpdateBookingStatus {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async exec(bookingId, status) {
        try {
            await this.repo.setStatus(bookingId, status);
            return { ok: true, message: 'Status updated successfully' };
        }
        catch (error) {
            return { ok: false, error: 'Internal server error' };
        }
    }
}
