export class CreateExercise {
    blob;
    exercise;
    constructor(blob, exercise) {
        this.blob = blob;
        this.exercise = exercise;
    }
    async exec(input) {
        try {
            console.log("============ CreateExercise Input: ", input);
            const blobName = await this.blob.upload(input.file.originalname, input.file.buffer, input.file.mimetype);
            console.log("============ Uploaded Blob Name: ", blobName);
            const res = await this.exercise.create({
                title: input.title,
                description: input.description,
                videoBlobName: blobName
            });
            console.log("============ Created Exercise: ", res);
            if (!res) {
                return { ok: false, message: "Exercise creation failed" };
            }
            return { ok: true, data: res };
        }
        catch (error) {
            console.error("============ CreateExercise Error: ", error);
            return { ok: false, message: "Something went wrong" };
        }
    }
}
