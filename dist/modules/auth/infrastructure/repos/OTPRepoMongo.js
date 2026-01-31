import { OTPModel } from '../models/OTPModel.js';
export const OTPRepoMongo = {
    async create(otp) {
        const doc = await OTPModel.create(otp);
        return doc.toObject();
    },
    async latest(subjectType, subjectRef) {
        const doc = await OTPModel.findOne({ subjectType, subjectRef }).sort({ createdAt: -1 }).lean();
        return doc;
    },
    async save(otp) {
        await OTPModel.updateOne({ _id: otp._id }, { $set: otp }, { upsert: true });
    }
};
