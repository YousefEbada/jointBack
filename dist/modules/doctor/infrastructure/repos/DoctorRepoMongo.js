import { DoctorModel } from "../models/DoctorModel.js";
import mongoose from "mongoose";
import { AssignedExercisesModel } from "../models/AssignedExercisesModel.js";
export const DoctorRepoMongo = {
    // Save many practitioners (replace existing ones)
    async saveMany(practitioners) {
        console.log("[DoctorRepoMongo] Saving practitioners:", practitioners.length);
        const res = await DoctorModel.insertMany(practitioners, { ordered: false });
        console.log("[DoctorRepoMongo] Saved practitioners:", res.length);
        return;
    },
    // Get all practitioners, optionally filtered by branch or department
    async getAll(branch, department) {
        const filter = {};
        if (branch) {
            filter["practitionerCompany.branch"] = branch;
        }
        if (department) {
            filter.department = department;
        }
        const docs = await DoctorModel.find(filter).lean();
        return docs;
    },
    async findById(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return null;
            }
            const doc = await DoctorModel.findById(id).lean();
            return doc ? doc : null;
        }
        catch (error) {
            console.error("===== Error in findById ======= ", error);
            return null;
        }
    },
    async findByNixpendId(id) {
        try {
            const doc = await DoctorModel.findOne({ nixpendId: id }).lean();
            return doc ? doc : null;
        }
        catch (error) {
            console.error("===== Error in findByNixpendId ======= ", error);
            return null;
        }
    },
    // Assign an exercise to a patient
    async assignExercise(doctorNixpendId, patientNixpendId, exerciseId, dueDate) {
        try {
            const doc = await AssignedExercisesModel.create({
                doctorNixpendId,
                patientNixpendId,
                exerciseId,
                ...(dueDate ? { dueDate: dueDate } : {})
            });
            return doc;
        }
        catch (error) {
            console.error("Error assigning exercise:", error);
            return null;
        }
    },
    async getAssignedExercises(doctorNixpendId, patientNixpendId) {
        try {
            const docs = await AssignedExercisesModel.find({
                doctorNixpendId,
                patientNixpendId
            }).lean();
            return docs;
        }
        catch (error) {
            console.error("Error fetching assigned exercises:", error);
            return [];
        }
    },
    // Clear the collection
    async clear() {
        await DoctorModel.deleteMany({});
    }
};
