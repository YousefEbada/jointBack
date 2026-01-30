import { Router } from "express";
import {createPatient, getPatient, getPractitioners, updatePatient } from "./controllers/nixpend.controller.js";
import rateLimit from "express-rate-limit";

export const nixpendRoutes = Router();

// const nixpendLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 20,
//     standardHeaders: true,
//     legacyHeaders: false
// });

nixpendRoutes.post("/", createPatient);
nixpendRoutes.get("/", getPatient);
nixpendRoutes.put("/", updatePatient);
nixpendRoutes.get("/practitioners", getPractitioners);