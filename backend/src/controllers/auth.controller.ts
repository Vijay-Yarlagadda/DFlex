import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { sendResponse } from '../utils/response';

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.registerUser(req.body);
    return sendResponse(res, 201, true, 'User registered successfully', { user });
  } catch (error: any) {
    if (error.message === 'User already exists') {
      return sendResponse(res, 400, false, error.message);
    }
    return sendResponse(res, 500, false, 'Server error', error.message);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = await authService.loginUser(req.body);
    return sendResponse(res, 200, true, 'Login successful', data);
  } catch (error: any) {
    if (error.message === 'Invalid email or password') {
      return sendResponse(res, 401, false, error.message);
    }
    return sendResponse(res, 500, false, 'Server error', error.message);
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const user = await authService.getUserById(req.user!.id);
    return sendResponse(res, 200, true, 'User fetched successfully', { user });
  } catch (error: any) {
    return sendResponse(res, 404, false, error.message);
  }
};

export const logout = async (req: Request, res: Response) => {
  // For JWT, logout is typically handled client-side by deleting the token.
  // We can just return success here.
  return sendResponse(res, 200, true, 'Logged out successfully');
};
