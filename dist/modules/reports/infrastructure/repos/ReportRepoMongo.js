import { MedicalReportModel } from '../models/MedicalReportModel.js';
export const ReportRepoMongo = {
    async create(r) {
        const doc = await MedicalReportModel.create(r);
        return doc.toObject();
    },
    async findById(id) {
        const doc = await MedicalReportModel.findById(id).lean();
        return doc;
    }
};
