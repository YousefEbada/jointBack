import { TreatmentPlanModel } from "../models/TreatmentPlanModel.js";
export const TreatmentRepoMongo = {
    async createTreatmentPlan(plan, options) {
        const session = options?.tx;
        const createdPlan = new TreatmentPlanModel(plan);
        await createdPlan.save({ session });
        return createdPlan.toObject();
    },
    async findTreatmentPlanById(id) {
        const plan = await TreatmentPlanModel.findById(id);
        return plan ? plan.toObject() : null;
    },
    async updateTreatmentPlan(id, updates, options) {
        const session = options?.tx;
        const updatedPlan = await TreatmentPlanModel.findByIdAndUpdate(id, updates, { new: true, session });
        return updatedPlan ? updatedPlan.toObject() : null;
    },
    async findActiveTreatmentPlanByPatient(patientId) {
        const plan = await TreatmentPlanModel.findOne({ patientId, status: 'active' });
        return plan ? plan.toObject() : null;
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
