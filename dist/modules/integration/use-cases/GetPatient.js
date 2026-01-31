export class GetPatient {
    patientRepo;
    nixpendAdapter;
    constructor(patientRepo, nixpendAdapter) {
        this.patientRepo = patientRepo;
        this.nixpendAdapter = nixpendAdapter;
    }
    async exec(type, value) {
        try {
            const nixpendPatient = await this.nixpendAdapter.findPatient(type, value);
            // const patient = await this.patientRepo.getPatient(patientId);
            // if (!patient) {
            //     return { ok: false, error: "Patient not found" };
            // }
            // return { ok: true, patient };
            return { ok: true, nixpendPatient };
            // fetch from nixpend
        }
        catch (err) {
            console.error("[GetPatient.exec] Error:", err.message);
            return { ok: false, error: "Internal error" };
        }
    }
}
