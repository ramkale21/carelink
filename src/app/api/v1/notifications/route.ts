import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/permissions";
import { NotificationService } from "@/services/notification.service";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const notifications = await NotificationService.getUserNotifications(auth.user.userId);
    return apiSuccess(notifications, "Notifications retrieved successfully", 200);
  } catch (error: any) {
    return apiError("INTERNAL_SERVER_ERROR", error?.message || "Failed to fetch notifications", 500);
  }
}
