import { ExerciseRepoPort } from "../ports/ExerciseRepoPort.js";

export class GetAllExercises {
  constructor(private exerciseRepo: ExerciseRepoPort) {}
    async exec() {
      try {
        const exercises = await this.exerciseRepo.getAll();

        if(!exercises) {
            return {ok: false, message: "No exercises found"};
        }

        return {ok: true, data: exercises};
      } catch (error) {
        console.error("============ GetAllExercises Error: ",error);
        return {ok: false, message: "Something went wrong"};
      }
    }
}