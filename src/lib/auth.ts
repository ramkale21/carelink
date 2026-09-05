import { compare, hash } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { UserRole } from "@prisma/client";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-carelink-jwt-key-change-in-production-2026"
);

const REFRESH_SECRET = new TextEncoder().encode(
  process.env.REFRESH_TOKEN_SECRET || "super-secret-carelink-refresh-key-change-in-production-2026"
);

export interface TokenPayload {
  userId: string;
  role: UserRole;
  email?: string | null;
  phone: string;
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

export async function signAccessToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(JWT_SECRET);
}

export async function signRefreshToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(REFRESH_SECRET);
}

export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
  try {
    const verified = await jwtVerify(token, REFRESH_SECRET);
    return verified.payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}
