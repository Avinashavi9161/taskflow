import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { AuthenticatedRequest } from '../types';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const { user, accessToken, refreshToken } = await authService.register(name, email, password);

      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
      res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        data: { user, accessToken },
      });
    } catch (err: any) {
      res.status(err.status ?? 500).json({ success: false, message: err.message });
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await authService.login(email, password);

      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
      res.json({
        success: true,
        message: 'Welcome back!',
        data: { user, accessToken },
      });
    } catch (err: any) {
      res.status(err.status ?? 500).json({ success: false, message: err.message });
    }
  },

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies?.refreshToken ?? req.body?.refreshToken;
      if (!token) {
        res.status(401).json({ success: false, message: 'No refresh token provided.' });
        return;
      }

      const { accessToken, refreshToken } = await authService.refresh(token);
      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
      res.json({ success: true, message: 'Tokens refreshed.', data: { accessToken } });
    } catch (err: any) {
      res.status(err.status ?? 500).json({ success: false, message: err.message });
    }
  },

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies?.refreshToken ?? req.body?.refreshToken;
      if (token) await authService.logout(token);

      res.clearCookie('refreshToken', { path: '/' });
      res.json({ success: true, message: 'Logged out successfully.' });
    } catch (err: any) {
      res.status(err.status ?? 500).json({ success: false, message: err.message });
    }
  },

  async me(req: Request, res: Response): Promise<void> {
    const user = (req as AuthenticatedRequest).user;
    res.json({ success: true, message: 'Authenticated.', data: { user } });
  },
};
