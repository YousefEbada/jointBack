import { TaskRepoPort } from "../ports/TaskRepoPort.js";

export class UpdateTask {
    constructor(private taskRepo: TaskRepoPort) {}

    async exec(taskId: string, updateData: any) {
        try {
            const updatedTask = await this.taskRepo.update(taskId, updateData);
            if (!updatedTask) {
                return { ok: false, message: "Task not found or update failed" };
            }
            return { ok: true, task: updatedTask };
        } catch (error) {
            console.error("Error in UpdateTask use case:", (error as Error).message);
            return { ok: false, message: "Failed to update task" };
        }
    }
}