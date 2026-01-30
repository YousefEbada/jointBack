import { ExerciseRepoPort } from "modules/exercise/application/ports/ExerciseRepoPort.js";
import { ExerciseModel } from "../models/ExerciseModel.js";

export const ExerciseRepoMongo: ExerciseRepoPort = {
    async create(data) {
        const res = await ExerciseModel.create({...data})
        return res;
    },

    async find(id) {
        const res = await ExerciseModel.findById(id);
        return res;
    },

    async getAll() {
        const res = await ExerciseModel.find();
        return res;
    },

    async delete(id) {
        const res = await ExerciseModel.findByIdAndDelete(id);
        return res;
    }
}
