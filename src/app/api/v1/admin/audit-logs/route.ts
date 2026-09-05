import { NextRequest } from "next/server";
import { authorizeRole } from "@/lib/permissions";
import { NotificationService } from "@/services/notification.service";
import { UserRole } from "@prisma/client";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const auth = await authorizeRole(req, [
      UserRole.SUPER_ADMIN,
      UserRole.HOSPITAL_ADMIN,
    ]);
    if (auth instanceof Response) return auth;

    const { searchParams } = new URL(req.url);
    const entity = searchParams.get("entity") || undefined;
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const logs = await NotificationService.getAuditLogs(entity, limit);
    return apiSuccess(logs, "Audit logs retrieved successfully", 200);
  } catch (error: any) {
    return apiError("INTERNAL_SERVER_ERROR", error?.message || "Failed to fetch audit logs", 500);
  }
}
