import { Doctor } from "modules/doctor/domain/Doctor.js";
import { DoctorModel } from "../models/DoctorModel.js";
import { DoctorRepoPort } from "modules/doctor/application/ports/DoctorRepoPort.js";
import mongoose, { isValidObjectId } from "mongoose";
import { AssignedExercisesModel } from "../models/AssignedExercisesModel.js";

export const DoctorRepoMongo: DoctorRepoPort = {
  // Save many practitioners (replace existing ones)
  async saveMany(practitioners: Doctor[]): Promise<void> {
    console.log("[DoctorRepoMongo] Saving practitioners:", practitioners.length);
    const res = await DoctorModel.insertMany(practitioners, { ordered: false });
    console.log("[DoctorRepoMongo] Saved practitioners:", res.length);
    return;
  },

  // Get all practitioners, optionally filtered by branch or department
  async getAll(branch?: string, department?: string): Promise<Doctor[]> {
    const filter: any = {};

    if (branch) {
      filter["practitionerCompany.branch"] = branch;
    }
    if (department) {
      filter.department = department;
    }

    const docs = await DoctorModel.find(filter).lean();
    return docs as unknown as Doctor[];
  },

  async findById(id: string): Promise<Doctor | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      const doc = await DoctorModel.findById(id).lean();
      return doc ? (doc as unknown as Doctor) : null;
    } catch (error) {
      console.error("===== Error in findById ======= ", error);
      return null;
    }
  },

  async findByNixpendId(id: string): Promise<Doctor | null> {
    try {
      const doc = await DoctorModel.findOne({ nixpendId: id }).lean();
      return doc ? (doc as unknown as Doctor) : null;
    } catch (error) {
      console.error("===== Error in findByNixpendId ======= ", error);
      return null;
    }
  },

  // Assign an exercise to a patient
  async assignExercise(doctorNixpendId: string, patientNixpendId: string, exerciseId: string, dueDate?: Date): Promise<any> {
    try {
      const doc = await AssignedExercisesModel.create({
        doctorNixpendId,
        patientNixpendId,
        exerciseId,
        ...(dueDate ? { dueDate: dueDate } : {})
      });
      return doc;
    } catch (error) {
      console.error("Error assigning exercise:", error);
      return null
    }
  },

  async getAssignedExercises(doctorNixpendId: string, patientNixpendId: string): Promise<any[]> {
    try {
      const docs = await AssignedExercisesModel.find({
        doctorNixpendId,
        patientNixpendId
      }).lean();
      return docs;
    } catch (error) {
      console.error("Error fetching assigned exercises:", error);
      return [];
    }
  },

  // Clear the collection
  async clear(): Promise<void> {
    await DoctorModel.deleteMany({});
  }
}