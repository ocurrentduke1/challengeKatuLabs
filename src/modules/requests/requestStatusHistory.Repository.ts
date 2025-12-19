import { pool } from '../../config/db.js';

export class RequestStatusHistoryRepository {
  async create(input: {
    requestId: string;
    previousStatus: string;
    newStatus: string;
    changedBy: string;
  }): Promise<void> {
    await pool.query(
      `
      INSERT INTO request_status_history
        (request_id, previous_status, new_status, changed_by)
      VALUES ($1, $2, $3, $4)
      `,
      [
        input.requestId,
        input.previousStatus,
        input.newStatus,
        input.changedBy,
      ]
    );
  }

  async findByRequestId(requestId: string) {
    const { rows } = await pool.query(
      `
      SELECT
        id,
        request_id       AS "requestId",
        previous_status  AS "previousStatus",
        new_status       AS "newStatus",
        changed_by       AS "changedBy",
        created_at       AS "createdAt"
      FROM request_status_history
      WHERE request_id = $1
      ORDER BY created_at ASC
      `,
      [requestId]
    );

    return rows;
  }
}
