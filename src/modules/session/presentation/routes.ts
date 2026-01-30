import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  getSessionsByTreatmentPlan
} from '../../session/presentation/controllers/session.controller.js';

export const sessionRoutes = Router();

// Rate limiting
const sessionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// sessionRoutes.use(sessionLimiter);
// sessionRoutes.use(auth); // Uncomment when auth middleware is ready
sessionRoutes.get('/:patientId/treatment/:treatmentPlanId/sessions', getSessionsByTreatmentPlan)