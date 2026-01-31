export class GetAllPatientBookings {
    bookingRepo;
    patientRepo;
    constructor(bookingRepo, patientRepo) {
        this.bookingRepo = bookingRepo;
        this.patientRepo = patientRepo;
    }
    async exec(patientId) {
        try {
            const patient = await this.patientRepo.getPatient(patientId);
            if (!patient || !patient.nixpendId) {
                return { ok: false, error: 'Patient or Patient Nixpend ID not found' };
            }
            const bookings = await this.bookingRepo.findBookingsByPatient(patient.nixpendId);
            if (!bookings) {
                return { ok: false, error: 'No bookings found for this patient' };
            }
            return { ok: true, data: bookings };
        }
        catch (error) {
            return { ok: false, error: 'Internal server error' };
        }
    }
}
