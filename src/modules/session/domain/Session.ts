import { Schema } from "mongoose";

export type SessionStatus = 'pending' | 'confirmed' | 'inProgress' | 'completed' | 'noShow' | 'cancelled';
export type SessionType = 'physiotherapy' | 'consultation' | 'followUp' | 'assessment';

export interface Session {
  _id: string | Schema.Types.ObjectId | any;
  patientId: string;
  doctorId: string;
  treatmentPlanId: string;
  bookingId?: string; 
  sessionNumber: number; 
  weekNumber: number; 
  status: SessionStatus;
  completedAt?: Date;
  notes?: string;
  exercisesAssigned?: string[]; 
  progressNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  scheduledDate?: Date;
}

export interface SessionProgress {
  patientId: string;
  totalSessions: number;
  completedSessions: number;
  remainingSessions: number;
  progressPercentage: number;
  weekNumber: number;
  nextSession?: {
    date: Date;
    time: string;
    doctorName: string;
  };
  treatmentStatus: 'active' | 'completed' | 'paused';
}