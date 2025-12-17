import { Request, Response, NextFunction } from 'express';
import { EmployeeRepository } from '../modules/employees/employee.repository.js';
import { ForbiddenError } from '../utils/errors.js';

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

const employeeRepo = new EmployeeRepository();

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const userId = req.header('x-user-id');

  if (!userId) {
    throw new ForbiddenError('Missing authentication header');
  }

  const employee = await employeeRepo.findById(userId);

  if (!employee) {
    throw new ForbiddenError('Invalid user');
  }

  req.user = {
    id: employee.id,
    role: employee.role
  };

  next();
};
