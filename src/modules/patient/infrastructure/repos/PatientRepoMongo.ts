import mongoose from "mongoose";
import { PatientModel } from "../models/PatientModel.js";
import { Patient } from "modules/patient/domain/Patient.js";
import { PatientRepoPort } from "modules/patient/application/ports/PatientRepoPort.js";

export const PatientRepoMongo: PatientRepoPort = {
    async getPatient(id: string) {
        try {
            console.log("PatientRepoMongo.getPatient] Fetching patient with id:", id);
            // if (!mongoose.Types.ObjectId.isValid(id)) {
            //     return null; // let use-case decide
            // }
            const patient = await PatientModel.findById(id)
                .populate({
                    path: 'userId',
                    select: 'fullName firstName lastName email phone gender'
                })
                .lean();
            return patient as any as Patient ?? null;
        } catch (error) {
            console.error("[PatientRepoMongo.getPatient] DB error:", (error as any).message);
            throw new Error("DATABASE_ERROR");
        }
    },

    async getAllPatients() {
        try {
            console.log("PatientRepoMongo.getAllPatients] Fetching all patients");
            const patients = await PatientModel.find()
                .populate({
                    path: 'userId',
                    select: 'fullName firstName lastName email phone gender'
                })
                .lean();
            return patients as any as Patient[];
        } catch (error) {
            console.error("[PatientRepoMongo.getAllPatients] DB error:", (error as any).message);
            throw new Error("DATABASE_ERROR");
        }
    },

    async getPatientByUserId(userId: string) {
        try {
            console.log("PatientRepoMongo.getPatientByUserId] Fetching patient with userId:", userId);
            // if (!mongoose.Types.ObjectId.isValid(userId)) {
            //     return null; // let use-case decide
            // }
            const patient = await PatientModel.findOne({ userId })
                .populate({
                    path: 'userId',
                    select: 'fullName firstName lastName email phone gender'
                })
                .lean();
            return patient as any as Patient ?? null;
        } catch (error) {
            console.error("[PatientRepoMongo.getPatientByUserId] DB error:", (error as any).message);
            throw new Error("DATABASE_ERROR");
        }
    },

    // Decide if you want to use patient id or userId here
    async updatePatient(id: string, data: Partial<Patient>) {
        try {
            // if (!mongoose.Types.ObjectId.isValid(id)) {
            //     return null; // let use-case decide
            // }
            const patient = await PatientModel.findOneAndUpdate(
                { userId: id },
                { $set: data },
                { new: true, lean: true }
            );
            return patient as any as Patient ?? null;
        } catch (error) {
            console.error("[PatientRepoMongo.updatePatient] DB error:", (error as any).message);
            throw new Error("DATABASE_ERROR");
        }
    },

    async createPatient(data: Partial<Patient>) {
        try {
            const newPatient = new PatientModel(data);
            const savedPatient = await newPatient.save();
            return savedPatient.toObject() as any as Patient;
        } catch (error) {
            console.error("[PatientRepoMongo.createPatient] DB error:", (error as any).message);
            throw new Error("DATABASE_ERROR");
        }
    },

    async updatePatientStatus(id: string, status: Patient['status'], options?: { tx?: any }): Promise<void> {
        try {
            // if (!mongoose.Types.ObjectId.isValid(id)) {
            //     throw new Error("INVALID_ID");
            // }
            await PatientModel.findOneAndUpdate(
                {nixpendId: id},
                { status }
                // { session: options?.tx }
            );
        } catch (error) {
            console.error("[PatientRepoMongo.updatePatientStatus] DB error:", (error as any).message);
            throw new Error("DATABASE_ERROR");
        }
    }
};
