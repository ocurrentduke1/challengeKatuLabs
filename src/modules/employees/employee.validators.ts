import { z } from 'zod';

export const createEmployeeSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['EMPLOYEE', 'APPROVER']).optional(),
  annualVacationDays: z.number().int().min(0),
  carriedOverDays: z.number().int().min(0)
});
