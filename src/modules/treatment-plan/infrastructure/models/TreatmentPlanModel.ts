import mongoose, { Schema } from 'mongoose';

const treatmentPlanSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
      index: true
    },

    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
      index: true
    },

    totalSessions: {
      type: Number,
      required: true,
      min: 1
    },

    treatmentLength: {
      type: Number,
      required: true,
      min: 1
    },

    sessionsPerWeek: {
      type: Number,
      required: true,
      min: 1
    },

    treatmentStartDate: {
      type: Date,
      required: true
    },

    treatmentEndDate: {
      type: Date
    },

    treatmentGoals: [
      { type: String }
    ],

    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled', 'paused'],
      default: 'active'
    }
  },
  { timestamps: true }
);

export const TreatmentPlanModel = mongoose.model('TreatmentPlan', treatmentPlanSchema);