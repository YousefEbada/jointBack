export class RegisterPatient {
    patientRepo;
    nixpendAdapter;
    constructor(patientRepo, nixpendAdapter) {
        this.patientRepo = patientRepo;
        this.nixpendAdapter = nixpendAdapter;
    }
    async exec(registerData) {
        try {
            // put the nationality as country name
            // let patient = await this.patientRepo.getPatient(id);
            // if (!patient) {
            //     return { ok: false, error: "Patient not found" };
            // }
            // let {firstName, lastName, nationality, mobile, sex} = registerData;
            const nixpendPatient = await this.nixpendAdapter.registerPatient(registerData);
            // create patient in local db
            // const newPatient = await this.patientRepo.createPatient({
            //     nixpendId: nixpendPatient.id,
            //     userId: null,
            //     guardianInformation: null,
            //     medicalRecordNumber: null,
            //     insuranceId: null,
            //     bloodGroup: null,
            //     allergies: [],
            //     medicalHistory: [],
            //     notes: ""
            // });
            // if (!newPatient) {
            //     return { ok: false, error: "Failed to create patient" };
            // }
            if (nixpendPatient == null) {
                return { ok: false, error: "Failed to register patient in Nixpend" };
            }
            return { ok: true, patient: nixpendPatient };
        }
        catch (error) {
            console.error("[RegisterPatient.exec] Error:", error.message);
            return { ok: false, error: "Internal error" };
        }
    }
}
