import mongoose, { Schema } from "mongoose";
const exerciseSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    musclesTargeted: {
        type: [String],
        default: [],
        required: true
    },
    equipmentNeeded: {
        type: [String],
        default: []
    },
    difficultyLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner",
        required: true
    },
    videoBlobName: {
        type: String,
        required: true
    }
}, { timestamps: true });
export const ExerciseModel = mongoose.model("Exercise", exerciseSchema);
