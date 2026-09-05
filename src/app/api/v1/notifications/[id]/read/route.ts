import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/permissions";
import { NotificationService } from "@/services/notification.service";
import { apiSuccess, apiError } from "@/lib/response";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    await NotificationService.markAsRead(id, auth.user.userId);

    return apiSuccess(null, "Notification marked as read", 200);
  } catch (error: any) {
    return apiError("UPDATE_FAILED", error?.message || "Failed to update notification", 500);
  }
}
