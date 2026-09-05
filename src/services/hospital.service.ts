import prisma from "@/lib/prisma";
import { HospitalSearchInput, CreateHospitalInput } from "@/validators/hospital.validator";
import { Prisma } from "@prisma/client";

export class HospitalService {
  static async searchHospitals(params: HospitalSearchInput) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.HospitalWhereInput = {};

    if (params.district) {
      where.district = { contains: params.district, mode: "insensitive" };
    }
    if (params.state) {
      where.state = { contains: params.state, mode: "insensitive" };
    }
    if (params.type) {
      where.type = params.type;
    }
    if (params.emergencyOnly) {
      where.emergencyAvailable = true;
    }
    if (params.query) {
      where.OR = [
        { name: { contains: params.query, mode: "insensitive" } },
        { address: { contains: params.query, mode: "insensitive" } },
        { village: { contains: params.query, mode: "insensitive" } },
      ];
    }
    if (params.specialty) {
      where.doctors = {
        some: {
          specialization: { contains: params.specialty, mode: "insensitive" },
          isAvailable: true,
        },
      };
    }

    const [items, total] = await Promise.all([
      prisma.hospital.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          doctors: {
            where: { isAvailable: true },
            select: { id: true, specialization: true, consultationFee: true },
          },
          _count: {
            select: { appointments: true, doctors: true },
          },
        },
      }),
      prisma.hospital.count({ where }),
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

  static async getHospitalById(id: string) {
    const hospital = await prisma.hospital.findUnique({
      where: { id },
      include: {
        doctors: {
          include: {
            user: { select: { name: true, phone: true, email: true } },
            schedules: true,
          },
        },
        pharmacies: true,
        _count: {
          select: {
            appointments: true,
            incomingReferrals: true,
            outgoingReferrals: true,
          },
        },
      },
    });

    if (!hospital) {
      throw new Error("HOSPITAL_NOT_FOUND: Hospital facility does not exist.");
    }

    return hospital;
  }

  static async getHospitalCapacity(id: string) {
    const hospital = await prisma.hospital.findUnique({
      where: { id },
      select: { id: true, name: true, emergencyAvailable: true },
    });

    if (!hospital) {
      throw new Error("HOSPITAL_NOT_FOUND: Hospital facility does not exist.");
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [appointmentsToday, waitingPatients, incomingReferrals] = await Promise.all([
      prisma.appointment.count({
        where: {
          hospitalId: id,
          appointmentDate: { gte: todayStart, lte: todayEnd },
        },
      }),
      prisma.appointment.count({
        where: {
          hospitalId: id,
          appointmentDate: { gte: todayStart, lte: todayEnd },
          status: { in: ["BOOKED", "CHECKED_IN", "WAITING"] },
        },
      }),
      prisma.referral.count({
        where: {
          toHospitalId: id,
          status: "CREATED",
        },
      }),
    ]);

    return {
      hospitalId: id,
      hospitalName: hospital.name,
      emergencyAvailable: hospital.emergencyAvailable,
      appointmentsToday,
      waitingPatients,
      incomingReferrals,
    };
  }

  static async createHospital(input: CreateHospitalInput) {
    const existing = await prisma.hospital.findUnique({
      where: { registrationNumber: input.registrationNumber },
    });

    if (existing) {
      throw new Error("HOSPITAL_EXISTS: Registration number already registered.");
    }

    return prisma.hospital.create({
      data: {
        name: input.name,
        registrationNumber: input.registrationNumber,
        type: input.type,
        address: input.address,
        village: input.village || null,
        district: input.district,
        state: input.state,
        latitude: input.latitude || null,
        longitude: input.longitude || null,
        phone: input.phone,
        email: input.email || null,
        emergencyAvailable: input.emergencyAvailable,
      },
    });
  }
}
