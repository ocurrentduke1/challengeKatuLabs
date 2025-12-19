import { Request, Response } from 'express';
import { EmployeeRepository } from '../employees/employee.repository.js';
import { signToken } from '../../utils/jwt.js';
import { ValidationError } from '../../utils/errors.js';

const employeeRepo = new EmployeeRepository();

export class AuthController {
  login = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw new ValidationError('email is required');
    }

    const employee = await employeeRepo.findByEmail(email);
    if (!employee) {
      throw new ValidationError('Invalid employee');
    }

    const token = signToken({
      sub: employee.id,
      role: employee.role,
    });

    res.json({ token });
  };
}
