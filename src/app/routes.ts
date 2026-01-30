import { Router, type Express } from 'express';
import { authRoutes } from '../modules/auth/presentation/routes.js';
import { bookingRoutes } from '../modules/booking/presentation/routes.js';
import { reportRoutes } from '../modules/reports/presentation/routes.js';
import { patientRoutes } from '../modules/patient/presentation/routes.js';
import { nixpendRoutes } from '../modules/integration/routes.test.js';
import { doctorRoutes } from '../modules/doctor/presentation/routes.js';
import { sessionRoutes } from '../modules/session/presentation/routes.js';
import { treatmentPlanRoutes } from '../modules/treatment-plan/presentation/routes.js';
import exerciseRoutes from 'modules/exercise/presentation/routes.js';
import { adminRoutes } from 'modules/admin/presentation/routes.js';
import chatRoutes from '../modules/chat/presentation/routes.js';
import { supportRoutes } from '../modules/customer-support/presentation/routes.js';

export function mountRoutes(app: Express) {
  const api = Router();
  api.use('/auth', authRoutes);
  api.use('/booking', bookingRoutes);
  api.use('/reports', reportRoutes);
  api.use('/patient', patientRoutes);
  api.use('/doctor', doctorRoutes);
  api.use('/session', sessionRoutes);
  api.use('/treatment', treatmentPlanRoutes);
  api.use('/test/nixpend', nixpendRoutes);
  api.use('/exercise', exerciseRoutes);
  api.use('/admin', adminRoutes);
  api.use('/chat', chatRoutes);
  api.use('/support', supportRoutes);
  app.use('/api', api);
}
