export class GetTasks {
    taskRepo;
    constructor(taskRepo) {
        this.taskRepo = taskRepo;
    }
    async exec(userId) {
        try {
            const tasks = await this.taskRepo.getAll(userId);
            if (!tasks) {
                return { ok: false, message: "No tasks found" };
            }
            return { ok: true, tasks };
        }
        catch (error) {
            console.error("Error in GetTasks use case:", error.message);
            return { ok: false, message: "Failed to retrieve tasks" };
        }
    }
}
