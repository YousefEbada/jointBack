import mongoose, { Schema } from "mongoose";

const AssignedExercisesSchema = new Schema({
    exerciseId: { type: String, required: true },
    doctorNixpendId: { type: String, required: true },
    patientNixpendId: { type: String, required: true },
    assignedDate: { type: Date, required: true },
    dueDate: { type: Date, required: false },
    status: { type: String, required: true, enum: ["assigned", "completed"], default: "assigned" } 
}, { timestamps: true });

export const AssignedExercisesModel = mongoose.model("AssignedExercises", AssignedExercisesSchema);

