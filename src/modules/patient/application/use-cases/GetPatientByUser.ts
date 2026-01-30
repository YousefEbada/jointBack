import { Patient } from "modules/patient/domain/Patient.js";
import { PatientRepoPort } from "../ports/PatientRepoPort.js";
import { GetPatient } from "./GetPatient.js";

type GetPatientReturn = {
    ok: true | false;
    patient?: Patient;
    error?: string;
}

export class GetPatientByUser {
    constructor(private patientRepo: PatientRepoPort) {}
    async exec(userId: string): Promise<GetPatientReturn> {
        try {
            const patient = await this.patientRepo.getPatientByUserId(userId);
            if (!patient) {
                return { ok: false, error: 'Patient Not Found' };
            }
            return { ok: true, patient };
        } catch (error) {
            console.error("[GetPatientByUser] Error fetching patient by userId:", (error as Error).message);
            return { ok: false, error: 'Internal Server Error' };
        }
    }
}