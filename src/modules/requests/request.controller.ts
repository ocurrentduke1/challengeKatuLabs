import { Request, Response, NextFunction } from 'express';
import { RequestService } from './request.service.js';

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
        status: status as string
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
        res.status(400).json({ error: 'ID is required' });
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
        res.status(400).json({ error: 'ID is required' });
        return;
      }
      // En el paso 7 simularemos auth
      const approverId = req.body.approverId;
      const request = await this.service.approveRequest(
        id,
        approverId
      );
      res.json(request);
    } catch (err) {
      next(err);
    }
  };

  reject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'ID is required' });
        return;
      }
      const approverId = req.body.approverId;
      const request = await this.service.rejectRequest(
        id,
        approverId
      );
      res.json(request);
    } catch (err) {
      next(err);
    }
  };

  cancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'ID is required' });
        return;
      }
      const { employeeId } = req.body;
      const request = await this.service.cancelRequest(
        id,
        employeeId
      );
      res.json(request);
    } catch (err) {
      next(err);
    }
  };
}
