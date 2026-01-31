export class RemoveTask {
    taskRepo;
    constructor(taskRepo) {
        this.taskRepo = taskRepo;
    }
    async exec(taskId) {
        try {
            await this.taskRepo.remove(taskId);
            return { ok: true, message: "Task removed successfully" };
        }
        catch (error) {
            console.error("Error in RemoveTask use case:", error.message);
            return { ok: false, message: "Failed to remove task" };
        }
    }
}
