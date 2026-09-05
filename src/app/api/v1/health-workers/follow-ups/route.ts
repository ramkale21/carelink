import { NextRequest } from "next/server";
import { authorizeRole } from "@/lib/permissions";
import { CreateFollowUpSchema, UpdateFollowUpSchema } from "@/validators/worker.validator";
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

    const followUps = await WorkerService.getPendingFollowUps(auth.user.userId);
    return apiSuccess(followUps, "Pending follow-ups retrieved", 200);
  } catch (error: any) {
    return apiError("INTERNAL_SERVER_ERROR", error?.message || "Failed to fetch follow-ups", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await authorizeRole(req, [
      UserRole.DOCTOR,
      UserRole.ASHA,
      UserRole.ANM,
      UserRole.CHO,
      UserRole.SUPER_ADMIN,
    ]);
    if (auth instanceof Response) return auth;

    const body = await req.json();
    const validation = CreateFollowUpSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid follow-up payload",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const followUp = await WorkerService.createFollowUp(validation.data);
    return apiSuccess(followUp, "Follow-up task created", 201);
  } catch (error: any) {
    return apiError("CREATE_FAILED", error?.message || "Failed to create follow-up", 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await authorizeRole(req, [
      UserRole.ASHA,
      UserRole.ANM,
      UserRole.CHO,
      UserRole.SUPER_ADMIN,
    ]);
    if (auth instanceof Response) return auth;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return apiError("MISSING_ID", "Follow-up ID is required", 400);

    const body = await req.json();
    const validation = UpdateFollowUpSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid status payload",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const updated = await WorkerService.updateFollowUp(id, validation.data.status, validation.data.notes);
    return apiSuccess(updated, "Follow-up status updated", 200);
  } catch (error: any) {
    return apiError("UPDATE_FAILED", error?.message || "Failed to update follow-up", 500);
  }
}
