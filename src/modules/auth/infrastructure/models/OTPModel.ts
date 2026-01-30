import mongoose, { Schema } from 'mongoose';

const schema = new Schema({
  _id: { type: String, required: true },
  subjectType: { type: String, enum: ['report','login', 'register'], required: true, index: true },
  subjectRef:  { type: String, required: true, index: true },
  codeHash:    { type: String, required: true },
  expiresAt:   { type: Date, required: true, index: true },
  attempts:    { type: Number, default: 0 },
  status:      { type: String, enum: ['active','locked','used','expired'], default: 'active' }
}, { timestamps: true });

schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTPModel = mongoose.model('OTP', schema);
