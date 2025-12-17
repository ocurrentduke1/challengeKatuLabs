import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/errors.js';

export const requireRole =
  (role: 'APPROVER' | 'EMPLOYEE') =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      throw new ForbiddenError('Insufficient permissions');
    }
    next();
  };
