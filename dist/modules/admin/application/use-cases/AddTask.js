export class AddTask {
    userRepo;
    taskRepo;
    constructor(userRepo, taskRepo) {
        this.userRepo = userRepo;
        this.taskRepo = taskRepo;
    }
    async exec(taskData) {
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
        }
        catch (error) {
            console.error("Error in AddTask use case:", error.message);
            return { ok: false, message: "Failed to add task" };
        }
    }
}
