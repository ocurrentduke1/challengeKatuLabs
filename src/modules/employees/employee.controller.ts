import { Request, Response, NextFunction } from "express";
import { EmployeeService } from "./employee.service.js";

export class EmployeeController {
  private service = new EmployeeService();

  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const employees = await this.service["employeeRepo"].findAll();
      res.json(employees);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          error: "Employee id is required",
        });
      }
      
      const employee = await this.service.getEmployeeById(id);
      const balance = await this.service.getVacationBalance(id);

      res.json({
        ...employee,
        vacationBalance: balance,
      });
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employee = await this.service.createEmployee(req.body);
      res.status(201).json(employee);
    } catch (err) {
      next(err);
    }
  };
}
