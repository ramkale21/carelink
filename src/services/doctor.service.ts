import prisma from "@/lib/prisma";
import { DoctorSearchInput, DoctorScheduleInput } from "@/validators/doctor.validator";
import { Prisma } from "@prisma/client";

export class DoctorService {
  static async searchDoctors(params: DoctorSearchInput) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.DoctorProfileWhereInput = {};

    if (params.specialization) {
      where.specialization = { contains: params.specialization, mode: "insensitive" };
    }
    if (params.hospitalId) {
      where.hospitalId = params.hospitalId;
    }
    if (params.isAvailable !== undefined) {
      where.isAvailable = params.isAvailable;
    }
    if (params.district) {
      where.hospital = { district: { contains: params.district, mode: "insensitive" } };
    }
    if (params.query) {
      where.OR = [
        { specialization: { contains: params.query, mode: "insensitive" } },
        { qualification: { contains: params.query, mode: "insensitive" } },
        { user: { name: { contains: params.query, mode: "insensitive" } } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.doctorProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { experience: "desc" },
        include: {
          user: { select: { id: true, name: true, phone: true, email: true } },
          hospital: { select: { id: true, name: true, type: true, district: true } },
          schedules: true,
        },
      }),
      prisma.doctorProfile.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getDoctorById(id: string) {
    const doctor = await prisma.doctorProfile.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, phone: true, email: true } },
        hospital: true,
        schedules: true,
      },
    });

    if (!doctor) {
      throw new Error("DOCTOR_NOT_FOUND: Doctor profile does not exist.");
    }

    return doctor;
  }

  static async getDoctorSchedule(doctorId: string) {
    const schedules = await prisma.doctorSchedule.findMany({
      where: { doctorId },
      orderBy: { dayOfWeek: "asc" },
    });

    return schedules;
  }

  static async setDoctorSchedule(doctorId: string, schedules: DoctorScheduleInput[]) {
    // Replace schedules inside transaction
    return prisma.$transaction(async (tx) => {
      await tx.doctorSchedule.deleteMany({
        where: { doctorId },
      });

      const created = await tx.doctorSchedule.createMany({
        data: schedules.map((s) => ({
          doctorId,
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
          slotDuration: s.slotDuration,
          maxPatients: s.maxPatients,
        })),
      });

      return created;
    });
  }

  static async updateAvailability(doctorId: string, isAvailable: boolean) {
    return prisma.doctorProfile.update({
      where: { id: doctorId },
      data: { isAvailable },
    });
  }
}
