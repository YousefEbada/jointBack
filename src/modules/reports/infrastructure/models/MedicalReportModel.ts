import mongoose, { Schema } from 'mongoose';

const schema = new Schema({
  patientId: { type: String, required: true, index: true },
  visitId:   { type: String },
  blobPath:  { type: String, required: true },
  checksum:  { type: String, required: true },
  uploader:  { type: String, required: true },
  injury:    { type: String }
}, { timestamps: { createdAt: true, updatedAt: false } });

export const MedicalReportModel = mongoose.model('MedicalReport', schema);
