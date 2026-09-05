import { NextRequest } from "next/server";
import { UserRole } from "@prisma/client";
import { verifyAccessToken, TokenPayload } from "./auth";
import { apiError } from "./response";
import prisma from "./prisma";

export interface AuthContext {
  user: TokenPayload;
}

export async function extractAuthUser(req: NextRequest): Promise<TokenPayload | null> {
  // 1. Check Authorization Header: Bearer <token>
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const payload = await verifyAccessToken(token);
    if (payload) return payload;
  }

  // 2. Check Cookie: accessToken
  const tokenCookie = req.cookies.get("accessToken")?.value;
  if (tokenCookie) {
    const payload = await verifyAccessToken(tokenCookie);
    if (payload) return payload;
  }

  return null;
}

export async function requireAuth(req: NextRequest): Promise<{ user: TokenPayload } | Response> {
  const user = await extractAuthUser(req);
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required to access this resource", 401);
  }
  return { user };
}

export function requireRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  if (userRole === UserRole.SUPER_ADMIN) return true;
  return allowedRoles.includes(userRole);
}

export async function authorizeRole(
  req: NextRequest,
  allowedRoles: UserRole[]
): Promise<{ user: TokenPayload } | Response> {
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  const { user } = authResult;
  if (!requireRole(user.role, allowedRoles)) {
    return apiError(
      "FORBIDDEN",
      `Access denied. Required role: [${allowedRoles.join(", ")}], but user is [${user.role}]`,
      403
    );
  }

  return { user };
}

/**
 * Verify patient record access authorization.
 * Allows: Patient self, Super Admin, Doctor, or assigned Healthcare Worker (ASHA/ANM/CHO).
 */
export async function canAccessPatientData(
  user: TokenPayload,
  patientProfileId: string
): Promise<boolean> {
  if (user.role === UserRole.SUPER_ADMIN) return true;
  if (user.role === UserRole.DOCTOR || user.role === UserRole.HOSPITAL_ADMIN) return true;

  if (user.role === UserRole.PATIENT) {
    const profile = await prisma.patientProfile.findUnique({
      where: { userId: user.userId },
      select: { id: true },
    });
    return profile?.id === patientProfileId;
  }

  if (
    user.role === UserRole.ASHA ||
    user.role === UserRole.ANM ||
    user.role === UserRole.CHO
  ) {
    const workerProfile = await prisma.healthcareWorkerProfile.findUnique({
      where: { userId: user.userId },
    });
    if (!workerProfile) return false;

    const patientProfile = await prisma.patientProfile.findUnique({
      where: { id: patientProfileId },
      select: { district: true, village: true },
    });

    if (!patientProfile) return false;
    return (
      patientProfile.district === workerProfile.district &&
      patientProfile.village === workerProfile.village
    );
  }

  return false;
}
