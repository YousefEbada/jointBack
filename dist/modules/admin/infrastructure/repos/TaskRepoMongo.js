import { TaskModel } from "../models/TaskModel.js";
export const TaskRepoMongo = {
    async add(taskData) {
        const doc = await TaskModel.create(taskData);
        return doc.toObject();
    },
    async remove(taskId) {
        await TaskModel.deleteOne({ _id: taskId });
    },
    async update(taskId, updateData) {
        const doc = await TaskModel.findByIdAndUpdate(taskId, updateData, { new: true }).lean();
        return doc;
    },
    async getAll(userId) {
        const docs = await TaskModel.find({ userId }).lean();
        return docs;
    }
};
