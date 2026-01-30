import { Schema } from "mongoose";
import { ObjectId } from "mongoose";

export type Role = 'patient' | 'doctor' | 'admin' | 'staff';
export type Gender = 'Male' | 'Female' | 'male' | 'female';
export type MaritalStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed';
export type AccountStatus = 'active' | 'inactive';
export type UserStatus = { partialProfileCompleted: Boolean, registerOtpVerified: Boolean, fullProfileCompleted: Boolean}
export type IdentifierType = 'email' | 'phone' | 'nid' | 'iqama' | undefined;

export interface User {
  _id: string;
  role: Role;
  fullName: string;
  email?: string;
  phone?: string;
  birthdate: Date;
  gender: Gender;
  identifier?: string;
  identifierType?: IdentifierType;
  nationality?: string;
  address?: string;
  city?: string;
  maritalStatus?: MaritalStatus;
  speakingLanguages?: string[];
  // what if the guardian has many users under his care?
  guardianInformation?: {
    guardianName?: string;
    guardianEmail?: string;
    guardianPhone?: string;
    guardianBloodType?: string;
    guardianRelation?: string;
    guardianIdentifier?: string;
    guardianIdentifierType?: string;
    patientCategory?: string;
  };
  patientCategory?: string;
  userStatus?: UserStatus;
  accountStatus?: AccountStatus;
  createdAt: Date;
}

export interface CreateFullUserRequest {
  userId?: string;
  fullName?: string;
  gender?: string;
  birthdate?: string | Date;
  email?: string;
  phone?: string;
  identifier?: string;
  identifierType?: string;
  nationality?: string;
  address?: string;
  city?: string;
  maritalStatus?: string;
  speakingLanguages?: string[];
  guardianInformation?: {
    guardianName?: string;
    guardianEmail?: string;
    guardianPhone?: string;
    guardianBloodType?: string;
    guardianRelation?: string;
    guardianIdentifier?: string;
    guardianIdentifierType?: string;
    patientCategory?: string;
  };
}