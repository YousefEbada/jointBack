import { UserRepoPort } from "modules/auth/application/ports/UserRepoPort.js";
import { TaskRepoPort } from "../ports/TaskRepoPort.js";

export class AddTask {
    constructor(private userRepo: UserRepoPort, private taskRepo: TaskRepoPort) {}

    async exec(taskData: any) {
        try {
            // const user = await this.userRepo.findById(taskData.userId);
            // if (!user) {
            //     return { ok: false, message: "admin not found" };
            // }
            // if(!user.role || user.role !== 'admin') {
            //     return { ok: false, message: "Only admins can add tasks" };
            // }
            const newTask = await this.taskRepo.add(taskData);
            if (!newTask) {
                return { ok: false, message: "Failed to add task" };
            }
            return { ok: true, task: newTask };
        } catch (error) {
            console.error("Error in AddTask use case:", (error as Error).message);
            return { ok: false, message: "Failed to add task" };
        }
    }
}