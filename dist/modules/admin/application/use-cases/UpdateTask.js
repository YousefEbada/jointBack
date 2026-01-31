export class UpdateTask {
    taskRepo;
    constructor(taskRepo) {
        this.taskRepo = taskRepo;
    }
    async exec(taskId, updateData) {
        try {
            const updatedTask = await this.taskRepo.update(taskId, updateData);
            if (!updatedTask) {
                return { ok: false, message: "Task not found or update failed" };
            }
            return { ok: true, task: updatedTask };
        }
        catch (error) {
            console.error("Error in UpdateTask use case:", error.message);
            return { ok: false, message: "Failed to update task" };
        }
    }
}
