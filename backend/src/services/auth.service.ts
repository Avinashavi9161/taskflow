import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';
import { TokenPayload } from '../types';

const prisma = new PrismaClient();

// ─── Token Utilities ──────────────────────────────────────────────────────────

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn as jwt.SignOptions['expiresIn'],
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwt.accessSecret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
};

// ─── Auth Service ─────────────────────────────────────────────────────────────

export const authService = {
  async register(name: string, email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      const err = new Error('An account with this email already exists.') as Error & { status: number };
      err.status = 409;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, config.bcrypt.saltRounds);
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    const payload: TokenPayload = { sub: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Persist refresh token (7 days)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } });

    return { user, accessToken, refreshToken };
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const err = new Error('Invalid email or password.') as Error & { status: number };
      err.status = 401;
      throw err;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      const err = new Error('Invalid email or password.') as Error & { status: number };
      err.status = 401;
      throw err;
    }

    const payload: TokenPayload = { sub: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } });

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, accessToken, refreshToken };
  },

  async refresh(token: string) {
    let payload: TokenPayload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      const err = new Error('Invalid or expired refresh token.') as Error & { status: number };
      err.status = 401;
      throw err;
    }

    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
      const err = new Error('Refresh token has been revoked or expired.') as Error & { status: number };
      err.status = 401;
      throw err;
    }

    // Rotate refresh token
    await prisma.refreshToken.delete({ where: { token } });

    const newPayload: TokenPayload = { sub: payload.sub, email: payload.email };
    const accessToken = generateAccessToken(newPayload);
    const refreshToken = generateRefreshToken(newPayload);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({ data: { token: refreshToken, userId: payload.sub, expiresAt } });

    return { accessToken, refreshToken };
  },

  async logout(token: string) {
    await prisma.refreshToken.deleteMany({ where: { token } });
  },
};
