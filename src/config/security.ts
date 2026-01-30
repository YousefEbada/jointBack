export const security = {
  otp: { maxAttempts: 3, ttlMinutes: 10 },
  booking: { rescheduleHours: 24, cancelHours: 24 }
} as const;
