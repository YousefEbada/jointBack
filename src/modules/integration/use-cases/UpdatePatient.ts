import { Patient } from "modules/patient/domain/Patient.js";
import { PatientRepoPort } from "../../patient/application/ports/PatientRepoPort.js";
import { NixpendPort } from "modules/integration/ports/NixpendPorts.js";
import { UpdateType } from "modules/integration/domain/Nixpend.js";

type UpdatePatientResult =
    | { ok: true; patient: any }
    | { ok: false; error: string }

type PatientKeys = keyof Patient;

export class UpdatePatient {
    constructor(private patientRepo: PatientRepoPort, private nixpendAdapter: NixpendPort) { }

    async exec(patientId: string, updateData: UpdateType): Promise<UpdatePatientResult> {
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
            return { ok: true, patient: nixpendPatient as any as Patient };
        } catch (error) {
            console.error("[UpdatePatient.exec] Error:", (error as any).message);
            return { ok: false, error: "Internal error" };
        }
    }
}