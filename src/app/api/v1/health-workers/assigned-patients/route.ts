import { NextRequest } from "next/server";
import { authorizeRole } from "@/lib/permissions";
import { WorkerService } from "@/services/worker.service";
import { UserRole } from "@prisma/client";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const auth = await authorizeRole(req, [
      UserRole.ASHA,
      UserRole.ANM,
      UserRole.CHO,
      UserRole.SUPER_ADMIN,
    ]);
    if (auth instanceof Response) return auth;

    const result = await WorkerService.getAssignedPatients(auth.user.userId);
    return apiSuccess(result, "Assigned community patients retrieved", 200);
  } catch (error: any) {
    return apiError("INTERNAL_SERVER_ERROR", error?.message || "Failed to fetch assigned patients", 500);
  }
}
