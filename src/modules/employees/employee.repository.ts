import { pool } from "../../config/db.js";
import { Employee, CreateEmployeeInput } from "./employee.types.js";

export class EmployeeRepository {
  async create(input: CreateEmployeeInput): Promise<Employee> {
    const result = await pool.query(
      `
      INSERT INTO employees (name, email, role, annual_vacation_days, carried_over_days)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        input.name,
        input.email,
        input.role ?? "EMPLOYEE",
        input.annualVacationDays,
        input.carriedOverDays,
      ]
    );

    return this.mapRowToEmployee(result.rows[0]);
  }

  async findById(id: string): Promise<Employee | null> {
    const result = await pool.query(`SELECT * FROM employees WHERE id = $1`, [
      id,
    ]);

    if (result.rows.length === 0) return null;
    return this.mapRowToEmployee(result.rows[0]);
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const result = await pool.query(
      `SELECT * FROM employees WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) return null;
    return this.mapRowToEmployee(result.rows[0]);
  }

  async findAll(): Promise<Employee[]> {
    const result = await pool.query(`SELECT * FROM employees`);
    return result.rows.map(this.mapRowToEmployee);
  }

  async updateVacationDays(
    employeeId: string,
    days: {
      annualVacationDays: number;
      carriedOverDays: number;
    }
  ): Promise<Employee> {
    const result = await pool.query(
      `
    UPDATE employees
    SET
      annual_vacation_days = $1,
      carried_over_days = $2,
      updated_at = NOW()
    WHERE id = $3
    RETURNING *
    `,
      [days.annualVacationDays, days.carriedOverDays, employeeId]
    );

    if (result.rows.length === 0) {
      throw new Error("Employee not found");
    }

    return this.mapRowToEmployee(result.rows[0]);
  }

  private mapRowToEmployee(row: any): Employee {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      annualVacationDays: row.annual_vacation_days,
      carriedOverDays: row.carried_over_days,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
