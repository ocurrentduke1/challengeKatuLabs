import { pool } from "../../config/db.js";
import {
  VacationRequest,
  CreateRequestInput,
  RequestStatus,
} from "./request.types.js";

export class RequestRepository {
  async create(input: CreateRequestInput): Promise<VacationRequest> {
    const result = await pool.query(
      `
      INSERT INTO requests (
        employee_id,
        type,
        start_date,
        end_date,
        start_time,
        end_time,
        reason,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING')
      RETURNING *
      `,
      [
        input.employeeId,
        input.type,
        input.startDate,
        input.endDate,
        input.startTime ?? null,
        input.endTime ?? null,
        input.reason,
      ]
    );

    return this.mapRowToRequest(result.rows[0]);
  }

  async findById(id: string): Promise<VacationRequest | null> {
    const result = await pool.query(`SELECT * FROM requests WHERE id = $1`, [
      id,
    ]);

    if (result.rows.length === 0) return null;
    return this.mapRowToRequest(result.rows[0]);
  }

  async findByFilters(filters: {
    employeeId?: string;
    status?: RequestStatus;
  }): Promise<VacationRequest[]> {
    const conditions: string[] = [];
    const values: any[] = [];

    if (filters.employeeId) {
      values.push(filters.employeeId);
      conditions.push(`employee_id = $${values.length}`);
    }

    if (filters.status) {
      values.push(filters.status);
      conditions.push(`status = $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await pool.query(
      `SELECT * FROM requests ${whereClause} ORDER BY created_at DESC`,
      values
    );

    return result.rows.map(this.mapRowToRequest);
  }

  async findApprovedByEmployeeInRange(
    employeeId: string,
    startDate: Date,
    endDate: Date
  ): Promise<VacationRequest[]> {
    const result = await pool.query(
      `
      SELECT *
      FROM requests
      WHERE employee_id = $1
        AND status = 'APPROVED'
        AND type = 'VACATION'
        AND NOT (end_date < $2 OR start_date > $3)
      `,
      [employeeId, startDate, endDate]
    );

    return result.rows.map(this.mapRowToRequest);
  }

  async findApprovedPermissionsOverlapping(
    employeeId: string,
    date: Date,
    startTime: string,
    endTime: string
  ) {
    const result = await pool.query(
      `
    SELECT *
    FROM requests
    WHERE employee_id = $1
      AND type = 'PERMISSION'
      AND status = 'APPROVED'
      AND start_date = $2
      AND start_time < $4
      AND end_time > $3
    `,
      [employeeId, date, startTime, endTime]
    );

    return result.rows;
  }

  async updateStatus(
    requestId: string,
    status: RequestStatus,
    approvedBy?: string
  ): Promise<VacationRequest> {
    const result = await pool.query(
      `
      UPDATE requests
      SET status = $1,
          approved_by = $2,
          updated_at = NOW()
      WHERE id = $3
      RETURNING *
      `,
      [status, approvedBy ?? null, requestId]
    );

    return this.mapRowToRequest(result.rows[0]);
  }

  async list(params: {
    employeeId?: string;
    status?: string;
    limit: number;
    offset: number;
  }) {
    const values: any[] = [];
    const where: string[] = [];

    if (params.employeeId) {
      values.push(params.employeeId);
      where.push(`employee_id = $${values.length}`);
    }

    if (params.status) {
      values.push(params.status);
      where.push(`status = $${values.length}`);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const dataQuery = `
    SELECT *
    FROM requests
    ${whereSql}
    ORDER BY created_at DESC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

    const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM requests
    ${whereSql}
  `;

    const dataResult = await pool.query(dataQuery, [
      ...values,
      params.limit,
      params.offset,
    ]);

    const countResult = await pool.query(countQuery, values);

    return {
      data: dataResult.rows,
      total: countResult.rows[0].total,
    };
  }

  private mapRowToRequest(row: any): VacationRequest {
    return {
      id: row.id,
      employeeId: row.employee_id,
      type: row.type,
      startDate: row.start_date,
      endDate: row.end_date,
      startTime: row.start_time,
      endTime: row.end_time,
      reason: row.reason,
      status: row.status,
      approvedBy: row.approved_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
