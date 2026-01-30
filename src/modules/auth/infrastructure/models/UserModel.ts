import { GuardianModel } from './GuardianModel.js';
import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    role: {
      type: String,
      enum: ['patient', 'doctor', 'admin', 'staff'],
      required: true,
      default: 'patient'
    },
    fullName: { type: String, required: true },
    // decide for the frontend to send first and last name separately or full name
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    // check email and phone are indexed for faster lookup but without harm performance
    email: { type: String, lowercase: true, trim: true, required: false },
    phone: { type: String, trim: true, required: false },
    birthdate: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'male', 'female'], required: true },
    identifier: { type: String, required: false },
    nationality: { type: String, required: false },
    address: { type: String, required: false },
    city: { type: String, required: false },
    userStatus: {
      partialProfileCompleted: { type: Boolean, default: false },
      registerOtpVerified: { type: Boolean, default: false },
      fullProfileCompleted: { type: Boolean, default: false }
    },

    // is it for email or phone? or NID and Iqama Id?
    identifierType: {
      type: String,
    //   enum: ['email', 'phone'],
    // enum: ['nid', 'iqama'],
      required: false
    },
    maritalStatus: {
      type: String,
      enum: ['Single', 'Married', 'Divorced', 'Widowed'],
      required: false
    },
    speakingLanguages: [{ type: String }],
    // account status
    accountStatus: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    guardianInformation: {
      type: GuardianModel.schema,
      required: false
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
      immutable: true
    }
  },
  {
    // Ensure createdAt and updatedAt are stored as UTC ISODate
    timestamps: {
      currentTime: () => new Date()
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// UserSchema.index({ email: 1 }, { unique: false, sparse: true });
// UserSchema.index({ phone: 1 }, { unique: false, sparse: true });

export const UserModel = mongoose.model('User', UserSchema);
