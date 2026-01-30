import { Patient } from "modules/patient/domain/Patient.js";
import { PatientRepoPort } from "../../patient/application/ports/PatientRepoPort.js";
import { NixpendPort } from "modules/integration/ports/NixpendPorts.js";
import { FetchType } from "modules/integration/domain/Nixpend.js";

type GetPatientResult =
    | { ok: true; patient?: Patient | null; nixpendPatient: any | null }
    | { ok: false; error: string }
    | { ok: true; }

export class GetPatient {
    constructor(private patientRepo: PatientRepoPort, private nixpendAdapter: NixpendPort) { }
    async exec(type: FetchType, value: string): Promise<GetPatientResult> {
        try {
            const nixpendPatient = await this.nixpendAdapter.findPatient(type, value);
            // const patient = await this.patientRepo.getPatient(patientId);
            // if (!patient) {
            //     return { ok: false, error: "Patient not found" };
            // }
            // return { ok: true, patient };
            return { ok: true, nixpendPatient };

            // fetch from nixpend
        } catch (err) {
            console.error("[GetPatient.exec] Error:", (err as any).message);
            return { ok: false, error: "Internal error" };
        }
    }
}
