import { BlobPort } from "infra/storage/blob.port.js";
import { ExerciseRepoPort } from "../ports/ExerciseRepoPort.js";

export class CreateExercise {
  constructor(private blob: BlobPort, private exercise: ExerciseRepoPort) { }

  async exec(input: {
    title: string;
    description?: string;
    file: {
      originalname: string;
      buffer: Buffer;
      mimetype: string;
    };
  }) {
    try {
      console.log("============ CreateExercise Input: ", input);
      const blobName = await this.blob.upload(
        input.file.originalname,
        input.file.buffer,
        input.file.mimetype
      );

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

    } catch (error) {
      console.error("============ CreateExercise Error: ", error);
      return { ok: false, message: "Something went wrong" };
    }
  }
}
