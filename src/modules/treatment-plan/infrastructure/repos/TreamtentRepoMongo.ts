import { TreatmentRepoPort } from "modules/treatment-plan/application/ports/TreatmentRepoPort.js";
import { TreatmentPlanModel } from "../models/TreatmentPlanModel.js";
import { TreatmentPlan } from "modules/treatment-plan/domain/TreatmentPlan.js";
import mongoose from "mongoose";

export const TreatmentRepoMongo: TreatmentRepoPort = {
    async createTreatmentPlan(plan: any, options?: { tx?: any }): Promise<TreatmentPlan> {
        const session = options?.tx as mongoose.ClientSession | undefined;
        const createdPlan = new TreatmentPlanModel(plan);
        await createdPlan.save({ session });
        return createdPlan.toObject() as any;
    },

    async findTreatmentPlanById(id: string): Promise<TreatmentPlan | null> {
        const plan = await TreatmentPlanModel.findById(id);
        return plan ? plan.toObject() as any : null;
    },

    async updateTreatmentPlan(id: string, updates: Partial<TreatmentPlan>, options?: { tx?: any }): Promise<TreatmentPlan | null> {
        const session = options?.tx as mongoose.ClientSession | undefined;
        const updatedPlan = await TreatmentPlanModel.findByIdAndUpdate(id, updates, { new: true, session });
        return updatedPlan ? updatedPlan.toObject() as any : null;
    },

    async findActiveTreatmentPlanByPatient(patientId: string): Promise<TreatmentPlan | null> {
        const plan = await TreatmentPlanModel.findOne({ patientId, status: 'active' });
        return plan ? plan.toObject() as any : null;
    }

    //   async updateTreatmentPlan(id, updates): Promise<TreatmentPlan | null> {
    //     const doc = await TreatmentPlanModel.findByIdAndUpdate(
    //       id, 
    //       { ...updates, updatedAt: new Date() }, 
    //       { new: true }
    //     ).lean();
    //     return doc as TreatmentPlan | null;
//   },
    
    //   async findActiveTreatmentPlanByPatient(patientId): Promise<TreatmentPlan | null> {
    //     const doc = await TreatmentPlanModel.findOne({ 
    //       patientId, 
    //       status: 'active' 
    //     }).lean();
    //     return doc as TreatmentPlan | null;
    //   },
};