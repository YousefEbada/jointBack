import { BlobPort } from "infra/storage/blob.port.js";
import { ExerciseModel } from "modules/exercise/infrastructure/models/ExerciseModel.js";
import { ExerciseRepoPort } from "../ports/ExerciseRepoPort.js";

export class GetExerciseVideo {
  constructor(private blob: BlobPort, private exercise: ExerciseRepoPort) {}

  async exec(exerciseId: string) {
    try {
      const exercise = await this.exercise.find(exerciseId);
      console.log("============ Exercise: ",exercise);
      if (!exercise) {
        return {ok: false, message: "Exercise not found"};
      };

    const url = await this.blob.signedUrl((exercise as any).videoBlobName, 30);

    return {ok: true, data: url};
    
    } catch (error) {
      console.error("============ GetExerciseVideo Error: ",error);
      return {ok: false, message: "Something went wrong"};
    }
  }
}
