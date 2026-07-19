import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { sendResponse } from '../utils/response';

export const validate = (schema: z.ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err: any) {
    return sendResponse(res, 400, false, 'Validation Error', err.errors);
  }
};
