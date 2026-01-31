export class GetPatientByUser {
    patientRepo;
    constructor(patientRepo) {
        this.patientRepo = patientRepo;
    }
    async exec(userId) {
        try {
            const patient = await this.patientRepo.getPatientByUserId(userId);
            if (!patient) {
                return { ok: false, error: 'Patient Not Found' };
            }
            return { ok: true, patient };
        }
        catch (error) {
            console.error("[GetPatientByUser] Error fetching patient by userId:", error.message);
            return { ok: false, error: 'Internal Server Error' };
        }
    }
}
