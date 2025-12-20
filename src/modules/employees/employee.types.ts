export type Role = 'EMPLOYEE' | 'APPROVER';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: Role;
  annualVacationDays: number;
  carriedOverDays: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payload para crear empleados (POST /employees)
 */
export interface CreateEmployeeInput {
  name: string;
  email: string;
  role?: Role;
  annualVacationDays: number;
  carriedOverDays: number;
}
