import mongoose, { Schema } from "mongoose";

const TaskSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    tag: { type: String, required: false },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: () => new Date(), immutable: true },
    updatedAt: { type: Date, default: () => new Date() }
})

export const TaskModel = mongoose.model("Task", TaskSchema);