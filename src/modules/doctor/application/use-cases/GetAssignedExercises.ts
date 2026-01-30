import { DoctorRepoPort } from "../ports/DoctorRepoPort.js";

export class GetAssignedExercises {
    constructor(private doctorRepo: DoctorRepoPort) { }
    async exec(doctorNixpendId: string, patientNixpendId: string) {
        try {
            const exercises = await this.doctorRepo.getAssignedExercises(doctorNixpendId, patientNixpendId);
            if (!exercises.length) {
                return { ok: false, error: 'No assigned exercises have been found' }
            }
            return { ok: true, exercises };
        } catch (error) {
            console.error("Error retrieving assigned exercises:", (error as Error).message);
            return { ok: false, error: 'Failed to retrieve assigned exercises' };
        }
    }
}