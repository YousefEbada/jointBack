import { PatientRepoPort } from "../ports/PatientRepoPort.js";

export class GetAllPatients {
    constructor(private patientRepo: PatientRepoPort) {}
    async exec() {
        try {
            const patients = await this.patientRepo.getAllPatients();
            if (!patients) {
                return { ok: false, error: 'No patients found' };
            }
            return { ok: true, data: patients };
        } catch (error) {
            return { ok: false, error: 'Failed to retrieve patients' };
        }
    }
}