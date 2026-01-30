import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createFullUser, createPartialUser, findUser, requestOtp, verifyOtp } from './controllers/auth.controller.js';

export const authRoutes = Router();

const requestLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false
});

const verifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false
});

// generic rate limiter - throttle requests to 5 per 15 minutes
// TODO: implement per-route rate limiting

// rate limit for each route?
authRoutes.get('/find', findUser);
authRoutes.post('/create-partial', createPartialUser);
authRoutes.post('/create-full', createFullUser);
authRoutes.post('/otp/request',  requestOtp);
authRoutes.post('/otp/verify', verifyOtp);
// Don't Forget Logout
// Don't Forget Change Password
