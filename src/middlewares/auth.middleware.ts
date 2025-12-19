import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/errors.js';
import { verifyToken } from '../utils/jwt.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: 'EMPLOYEE' | 'APPROVER';
      };
    }
  }
}

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.header('authorization');

  if (!authHeader) {
    throw new ForbiddenError('Missing Authorization header');
  }

  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    throw new ForbiddenError('Invalid Authorization format');
  }

  try {
    const payload = verifyToken(token);

    req.user = {
      id: payload.sub,
      role: payload.role
    };

    next();
  } catch {
    throw new ForbiddenError('Invalid or expired token');
  }
};
