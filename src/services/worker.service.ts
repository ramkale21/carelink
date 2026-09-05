import prisma from "@/lib/prisma";
import {
  CommunityPatientRegisterInput,
  CreateHealthAssessmentInput,
  CreateFollowUpInput,
} from "@/validators/worker.validator";
import { UserRole } from "@prisma/client";
import { hashPassword } from "@/lib/auth";

export class WorkerService {
  static async registerCommunityPatient(workerUserId: string, input: CommunityPatientRegisterInput) {
    const workerProfile = await prisma.healthcareWorkerProfile.findUnique({
      where: { userId: workerUserId },
    });

    if (!workerProfile) {
      throw new Error("WORKER_NOT_FOUND: Authorized healthcare worker profile not found.");
    }

    // Default password for field-registered patients
    const defaultPassword = await hashPassword("CareLink@123");

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create User entry
      const user = await tx.user.create({
        data: {
          name: input.name,
          phone: input.phone,
          passwordHash: defaultPassword,
          role: UserRole.PATIENT,
          isVerified: true,
        },
      });

      // 2. Create PatientProfile
      const patientProfile = await tx.patientProfile.create({
        data: {
          userId: user.id,
          dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
          gender: input.gender || null,
          village: input.village,
          district: input.district,
          state: input.state,
          emergencyContact: input.emergencyContact || null,
          preferredLanguage: input.preferredLanguage || "en",
        },
      });

      // Audit log registration by ASHA
      await tx.auditLog.create({
        data: {
          userId: workerUserId,
          action: "COMMUNITY_PATIENT_REGISTERED",
          entity: "PatientProfile",
          entityId: patientProfile.id,
          metadata: { workerType: workerProfile.workerType, village: input.village },
        },
      });

      return {
        patientId: patientProfile.id,
        userId: user.id,
        name: user.name,
        phone: user.phone,
        village: input.village,
        district: input.district,
      };
    });

    return result;
  }

  static async createHealthAssessment(workerUserId: string, input: CreateHealthAssessmentInput) {
    const workerProfile = await prisma.healthcareWorkerProfile.findUnique({
      where: { userId: workerUserId },
    });

    if (!workerProfile) {
      throw new Error("WORKER_NOT_FOUND: Authorized healthcare worker profile not found.");
    }

    const assessment = await prisma.healthAssessment.create({
      data: {
        patientId: input.patientId,
        workerId: workerProfile.id,
        symptoms: input.symptoms,
        vitals: input.vitals || null,
        bloodPressure: input.bloodPressure || null,
        heartRate: input.heartRate || null,
        temperature: input.temperature || null,
        spo2: input.spo2 || null,
        bloodGlucose: input.bloodGlucose || null,
        riskLevel: input.riskLevel,
      },
      include: {
        patient: { include: { user: { select: { name: true, phone: true } } } },
      },
    });

    return assessment;
  }

  static async getAssignedPatients(workerUserId: string) {
    const workerProfile = await prisma.healthcareWorkerProfile.findUnique({
      where: { userId: workerUserId },
    });

    if (!workerProfile) {
      throw new Error("WORKER_NOT_FOUND: Healthcare worker profile not found.");
    }

    const patients = await prisma.patientProfile.findMany({
      where: {
        district: workerProfile.district,
        village: workerProfile.village,
      },
      include: {
        user: { select: { id: true, name: true, phone: true } },
        healthAssessments: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
        followUps: {
          where: { status: "PENDING" },
          take: 1,
        },
      },
    });

    return {
      workerId: workerProfile.id,
      workerType: workerProfile.workerType,
      village: workerProfile.village,
      district: workerProfile.district,
      totalAssigned: patients.length,
      patients,
    };
  }

  static async createFollowUp(input: CreateFollowUpInput) {
    const followUp = await prisma.followUp.create({
      data: {
        patientId: input.patientId,
        doctorId: input.doctorId || null,
        hospitalId: input.hospitalId || null,
        appointmentId: input.appointmentId || null,
        followUpDate: new Date(input.followUpDate),
        reason: input.reason,
        notes: input.notes || null,
        status: "PENDING",
      },
      include: {
        patient: { include: { user: { select: { name: true, phone: true } } } },
      },
    });

    return followUp;
  }

  static async getPendingFollowUps(workerUserId: string) {
    const workerProfile = await prisma.healthcareWorkerProfile.findUnique({
      where: { userId: workerUserId },
    });

    if (!workerProfile) {
      throw new Error("WORKER_NOT_FOUND: Healthcare worker profile not found.");
    }

    const followUps = await prisma.followUp.findMany({
      where: {
        patient: {
          district: workerProfile.district,
          village: workerProfile.village,
        },
        status: "PENDING",
      },
      orderBy: { followUpDate: "asc" },
      include: {
        patient: { include: { user: { select: { name: true, phone: true } } } },
        doctor: { include: { user: { select: { name: true } } } },
        hospital: { select: { name: true } },
      },
    });

    return followUps;
  }

  static async updateFollowUp(id: string, status: string, notes?: string) {
    return prisma.followUp.update({
      where: { id },
      data: {
        status,
        notes: notes || undefined,
      },
    });
  }
}
