import { SessionRepoPort } from '../../application/ports/SessionRepoPort.js';
import { Session } from '../../domain/Session.js';
import { SessionModel } from '../models/SessionModel.js';
import { startOfDay, endOfDay } from '../../../../shared/utils/date.js';
import mongoose from 'mongoose';

export const SessionRepoMongo: SessionRepoPort = {
  async createSession(sessionData): Promise<Session> {
    const doc = await SessionModel.create(sessionData);
    return doc.toObject() as unknown as Session;
  },

  async createSessionsBatch(sessionsData, options?: { tx?: mongoose.ClientSession }): Promise<Session[]> {
    const docs = await SessionModel.insertMany(sessionsData, { session: options?.tx });
    return docs.map(doc => doc.toObject() as unknown as Session);
  },

  async findSessionById(id): Promise<Session | null> {
    const doc = await SessionModel.findById(id).lean();
    return doc as unknown as Session | null;
  },

  async updateSession(id, updates): Promise<Session | null> {
    const doc = await SessionModel.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).lean();
    return doc as Session | null;
  },

  async deleteSession(id): Promise<boolean> {
    const result = await SessionModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  },

  async startTransaction(): Promise<{
    session: any;
    commit(): Promise<void>;
    abort(): Promise<void>;
  }> {
    const session = await mongoose.startSession();
    session.startTransaction();
    return {
      session,

      async commit() {
        try {
          await session.commitTransaction();
        } finally {
          session.endSession();
        }
      },

      async abort() {
        try {
          await session.abortTransaction();
        } finally {
          session.endSession();
        }
      }
    };
  },

  async findSessionsByPatient(patientId): Promise<Session[]> {
    const docs = await SessionModel.find({ patientId })
      .sort({ scheduledDate: 1, sessionNumber: 1 })
      .lean();
    return docs as unknown as Session[];
  },

  async findUpcomingSessionsByPatient(patientId): Promise<Session[]> {
    const now = new Date();
    const docs = await SessionModel.find({
      patientId,
      scheduledDate: { $gte: now },
      status: { $in: ['scheduled', 'inProgress'] }
    })
      .sort({ scheduledDate: 1 })
      .lean();
    return docs as unknown as Session[];
  },

  async findCompletedSessionsByPatient(patientId): Promise<Session[]> {
    const docs = await SessionModel.find({
      patientId,
      status: 'completed'
    })
      .sort({ scheduledDate: -1 })
      .lean();
    return docs as unknown as Session[];
  },

  async findSessionsByDoctor(doctorId): Promise<Session[]> {
    const docs = await SessionModel.find({ doctorId })
      .populate('patientId', 'name nixpendId')
      .sort({ scheduledDate: 1 })
      .lean();
    return docs as unknown as Session[];
  },

  async findSessionsByDoctorAndDate(doctorId, date): Promise<Session[]> {
    const docs = await SessionModel.find({
      doctorId,
      scheduledDate: {
        $gte: startOfDay(date),
        $lte: endOfDay(date)
      }
    })
      .populate('patientId', 'name nixpendId')
      .sort({ scheduledTime: 1 })
      .lean();
    return docs as unknown as Session[];
  },

  async findSessionsByDoctorAndWeek(doctorId, weekStart): Promise<Session[]> {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const docs = await SessionModel.find({
      doctorId,
      scheduledDate: { $gte: weekStart, $lt: weekEnd }
    })
      .populate('patientId', 'name nixpendId')
      .sort({ scheduledDate: 1, scheduledTime: 1 })
      .lean();
    return docs as unknown as Session[];
  },

  async findSessionsByDoctorAndMonth(doctorId, monthStart): Promise<Session[]> {
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);

    const docs = await SessionModel.find({
      doctorId,
      scheduledDate: { $gte: monthStart, $lte: monthEnd }
    })
      .populate('patientId', 'name nixpendId')
      .sort({ scheduledDate: 1 })
      .lean();
    return docs as unknown as Session[];
  },

  async getCompletedSessionsByTreatmentPlan(patientId, treatmentPlanId): Promise<number> {
    const count = await SessionModel.countDocuments({
      patientId,
      treatmentPlanId,
      status: 'completed'
    });
    return count;
  },

  async getSessionsByTreatmentPlan(patientId: string, treatmentPlanId: string): Promise<Session[] | null> {
    const res = await SessionModel.find({
      patientId,
      treatmentPlanId,
    });
    return res as any;
  },

  async findNextUpcomingSessionByPatientAndTreatmentPlan(patientId, treatmentPlanId): Promise<Session | null> {
    const nextSession = await SessionModel.findOne({
      patientId,
      treatmentPlanId,
      status: 'scheduled',
      scheduledDate: { $gte: new Date() }
    })
      .populate('doctorId', 'name')
      .sort({ scheduledDate: 1 })
      .lean();
    return nextSession as Session | null;
  },

  async updateSessionStatus(sessionId, status): Promise<void> {
    await SessionModel.updateOne(
      { _id: sessionId },
      { $set: { status, updatedAt: new Date() } }
    );
  },

  // async markSessionCompleted(sessionId, progressNotes): Promise<void> {
  //   const session = await SessionModel.findById(sessionId);
  //   if (!session) throw new Error('Session not found');

  //   // Update session status
  //   await SessionModel.updateOne(
  //     { _id: sessionId }, 
  //     { 
  //       $set: { 
  //         status: 'completed', 
  //         progressNotes,
  //         updatedAt: new Date() 
  //       } 
  //     }
  //   );

  //   // Update treatment plan completion count
  //   const completedCount = await SessionModel.countDocuments({
  //     treatmentPlanId: session.treatmentPlanId,
  //     status: 'completed'
  //   });

  //   const treatmentPlan = await TreatmentPlanModel.findById(session.treatmentPlanId);
  //   if (treatmentPlan) {
  //     const updates: any = { 
  //       sessionsCompleted: completedCount,
  //       updatedAt: new Date()
  //     };

  //     // Check if treatment is completed
  //     if (completedCount >= treatmentPlan.totalSessions) {
  //       updates.status = 'completed';
  //       updates.treatmentEndDate = new Date();
  //     }

  //     await TreatmentPlanModel.updateOne(
  //       { _id: session.treatmentPlanId },
  //       { $set: updates }
  //     );
  //   }
  // },

  // async getPatientProgress(patientId): Promise<SessionProgress | null | any> {
  //   const treatmentPlan = await TreatmentPlanModel.findOne({ 
  //     patientId, 
  //     status: 'active' 
  //   }).lean();
  //   if (!treatmentPlan) return null;
  //   const completedSessions = await SessionModel.countDocuments({
  //     patientId,
  //     treatmentPlanId: treatmentPlan._id,
  //     status: 'completed'
  //   });
  //   const remainingSessions = treatmentPlan.totalSessions - completedSessions;
  //   const progressPercentage = (completedSessions / treatmentPlan.totalSessions) * 100;
  //   const nextSession = await SessionModel.findOne({
  //     patientId,
  //     treatmentPlanId: treatmentPlan._id,
  //     status: 'scheduled',
  //     scheduledDate: { $gte: new Date() }
  //   })
  //   .populate('doctorId', 'name')
  //   .sort({ scheduledDate: 1 })
  //   .lean();
  //   return {
  //     patientId,
  //     totalSessions: treatmentPlan.totalSessions,
  //     completedSessions,
  //     remainingSessions,
  //     progressPercentage,
  //     nextSession: nextSession ? {
  //       date: (nextSession as any).scheduledDate as any,
  //       time: (nextSession as any).scheduledTime as any,
  //       doctorName: ((nextSession as any).doctorId as any).name as any
  //     } : undefined,
  //     treatmentStatus: treatmentPlan.status
  //   };
  // }
};