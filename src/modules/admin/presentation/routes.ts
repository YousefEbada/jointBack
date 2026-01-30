import { Router } from "express";
// import { getAdminDashboard } from "./controllers/admin.controller.js";
import { updateUserRole, updateUser, addTask, removeTask, getTasks, updateTask } from "./controllers/admin.controller.js";

export const adminRoutes = Router();

// adminRoutes.get("/dashboard", getAdminDashboard);
// Don't forget middleware for admin authentication/authorization

adminRoutes.post("/update-user-role", updateUserRole);
adminRoutes.post("/update-user", updateUser);
adminRoutes.delete("/remove-task/:taskId", removeTask);
adminRoutes.put("/update-task/:taskId", updateTask);
// get the user id from the admin middleware auth instead of query params
adminRoutes.get("/get-tasks/:userId", getTasks);
// add task must be done by an admin only and the user id shouldn't get from the request body
adminRoutes.post("/add-task", addTask);