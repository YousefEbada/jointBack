import mongoose, { Schema } from 'mongoose';
import { required } from 'zod/v4-mini';

const sessionSchema = new Schema(
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

    treatmentPlanId: {
      type: Schema.Types.ObjectId,
      ref: 'TreatmentPlan',
      required: true,
      index: true
    },

    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: false
    },

    sessionNumber: {
      type: Number,
      required: true
    },

    weekNumber: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'inProgress',
        'completed',
        'noShow',
        'cancelled'
      ],
      default: 'pending'
    },

    completedAt: {
      type: Date
    },

    notes: {
      type: String
    },

    scheduledDate: {
      type: Date,
      required: false
    },

    exercisesAssigned: [
      { type: Schema.Types.ObjectId, ref: 'Exercise' }
    ],

    progressNotes: {
      type: String
    }
  },
  { timestamps: true }
);


// // Indexes for better query performance
// i will check index later

export const SessionModel = mongoose.model('Session', sessionSchema);