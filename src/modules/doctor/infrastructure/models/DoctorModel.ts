import mongoose, { Schema } from "mongoose";

const CompanySchema = new Schema({
  company: { type: String, required: true },
  branch: { type: String, required: true }
}, { _id: false });

const DoctorSchema = new Schema({
  // _id: { type: String },
  // userId: { type: String, required: false, unique: true },
  nixpendId: { type: String, required: true, unique: true }, // maps to "name" field in Nixpend
  practitionerName: { type: String, required: true }, // "practitioner_name"
  fullNameArabic: { type: String }, // "full_name_arabic"
  gender: { type: String }, // "gender"
  status: { type: String }, // "status" (Active, Inactive)
  practitionerType: { type: String }, // "practitioner_type"
  department: { type: String }, // "department"
  designation: { type: String }, // can be null
  practitionerCompany: [CompanySchema], // array of company/branch
  priceList: { type: String } // "price_list" 

}, { timestamps: true });

export const DoctorModel = mongoose.model("Doctor", DoctorSchema);
