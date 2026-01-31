export class UpdatePatient {
    patientRepo;
    nixpendAdapter;
    constructor(patientRepo, nixpendAdapter) {
        this.patientRepo = patientRepo;
        this.nixpendAdapter = nixpendAdapter;
    }
    async exec(patientId, updateData) {
        try {
            const nixpendPatient = await this.nixpendAdapter.updatePatient(patientId, updateData);
            // const patient = await this.patientRepo.getPatient(patientId);
            // if (!patient) return { ok: false, error: "Patient not found" };
            // const allowedFields: (keyof Patient)[] = [
            //     "_id",
            //     "userId",
            //     "guardianInformation",
            //     "medicalRecordNumber",
            //     "insuranceId",
            //     "bloodGroup",
            //     "allergies",
            //     "medicalHistory",
            //     "notes"
            // ];
            // const invalidKeys = Object.keys(updateData).filter(
            //     (key) => !allowedFields.includes(key as keyof Patient)
            // );
            // if (invalidKeys.length > 0) {
            //     return { ok: false, error: `Invalid fields: ${invalidKeys.join(', ')}` };
            // }
            // const mergedData = {...patient, ...updateData}
            // const updatedPatient = await this.patientRepo.updatePatient(patientId, mergedData);
            // if (!updatedPatient) {
            //     return { ok: false, error: "Failed to update patient" };
            // }
            return { ok: true, patient: nixpendPatient };
        }
        catch (error) {
            console.error("[UpdatePatient.exec] Error:", error.message);
            return { ok: false, error: "Internal error" };
        }
    }
}
