import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendResponse } from '../utils/response';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendResponse(res, 401, false, 'Authentication token missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };

    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    return sendResponse(res, 401, false, 'Invalid or expired token');
  }
};
