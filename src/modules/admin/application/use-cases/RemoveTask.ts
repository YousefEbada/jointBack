import { TaskRepoPort } from "../ports/TaskRepoPort.js";

export class RemoveTask {
    constructor(private taskRepo: TaskRepoPort) {}

    async exec(taskId: string) {
        try {
            await this.taskRepo.remove(taskId);
            return { ok: true, message: "Task removed successfully" };
        } catch (error) {
            console.error("Error in RemoveTask use case:", (error as Error).message);
            return { ok: false, message: "Failed to remove task" };
        }
    }
}