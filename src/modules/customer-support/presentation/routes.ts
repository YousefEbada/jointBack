import { Router } from "express";
import {
  createSupportTicket,
  getAllSupportTickets,
  getSupportTicketsByPatient,
  updateSupportTicketStatus,
  deleteSupportTicket,
  getSupportTicket
} from "./controllers/support.controller.js";
import { validate } from "shared/middleware/validate.js";
import {
  createSupportTicketSchema,
  updateSupportTicketSchema,
  getSupportTicketsQuerySchema,
  supportTicketParamsSchema,
  patientParamsSchema
} from "./validation/support.schemas.js";
import rateLimit from "express-rate-limit";

export const supportRoutes = Router();

// Rate limiting for support endpoints
const supportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: "Too many support requests from this IP, please try again later."
  }
});

// Rate limiting for creation (more restrictive)
const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 create requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: "Too many ticket creation requests from this IP, please try again later."
  }
});

// // Apply rate limiting to all routes
// supportRoutes.use(supportLimiter);

supportRoutes.post(
  "/",
//   createLimiter,
  validate({ body: createSupportTicketSchema }),
  createSupportTicket
);

supportRoutes.get(
  "/",
  validate({ query: getSupportTicketsQuerySchema }),
  getAllSupportTickets
);

supportRoutes.get(
    "/:ticketId",
    getSupportTicket
)

supportRoutes.get(
  "/patient/:patientId",
  validate({ 
    params: patientParamsSchema,
    query: getSupportTicketsQuerySchema 
  }),
  getSupportTicketsByPatient
);

supportRoutes.put(
  "/:ticketId",
  validate({ 
    params: supportTicketParamsSchema,
    body: updateSupportTicketSchema 
  }),
  updateSupportTicketStatus
);

supportRoutes.delete(
  "/:ticketId",
  validate({ params: supportTicketParamsSchema }),
  deleteSupportTicket
);