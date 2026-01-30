import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  createBooking,
  cancelBooking,
  rescheduleBooking,
  getAvailableSlots,
  getBookingById,
  updateBookingStatus,
  getAllBookings,
  getPatientBookings
} from './controllers/booking.controller.js';
// import { auth } from '../../../shared/middleware/auth.js';
import { validate } from '../../../shared/middleware/validate.js';

export const bookingRoutes = Router();

// Rate limiting
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// bookingRoutes.use(bookingLimiter);
// bookingRoutes.use(auth); // Uncomment when auth middleware is ready

// ensure you handle double bookings 
bookingRoutes.post('/', createBooking);
bookingRoutes.get('/', getAllBookings);
bookingRoutes.get('/patient/:patientId', getPatientBookings);
bookingRoutes.get('/doctor/:doctorId/slots', getAvailableSlots);
bookingRoutes.get('/:id', getBookingById);
bookingRoutes.put('/:id/cancel', cancelBooking);
bookingRoutes.put('/:id/reschedule', rescheduleBooking);
bookingRoutes.patch('/:id/status', updateBookingStatus);
