export class GetExerciseVideo {
    blob;
    exercise;
    constructor(blob, exercise) {
        this.blob = blob;
        this.exercise = exercise;
    }
    async exec(exerciseId) {
        try {
            const exercise = await this.exercise.find(exerciseId);
            console.log("============ Exercise: ", exercise);
            if (!exercise) {
                return { ok: false, message: "Exercise not found" };
            }
            ;
            const url = await this.blob.signedUrl(exercise.videoBlobName, 30);
            return { ok: true, data: url };
        }
        catch (error) {
            console.error("============ GetExerciseVideo Error: ", error);
            return { ok: false, message: "Something went wrong" };
        }
    }
}
