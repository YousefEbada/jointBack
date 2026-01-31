export class AssignExercisesToPatient {
    doctorRepo;
    constructor(doctorRepo) {
        this.doctorRepo = doctorRepo;
    }
    async exec(doctorNixpendId, patientNixpendId, exerciseId, dueDate) {
        console.log("AssignExercisesToPatient Use Case called with:", { doctorNixpendId, patientNixpendId, exerciseId, dueDate });
        try {
            const result = await this.doctorRepo.assignExercise(doctorNixpendId, patientNixpendId, exerciseId, dueDate);
            if (!result) {
                console.error("Failed to assign exercise, no result returned from repository.");
                return { ok: false, error: "Failed to assign exercise" };
            }
            console.log("AssignExercisesToPatient Use Case result:", result);
            return { ok: true, result };
        }
        catch (error) {
            console.error("Error in AssignExercisesToPatient Use Case:", error);
            return { ok: false, error };
        }
    }
}
