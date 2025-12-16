export type RequestType = 'VACATION' | 'PERMISSION';

export type RequestStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

export interface VacationRequest {
  id: string;
  employeeId: string;
  type: RequestType;
  startDate: Date;
  endDate: Date;
  startTime?: string | null;
  endTime?: string | null;
  reason: string;
  status: RequestStatus;
  approvedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payload para crear solicitudes
 */
export interface CreateRequestInput {
  employeeId: string;
  type: RequestType;
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
  reason: string;
}
