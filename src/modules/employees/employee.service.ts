import { EmployeeRepository } from './employee.repository.js';
import { CreateEmployeeInput, Employee } from './employee.types.js';
import { RequestRepository } from '../requests/request.repository.js';

export class EmployeeService {
  constructor(
    private employeeRepo = new EmployeeRepository(),
    private requestRepo = new RequestRepository()
  ) {}

  async createEmployee(input: CreateEmployeeInput): Promise<Employee> {
    return this.employeeRepo.create(input);
  }

  async getEmployeeById(id: string): Promise<Employee> {
    const employee = await this.employeeRepo.findById(id);
    if (!employee) {
      throw new Error('Employee not found');
    }
    return employee;
  }

  async getVacationBalance(employeeId: string): Promise<number> {
    const employee = await this.getEmployeeById(employeeId);

    const approvedRequests =
      await this.requestRepo.findByFilters({
        employeeId,
        status: 'APPROVED'
      });

    const approvedVacationDays = approvedRequests
      .filter(r => r.type === 'VACATION')
      .reduce((total, r) => {
        const diff =
          (r.endDate.getTime() - r.startDate.getTime()) /
          (1000 * 60 * 60 * 24);
        return total + diff + 1;
      }, 0);

    return (
      employee.annualVacationDays +
      employee.carriedOverDays -
      approvedVacationDays
    );
  }
}
