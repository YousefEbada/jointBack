import { NextFunction, Request, Response } from 'express';
export type Role = 'Patient'|'Doctor'|'Admin'|'Staff';
export function requireRole(roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as { id: string, role: Role } | undefined;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ code: 'FORBIDDEN', message: 'Insufficient permissions' });
    }
    next();
  };
}
