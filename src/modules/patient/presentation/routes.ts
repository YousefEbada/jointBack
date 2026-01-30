import { Router } from "express";
import {createPatient, getAllPatients, getPatientById, getPatientByUserId, getPatientDashboard, updatePatient } from "./controllers/patient.controller.js";
import rateLimit from "express-rate-limit";
import { getSessionsByTreatmentPlan } from "modules/session/presentation/controllers/session.controller.js";

export const patientRoutes = Router();

const patientLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false
});

patientRoutes.post("/create", createPatient);
patientRoutes.get("/", getAllPatients);
patientRoutes.get("/:patientId/dashboard", patientLimiter, getPatientDashboard);
patientRoutes.get("/:patientId", patientLimiter, getPatientById);
patientRoutes.get("/user/:userId", getPatientByUserId)
patientRoutes.put("/:patientId", patientLimiter, updatePatient);