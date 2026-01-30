import { BlobPort } from "infra/storage/blob.port.js";
import { ExerciseRepoPort } from "../ports/ExerciseRepoPort.js";

export class DeleteExercise {
    constructor(
        private blobPort: BlobPort,
        private exerciseRepo: ExerciseRepoPort
    ) {}
    async exec(exerciseId: string) {
        try {
            const exercise = await this.exerciseRepo.find(exerciseId);
            if (!exercise) {
                return { ok: false, error: 'Exercise not found' };
            }
            // if (exercise.videoBlobId) {
            //     const blobDeleted = await this.blobPort.deleteBlob(exercise.videoBlobId);
            //     if (!blobDeleted) {
            //         return { ok: false, error: 'Failed to delete associated video blob' };
            //     }
            // }
            const deleted = await this.exerciseRepo.delete(exerciseId);
            if (!deleted) {
                return { ok: false, error: 'Failed to delete exercise' };
            }
            return { ok: true, data: 'Exercise deleted successfully' };
        } catch (error) {
            return { ok: false, error: 'Internal server error' };
        }
    }
}