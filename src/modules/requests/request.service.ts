import { RequestRepository } from "./request.repository.js";
import { EmployeeRepository } from "../employees/employee.repository.js";
import {
  CreateRequestInput,
  VacationRequest,
  RequestStatus,
} from "./request.types.js";
import { EmployeeService } from "../employees/employee.service.js";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../../utils/errors.js";

export class RequestService {
  constructor(
    private requestRepo = new RequestRepository(),
    private employeeRepo = new EmployeeRepository(),
    private employeeService = new EmployeeService()
  ) {}

  async createRequest(input: CreateRequestInput): Promise<VacationRequest> {
    // 0️⃣ Validar fechas
    const { startDate, endDate } = input;

    if (!startDate || !endDate) {
      throw new ValidationError("Start date and end date are required");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new ValidationError("Invalid date format");
    }

    if (start > end) {
      throw new ValidationError("Start date cannot be after end date");
    }

    // (opcional pero recomendado)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      throw new ValidationError("Start date cannot be in the past");
    }

    // 1. Verificar que el empleado existe
    const employee = await this.employeeRepo.findById(input.employeeId);
    if (!employee) {
      throw new NotFoundError("Employee not found");
    }

    // 2. Validar traslapes con solicitudes APPROVED
    const overlapping = await this.requestRepo.findApprovedByEmployeeInRange(
      input.employeeId,
      start,
      end
    );

    if (overlapping.length > 0) {
      throw new ValidationError("Request overlaps with an approved request");
    }

    // 3. Validar saldo si es VACATION
    if (input.type === "VACATION") {
      const balance = await this.employeeService.getVacationBalance(
        input.employeeId
      );

      const requestedDays =
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;

      if (requestedDays > balance) {
        throw new ValidationError("Insufficient vacation balance");
      }
    }

    return this.requestRepo.create({
      ...input,
      startDate: start,
      endDate: end,
    });
  }

  async approveRequest(
    requestId: string,
    approverId: string
  ): Promise<VacationRequest> {
    const request = await this.requestRepo.findById(requestId);
    if (!request) {
      throw new NotFoundError("Request not found");
    }

    if (request.status !== "PENDING") {
      throw new ValidationError("Only pending requests can be approved");
    }

    if (request.type === "VACATION") {
      const employee = await this.employeeRepo.findById(request.employeeId);
      if (!employee) {
        throw new NotFoundError("Employee not found");
      }

      const requestedDays =
        (request.endDate.getTime() - request.startDate.getTime()) /
          (1000 * 60 * 60 * 24) +
        1;

      const totalBalance =
        employee.annualVacationDays + employee.carriedOverDays;

      if (requestedDays > totalBalance) {
        throw new ValidationError("Insufficient vacation balance");
      }

      // 🔻 Descuento priorizando carriedOverDays
      let remaining = requestedDays;

      const usedCarriedOver = Math.min(employee.carriedOverDays, remaining);
      remaining -= usedCarriedOver;

      const usedAnnual = remaining;

      await this.employeeRepo.updateVacationDays(employee.id, {
        carriedOverDays: employee.carriedOverDays - usedCarriedOver,
        annualVacationDays: employee.annualVacationDays - usedAnnual,
      });
    }

    return this.requestRepo.updateStatus(requestId, "APPROVED", approverId);
  }

  async rejectRequest(
    requestId: string,
    approverId: string
  ): Promise<VacationRequest> {
    const request = await this.requestRepo.findById(requestId);
    if (!request) {
      throw new NotFoundError("Request not found");
    }

    if (request.status !== "PENDING") {
      throw new ValidationError("Only pending requests can be rejected");
    }

    return this.requestRepo.updateStatus(requestId, "REJECTED", approverId);
  }

  async cancelRequest(
    requestId: string,
    employeeId: string
  ): Promise<VacationRequest> {
    const request = await this.requestRepo.findById(requestId);
    if (!request) {
      throw new NotFoundError("Request not found");
    }

    if (request.employeeId !== employeeId) {
      throw new ForbiddenError();
    }

    if (request.status !== "PENDING") {
      throw new ValidationError("Only pending requests can be cancelled");
    }

    return this.requestRepo.updateStatus(requestId, "CANCELLED");
  }

  private parseRequestStatus(status?: string): RequestStatus | undefined {
    if (
      status === "PENDING" ||
      status === "APPROVED" ||
      status === "REJECTED" ||
      status === "CANCELLED"
    ) {
      return status;
    }
    return undefined;
  }

  async listRequests(filters: {
    employeeId?: string;
    status?: string;
  }): Promise<VacationRequest[]> {
    const parsedFilters: {
      employeeId?: string;
      status?: RequestStatus;
    } = {};

    if (filters.employeeId) {
      parsedFilters.employeeId = filters.employeeId;
    }

    const parsedStatus = this.parseRequestStatus(filters.status);
    if (parsedStatus) {
      parsedFilters.status = parsedStatus;
    }

    return this.requestRepo.findByFilters(parsedFilters);
  }

  async getRequestById(id: string): Promise<VacationRequest> {
    const request = await this.requestRepo.findById(id);
    if (!request) {
      throw new NotFoundError("Request not found");
    }
    return request;
  }
}
