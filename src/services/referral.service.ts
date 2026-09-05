import prisma from "@/lib/prisma";
import { CreateReferralInput } from "@/validators/worker.validator";
import { ReferralStatus } from "@prisma/client";

export class ReferralService {
  static async createReferral(input: CreateReferralInput) {
    const referral = await prisma.$transaction(async (tx) => {
      const ref = await tx.referral.create({
        data: {
          patientId: input.patientId,
          fromHospitalId: input.fromHospitalId,
          toHospitalId: input.toHospitalId,
          doctorId: input.doctorId || null,
          reason: input.reason,
          priority: input.priority,
          status: ReferralStatus.CREATED,
        },
        include: {
          patient: { include: { user: { select: { name: true, phone: true } } } },
          fromHospital: { select: { name: true } },
          toHospital: { select: { name: true } },
        },
      });

      // Notify patient regarding digital referral
      const patientUser = await tx.patientProfile.findUnique({
        where: { id: input.patientId },
        select: { userId: true },
      });

      if (patientUser) {
        await tx.notification.create({
          data: {
            userId: patientUser.userId,
            type: "REFERRAL",
            title: "Digital Referral Issued",
            message: `You have been referred from ${ref.fromHospital.name} to ${ref.toHospital.name} for specialist consultation (${input.reason}).`,
          },
        });
      }

      // Audit log referral creation
      await tx.auditLog.create({
        data: {
          action: "REFERRAL_CREATED",
          entity: "Referral",
          entityId: ref.id,
          metadata: { from: input.fromHospitalId, to: input.toHospitalId },
        },
      });

      return ref;
    });

    return referral;
  }

  static async getReferralById(id: string) {
    const referral = await prisma.referral.findUnique({
      where: { id },
      include: {
        patient: { include: { user: { select: { name: true, phone: true, email: true } } } },
        fromHospital: true,
        toHospital: true,
        doctor: { include: { user: { select: { name: true } } } },
      },
    });

    if (!referral) {
      throw new Error("REFERRAL_NOT_FOUND: Referral record does not exist.");
    }

    return referral;
  }

  static async updateReferralStatus(id: string, status: ReferralStatus) {
    const updated = await prisma.referral.update({
      where: { id },
      data: { status },
      include: {
        patient: { include: { user: { select: { name: true } } } },
        fromHospital: { select: { name: true } },
        toHospital: { select: { name: true } },
      },
    });

    return updated;
  }

  static async getPatientReferrals(patientId: string) {
    return prisma.referral.findMany({
      where: { patientId },
      orderBy: { createdAt: "desc" },
      include: {
        fromHospital: { select: { name: true, type: true } },
        toHospital: { select: { name: true, type: true } },
        doctor: { include: { user: { select: { name: true } } } },
      },
    });
  }
}
