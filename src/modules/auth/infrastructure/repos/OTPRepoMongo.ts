import { OTPRepoPort } from '../../application/ports/OTPRepoPort.js';
import { OTP } from '../../domain/OTP.js';
import { OTPModel } from '../models/OTPModel.js';

export const OTPRepoMongo: OTPRepoPort = {
  async create(otp) {
    const doc = await OTPModel.create(otp);
    return doc.toObject() as OTP;
  },
  async latest(subjectType, subjectRef) {
    const doc = await OTPModel.findOne({ subjectType, subjectRef }).sort({ createdAt: -1 }).lean();
    return doc as OTP | null;
  },
  async save(otp) {
    await OTPModel.updateOne({ _id: otp._id }, { $set: otp }, { upsert: true });
  }
};
