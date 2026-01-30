import { Router } from "express";
import { createTreatmentPlan } from "./controllers/treatmentPlan.controller.js";

export const treatmentPlanRoutes = Router()

// rate limiter and middlewares

treatmentPlanRoutes.post('/', createTreatmentPlan)
// treatmentPlanRoutes.get('/', getAllTreatmentPlans)
// treatmentPlanRoutes.put('/:id', updateTreatmentPlan)
// treatmentPlanRoutes.delete('/:id', deleteTreatmentPlan)
// treatmentPlanRoutes.get('/:id', getTreatmentPlanById)
// treatmentPlanRoutes.get('/patient/:patientId', getTreatmentPlansByPatient)
// treatmentPlanRoutes.get('/doctor/:doctorId', getTreatmentPlansByDoctor)
// treatmentPlanRoutes.post('/:id/sessions', addSessionToTreatmentPlan)
// treatmentPlanRoutes.get('/:id/sessions', getSessionsByTreatmentPlan)
// treatmentPlanRoutes.delete('/:id/sessions/:sessionId', removeSessionFromTreatmentPlan)