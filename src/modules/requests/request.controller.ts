import { Request, Response, NextFunction } from "express";
import { RequestService } from "./request.service.js";

export class RequestController {
  private service = new RequestService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = await this.service.createRequest(req.body);
      res.status(201).json(request);
    } catch (err) {
      next(err);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { employeeId, status } = req.query;
      const requests = await this.service.listRequests({
        employeeId: employeeId as string,
        status: status as string,
      });
      res.json(requests);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "ID is required" });
        return;
      }
      const request = await this.service.getRequestById(id);
      res.json(request);
    } catch (err) {
      next(err);
    }
  };

  approve = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          error: "request id is required",
        });
      }

      const approverId = req.user!.id;

      const request = await this.service.approveRequest(id, approverId);

      res.json(request);
    } catch (err) {
      next(err);
    }
  };

  reject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // El approver SIEMPRE viene del usuario autenticado
      const approverId = req.user!.id;

      if (!id) {
        return res.status(400).json({ error: "id is required" });
      }

      const request = await this.service.rejectRequest(id, approverId);

      res.json(request);
    } catch (err) {
      next(err);
    }
  };

  cancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          error: "request id is required",
        });
      }

      if (!req.user) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      const request = await this.service.cancelRequest(id, req.user.id);

      res.json(request);
    } catch (err) {
      next(err);
    }
  };

  getHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          error: "request id is required",
        });
      }

      const history = await this.service.getRequestHistory(id);

      res.json(history);
    } catch (err) {
      next(err);
    }
  };
}
