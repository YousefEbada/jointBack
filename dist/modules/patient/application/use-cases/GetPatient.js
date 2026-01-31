export class GetPatient {
    patientRepo;
    constructor(patientRepo) {
        this.patientRepo = patientRepo;
    }
    async exec(patientId) {
        try {
            const patient = await this.patientRepo.getPatient(patientId);
            if (!patient) {
                return { ok: false, error: "Patient not found" };
            }
            return { ok: true, patient };
        }
        catch (error) {
            console.error("[GetPatient.exec] Error:", error.message);
            return { ok: false, error: "Internal error" };
        }
    }
}
