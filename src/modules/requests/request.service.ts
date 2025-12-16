import { RequestRepository } from "./request.repository.js";
import { EmployeeRepository } from "../employees/employee.repository.js";
import {
  CreateRequestInput,
  VacationRequest,
  RequestStatus,
} from "./request.types.js";
import { EmployeeService } from "../employees/employee.service.js";

export class RequestService {
  constructor(
    private requestRepo = new RequestRepository(),
    private employeeRepo = new EmployeeRepository(),
    private employeeService = new EmployeeService()
  ) {}

  async createRequest(input: CreateRequestInput): Promise<VacationRequest> {
    // 1. Verificar que el empleado existe
    const employee = await this.employeeRepo.findById(input.employeeId);
    if (!employee) {
      throw new Error("Employee not found");
    }

    // 2. Validar traslapes con solicitudes APPROVED
    const overlapping = await this.requestRepo.findApprovedByEmployeeInRange(
      input.employeeId,
      input.startDate,
      input.endDate
    );

    if (overlapping.length > 0) {
      throw new Error("Request overlaps with an approved request");
    }

    // 3. Validar saldo si es VACATION
    if (input.type === "VACATION") {
      const balance = await this.employeeService.getVacationBalance(
        input.employeeId
      );

      const requestedDays =
        (input.endDate.getTime() - input.startDate.getTime()) /
          (1000 * 60 * 60 * 24) +
        1;

      if (requestedDays > balance) {
        throw new Error("Insufficient vacation balance");
      }
    }

    return this.requestRepo.create(input);
  }

  async approveRequest(
    requestId: string,
    approverId: string
  ): Promise<VacationRequest> {
    const request = await this.requestRepo.findById(requestId);
    if (!request) {
      throw new Error("Request not found");
    }

    if (request.status !== "PENDING") {
      throw new Error("Only pending requests can be approved");
    }

    // Revalidar saldo
    if (request.type === "VACATION") {
      const balance = await this.employeeService.getVacationBalance(
        request.employeeId
      );

      const requestedDays =
        (request.endDate.getTime() - request.startDate.getTime()) /
          (1000 * 60 * 60 * 24) +
        1;

      if (requestedDays > balance) {
        throw new Error("Insufficient vacation balance");
      }
    }

    return this.requestRepo.updateStatus(requestId, "APPROVED", approverId);
  }

  async rejectRequest(
    requestId: string,
    approverId: string
  ): Promise<VacationRequest> {
    const request = await this.requestRepo.findById(requestId);
    if (!request) {
      throw new Error("Request not found");
    }

    if (request.status !== "PENDING") {
      throw new Error("Only pending requests can be rejected");
    }

    return this.requestRepo.updateStatus(requestId, "REJECTED", approverId);
  }

  async cancelRequest(
    requestId: string,
    employeeId: string
  ): Promise<VacationRequest> {
    const request = await this.requestRepo.findById(requestId);
    if (!request) {
      throw new Error("Request not found");
    }

    if (request.employeeId !== employeeId) {
      throw new Error("Cannot cancel another employee request");
    }

    if (request.status !== "PENDING") {
      throw new Error("Only pending requests can be cancelled");
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
      throw new Error("Request not found");
    }
    return request;
  }
}
