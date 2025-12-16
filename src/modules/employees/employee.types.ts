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
 * No incluye campos generados por el sistema
 */
export interface CreateEmployeeInput {
  name: string;
  email: string;
  role?: Role; // por defecto EMPLOYEE
  annualVacationDays: number;
  carriedOverDays: number;
}
