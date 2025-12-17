import { z } from 'zod';

export const createRequestSchema = z.object({
  employeeId: z.string().uuid(),
  type: z.enum(['VACATION', 'PERMISSION']),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  reason: z.string().min(1).max(255)
});
