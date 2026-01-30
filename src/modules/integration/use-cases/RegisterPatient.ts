import { RegisterType } from "modules/integration/domain/Nixpend.js";
import { PatientRepoPort } from "../../patient/application/ports/PatientRepoPort.js";
import { NixpendPort } from "modules/integration/ports/NixpendPorts.js";

export class RegisterPatient {
    constructor(private patientRepo: PatientRepoPort, private nixpendAdapter: NixpendPort) { }
    async exec(registerData: RegisterType): Promise<any> {
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
            if(nixpendPatient == null) {
                return { ok: false, error: "Failed to register patient in Nixpend" };
            }
            return { ok: true, patient: nixpendPatient as any };
        } catch (error) {
            console.error("[RegisterPatient.exec] Error:", (error as any).message);
            return { ok: false, error: "Internal error" };
        }
    }
}