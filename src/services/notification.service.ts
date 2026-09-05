import prisma from "@/lib/prisma";

export class NotificationService {
  static async getUserNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  static async markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  static async getAuditLogs(entity?: string, limit = 50) {
    return prisma.auditLog.findMany({
      where: entity ? { entity } : undefined,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: { select: { name: true, role: true } },
      },
    });
  }
}
