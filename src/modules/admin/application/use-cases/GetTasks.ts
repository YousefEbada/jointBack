import { TaskRepoPort } from "../ports/TaskRepoPort.js";

export class GetTasks {
    constructor(private taskRepo: TaskRepoPort) {}

    async exec(userId: string) {
        try {
            const tasks = await this.taskRepo.getAll(userId);
            if (!tasks) {
                return { ok: false, message: "No tasks found" };
            }
            return { ok: true, tasks };
        } catch (error) {
            console.error("Error in GetTasks use case:", (error as Error).message);
            return { ok: false, message: "Failed to retrieve tasks" };
        }
    }
}