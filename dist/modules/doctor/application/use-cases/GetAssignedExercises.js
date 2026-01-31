export class GetAssignedExercises {
    doctorRepo;
    constructor(doctorRepo) {
        this.doctorRepo = doctorRepo;
    }
    async exec(doctorNixpendId, patientNixpendId) {
        try {
            const exercises = await this.doctorRepo.getAssignedExercises(doctorNixpendId, patientNixpendId);
            if (!exercises.length) {
                return { ok: false, error: 'No assigned exercises have been found' };
            }
            return { ok: true, exercises };
        }
        catch (error) {
            console.error("Error retrieving assigned exercises:", error.message);
            return { ok: false, error: 'Failed to retrieve assigned exercises' };
        }
    }
}
