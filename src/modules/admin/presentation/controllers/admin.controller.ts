import { TASK_REPO, USER_AUTH_REPO } from "app/container.bindings.js";
import { resolve } from "app/container.js";
import { Request, Response } from "express";
import { AddTask } from "modules/admin/application/use-cases/AddTask.js";
import { GetTasks } from "modules/admin/application/use-cases/GetTasks.js";
import { RemoveTask } from "modules/admin/application/use-cases/RemoveTask.js";
import { UpdateTask } from "modules/admin/application/use-cases/UpdateTask.js";
import { UpdateUser } from "modules/auth/application/use-cases/UpdateUser.js";
import { UpdateUserRole } from "modules/auth/application/use-cases/UpdateUserRole.js";

export async function updateUserRole(req: Request, res: Response) {
    const { userId, newRole } = req.body;
    try {
        const uc = new UpdateUserRole(resolve(USER_AUTH_REPO));
        const result = await uc.exec(userId, newRole);
        if (!result.ok) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in updateUserRole controller:", (error as Error).message);
        return res.status(500).json({ ok: false, message: "Update User Role controller Internal server error" });
    }
}

export async function updateUser(req: Request, res: Response) {
    const { userId, updateData } = req.body;
    try {
        const uc = new UpdateUser(resolve(USER_AUTH_REPO));
        const result = await uc.exec(userId, updateData);
        if (!result.ok) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in updateUser controller:", (error as Error).message);
        return res.status(500).json({ ok: false, message: "Update User controller Internal server error" });
    }
}

export async function addTask(req: Request, res: Response) {
    try {
        const { userId, content, tag } = req.body;
        const uc = new AddTask(resolve(USER_AUTH_REPO), resolve(TASK_REPO));
        const result = await uc.exec({ userId, content, tag });
        if (!result.ok) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in addTask controller:", (error as Error).message);
        return res.status(500).json({ ok: false, message: "Add Task controller Internal server error" });
    }
}

export async function removeTask(req: Request, res: Response) {
    const { taskId } = req.params;
    try {
        const uc = new RemoveTask(resolve(TASK_REPO));
        const result = await uc.exec(taskId);
        if (!result.ok) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in removeTask controller:", (error as Error).message);
        return res.status(500).json({ ok: false, message: "Remove Task controller Internal server error" });
    }
}

export async function updateTask(req: Request, res: Response) {
    const { taskId } = req.params;
    const updateData = req.body;
    try {
        const uc = new UpdateTask(resolve(TASK_REPO));
        const result = await uc.exec(taskId, updateData);
        if (!result.ok) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in updateTask controller:", (error as Error).message);
        return res.status(500).json({ ok: false, message: "Update Task controller Internal server error" });
    }
}

export async function getTasks(req: Request, res: Response) {
    const { userId } = req.params;
    try {
        const uc = new GetTasks(resolve(TASK_REPO));
        const result = await uc.exec(userId);
        if (!result.ok) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in getTasks controller:", (error as Error).message);
        return res.status(500).json({ ok: false, message: "Get Tasks controller Internal server error" });
    }
}

// export async function getAdminDashboard(req: Request, res: Response) {
//     // Implementation for admin dashboard
// }