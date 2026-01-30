import { Patient } from "modules/patient/domain/Patient.js";
import { PatientRepoPort } from "../ports/PatientRepoPort.js";
import { User } from "modules/auth/domain/User.js";
import { UpdateType } from "modules/integration/domain/Nixpend.js";
import { UserRepoPort } from "modules/auth/application/ports/UserRepoPort.js";
import { NixpendPort } from "modules/integration/ports/NixpendPorts.js";

export class UpdatePatient {
    constructor(private patientRepo: PatientRepoPort, private userRepo: UserRepoPort, private nixpendAdapter: NixpendPort) { }

    private DOMAIN_MAP = {
        user: [
            "fullName",
            "email",
            "phone",
            "birthdate",
            "nationality",
            "address",
            "city",
            "maritalStatus",
            "speakingLanguages",
            "guardianInformation",
            "patientCategory"
        ],
        patient: [
            "guardianInformation",
            "medicalRecordNumber",
            "insuranceId",
            "bloodGroup",
            "allergies",
            "medicalHistory",
            "injuryDetails",
            "notes"
        ],
        nixpend: [
            "occupation",
            "email",
            "speaking_language",
            "mobile",
            "country",
            "city",
            "address",
            "marital_status_2",
            "second_mobile_number"
        ]
    };

    async exec(patientId: string, data: Partial<Patient & User & UpdateType>): Promise<any> {
        const userFields: Partial<User> = {};
        const patientFields: Partial<Patient> = {};
        const nixpendFields: Partial<UpdateType> = {};

        const patient = await this.patientRepo.getPatient(patientId);
        if (!patient) {
            return { ok: false, error: "Patient not found" };
        }

        // If phone changes, sync to nixpend mobile
        if (data.phone !== undefined) {
            nixpendFields.mobile = data.phone; 
        }
        
        // Split fields dynamically based on DOMAIN_MAP
        for (const key of Object.keys(data)) {
            const value = data[key as keyof typeof data];

            if (this.DOMAIN_MAP.user.includes(key) && value !== undefined) {
                userFields[key as keyof User] = value as any; // <-- cast to bypass TS union issue
            }
            if (this.DOMAIN_MAP.patient.includes(key) && value !== undefined) {
                patientFields[key as keyof Patient] = value as any;
            }
            if (this.DOMAIN_MAP.nixpend.includes(key) && value !== undefined) {
                nixpendFields[key as keyof UpdateType] = value as any;
            }
        }

        try {

            const updatePromises = [];
            // update patient, user, nixpend to be in sync
            if (Object.keys(patientFields).length) {
                updatePromises.push(this.patientRepo.updatePatient(patientId, patientFields))
            }

            if (Object.keys(userFields).length) {
                updatePromises.push(this.userRepo.updateUserInfo(patient.userId, { ...userFields }));
            }

            if (Object.keys(nixpendFields).length) {
                updatePromises.push(this.nixpendAdapter.updatePatient(patient?.nixpendId, { ...nixpendFields }));
            }

            const [updatedPatient, updatedUser] = await Promise.all(updatePromises);
            console.log("\nUpdated patient:", updatedPatient, "\nUpdated user:", updatedUser);

            return {
                ok: true,
                updatedUser: Object.keys(userFields).length ? updatedUser : null,
                patient: updatedPatient
            };
        } catch (error) {
            console.error("[UpdatePatient.exec] Error:", (error as any).message);
            return { ok: false, error: "Internal error" };
        }
    }
}
