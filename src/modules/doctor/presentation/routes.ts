import { Router } from "express";
import rateLimit from "express-rate-limit";
import express from "express";
import { assignExercisesToPatient, findDoctorById, findDoctorByNixpendId, findDoctors, getAssignedExercises, getDoctorBookings, getDoctorSessions, getPatients } from "./controllers/doctor.controller.js";

const router = express.Router();
export const doctorRoutes = Router();

const requestLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false
});

// doctorRoutes.use(requestLimiter);

doctorRoutes.post("/assign-exercise", assignExercisesToPatient);
doctorRoutes.get("/assigned-exercises/:doctorNixpendId/:patientNixpendId", getAssignedExercises);
doctorRoutes.get("/nixpend", findDoctorByNixpendId);
doctorRoutes.get("/:id", findDoctorById);
doctorRoutes.get("/", findDoctors);
doctorRoutes.get('/:doctorId/bookings', getDoctorBookings);
doctorRoutes.get('/:doctorId/sessions', getDoctorSessions);
doctorRoutes.get('/:doctorId/patients', getPatients);

// // Doctor quick views
// router.get("/doctors/:doctorId/next-appointment", getNextAppointment);
// router.get("/doctors/:doctorId/current-patient", getCurrentPatient);
// router.get("/doctors/:doctorId/dashboard", getDoctorDashboard);

export default router;