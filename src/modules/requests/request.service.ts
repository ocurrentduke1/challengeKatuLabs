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
import { RequestStatusHistoryRepository } from "./requestStatusHistory.Repository.js";

export class RequestService {
  constructor(
    private requestRepo = new RequestRepository(),
    private employeeRepo = new EmployeeRepository(),
    private employeeService = new EmployeeService(),
    private statusHistoryRepo = new RequestStatusHistoryRepository()
  ) {}

  async createRequest(input: CreateRequestInput): Promise<VacationRequest> {
    const { employeeId, type, startDate, endDate, startTime, endTime } = input;

    // Validar fechas base
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      throw new ValidationError("Start date cannot be in the past");
    }

    // Verificar que el empleado existe
    const employee = await this.employeeRepo.findById(employeeId);
    if (!employee) {
      throw new NotFoundError("Employee not found");
    }

    // Validaciones específicas por tipo
    if (type === "VACATION") {
      if (startTime || endTime) {
        throw new ValidationError(
          "startTime and endTime must be null for vacations"
        );
      }

      // Validar traslapes por FECHA
      const overlapping = await this.requestRepo.findApprovedByEmployeeInRange(
        employeeId,
        start,
        end
      );

      if (overlapping.length > 0) {
        throw new ValidationError(
          "Vacation request overlaps with an approved request"
        );
      }

      // Validar saldo
      const balance = await this.employeeService.getVacationBalance(employeeId);

      const requestedDays =
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;

      if (requestedDays > balance) {
        throw new ValidationError("Insufficient vacation balance");
      }
    }

    if (type === "PERMISSION") {
      if (!startTime || !endTime) {
        throw new ValidationError(
          "startTime and endTime are required for permissions"
        );
      }

      // Deben ser el mismo día
      if (start.getTime() !== end.getTime()) {
        throw new ValidationError(
          "Permissions must start and end on the same day"
        );
      }

      const startT = new Date(`1970-01-01T${startTime}`);
      const endT = new Date(`1970-01-01T${endTime}`);

      if (isNaN(startT.getTime()) || isNaN(endT.getTime())) {
        throw new ValidationError("Invalid time format");
      }

      if (startT >= endT) {
        throw new ValidationError("startTime must be before endTime");
      }

      // Validar traslapes por FECHA + HORA
      const overlapping =
        await this.requestRepo.findApprovedPermissionsOverlapping(
          employeeId,
          start,
          startTime,
          endTime
        );

      if (overlapping.length > 0) {
        throw new ValidationError(
          "Permission overlaps with an approved permission"
        );
      }
    }

    // Crear solicitud
    const request = await this.requestRepo.create({
      ...input,
      startDate: start,
      endDate: end,
    });

    // Guardar historial (CREATED → PENDING)
    await this.statusHistoryRepo.create({
      requestId: request.id,
      previousStatus: "CREATED",
      newStatus: "PENDING",
      changedBy: employeeId,
    });

    return request;
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
      const overlapping = await this.requestRepo.findApprovedByEmployeeInRange(
        request.employeeId,
        request.startDate,
        request.endDate
      );

      // Excluir la misma solicitud (por seguridad)
      const conflicts = overlapping.filter((r) => r.id !== request.id);

      if (conflicts.length > 0) {
        throw new ValidationError(
          "Vacation request overlaps with an approved request"
        );
      }
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

      // Descuento priorizando carriedOverDays
      let remaining = requestedDays;

      const usedCarriedOver = Math.min(employee.carriedOverDays, remaining);
      remaining -= usedCarriedOver;

      const usedAnnual = remaining;

      await this.employeeRepo.updateVacationDays(employee.id, {
        carriedOverDays: employee.carriedOverDays - usedCarriedOver,
        annualVacationDays: employee.annualVacationDays - usedAnnual,
      });
    }

    // Actualizar estado
    const updatedRequest = await this.requestRepo.updateStatus(
      requestId,
      "APPROVED",
      approverId
    );

    // Guardar historial
    await this.statusHistoryRepo.create({
      requestId,
      previousStatus: request.status, // PENDING
      newStatus: "APPROVED",
      changedBy: approverId,
    });

    return updatedRequest;
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

    // Actualizar estado
    const updatedRequest = await this.requestRepo.updateStatus(
      requestId,
      "REJECTED",
      approverId
    );

    // Guardar historial
    await this.statusHistoryRepo.create({
      requestId,
      previousStatus: request.status, // PENDING
      newStatus: "REJECTED",
      changedBy: approverId,
    });

    return updatedRequest;
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

    // Actualizar estado
    const updatedRequest = await this.requestRepo.updateStatus(
      requestId,
      "CANCELLED"
    );

    // Guardar historial
    await this.statusHistoryRepo.create({
      requestId,
      previousStatus: request.status, // PENDING
      newStatus: "CANCELLED",
      changedBy: employeeId,
    });

    return updatedRequest;
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

  async listRequests(params: {
    employeeId?: string;
    status?: string;
    page: number;
    limit: number;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 5));
    const offset = (page - 1) * limit;

    const repoParams: {
      employeeId?: string;
      status?: string;
      limit: number;
      offset: number;
    } = {
      limit,
      offset,
    };

    if (params.employeeId) {
      repoParams.employeeId = params.employeeId;
    }

    if (params.status) {
      repoParams.status = params.status;
    }

    const { data, total } = await this.requestRepo.list(repoParams);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRequestById(id: string): Promise<VacationRequest> {
    const request = await this.requestRepo.findById(id);
    if (!request) {
      throw new NotFoundError("Request not found");
    }
    return request;
  }

  async getRequestHistory(requestId: string) {
    const request = await this.requestRepo.findById(requestId);

    if (!request) {
      throw new NotFoundError("Request not found");
    }

    return this.statusHistoryRepo.findByRequestId(requestId);
  }
}
