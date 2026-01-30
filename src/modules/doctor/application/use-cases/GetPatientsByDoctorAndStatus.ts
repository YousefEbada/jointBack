import { BookingRepoPort } from "modules/booking/application/ports/BookingRepoPort.js";

export class GetPatientsByDoctorAndStatus {
    constructor(private bookingRepo: BookingRepoPort) {}
    async exec(doctorId: string, status: 'active' | 'inactive' = 'active') {
        try {
            const patients = await this.bookingRepo.findPatientsByDoctorAndStatus(doctorId, status);
            if (!patients.length) {
                return { ok: false, error: 'No patients found for this doctor with the specified status' };
            }
            return { ok: true, patients };
        } catch (error) {
            console.error("Error retrieving patients by doctor and status:", (error as Error).message);
            return { ok: false, error: 'Failed to retrieve patients' };
        }
    }
}