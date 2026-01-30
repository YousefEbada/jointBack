import mongoose, { Schema } from "mongoose";

// i will decouple exercises later
const ExerciseSchema = new Schema({
  name: { type: String, required: false },
  assignedBy: { type: Schema.Types.ObjectId, ref: "Doctor", required: false },
  link: String,
  duration: Number,
  numberOfSets: Number,
  repetitions: Number,
  completed: { type: Boolean, default: false },
  completedAt: Date
});

const InjuryDetailsSchema = new Schema({
  affectedArea: String,
  startDate: Date,
  receivedTreatment: Boolean,
  painSeverity: { type: Number, min: 0, max: 10 },
  howDidInjurHappened: String,
  painOccasionalOrConstant: { type: String, enum: ['occasional', 'constant'] },
  affectDailyActivities: Boolean,
  additionalNotes: String,
  // check this from the report module and how to sync it
  medicalReports: [String]
});

const PatientSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  // Note: Guardian information is stored in User model and accessed via userId reference
  nixpendId: { type: String, required: true, unique: true },
  // exercises: [ExerciseSchema],
  medicalHistory: [String],
  injuryDetails: InjuryDetailsSchema,
  status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
  notes: String
}, { timestamps: true });

export const PatientModel = mongoose.model("Patient", PatientSchema);