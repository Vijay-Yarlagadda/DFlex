import { clerkMiddleware, requireAuth } from '@clerk/express';
import { Request, Response, NextFunction } from 'express';

export const clerkAuth = clerkMiddleware();

export const requireUserAuth = requireAuth();

// Optional: Type extension for Express Request to include clerk auth
declare global {
  namespace Express {
    interface Request {
      auth: {
        userId: string;
        sessionId: string;
      };
    }
  }
}
