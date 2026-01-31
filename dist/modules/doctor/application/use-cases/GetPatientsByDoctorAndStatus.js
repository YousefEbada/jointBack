export class GetPatientsByDoctorAndStatus {
    bookingRepo;
    constructor(bookingRepo) {
        this.bookingRepo = bookingRepo;
    }
    async exec(doctorId, status = 'active') {
        try {
            const patients = await this.bookingRepo.findPatientsByDoctorAndStatus(doctorId, status);
            if (!patients.length) {
                return { ok: false, error: 'No patients found for this doctor with the specified status' };
            }
            return { ok: true, patients };
        }
        catch (error) {
            console.error("Error retrieving patients by doctor and status:", error.message);
            return { ok: false, error: 'Failed to retrieve patients' };
        }
    }
}
