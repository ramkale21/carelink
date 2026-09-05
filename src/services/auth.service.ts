import prisma from "@/lib/prisma";
import { hashPassword, comparePassword, signAccessToken, signRefreshToken } from "@/lib/auth";
import { RegisterInput, LoginInput } from "@/validators/auth.validator";
import { UserRole } from "@prisma/client";

export class AuthService {
  static async registerUser(input: RegisterInput) {
    // 1. Check existing phone
    const existingPhone = await prisma.user.findUnique({
      where: { phone: input.phone },
    });
    if (existingPhone) {
      throw new Error("PHONE_EXISTS: User with this phone number already exists.");
    }

    // 2. Check existing email if provided
    if (input.email && input.email.trim() !== "") {
      const existingEmail = await prisma.user.findUnique({
        where: { email: input.email },
      });
      if (existingEmail) {
        throw new Error("EMAIL_EXISTS: User with this email address already exists.");
      }
    }

    const hashedPassword = await hashPassword(input.password);
    const cleanEmail = input.email && input.email.trim() !== "" ? input.email : null;

    // 3. Create User & Profile atomically in DB Transaction
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: input.name,
          email: cleanEmail,
          phone: input.phone,
          passwordHash: hashedPassword,
          role: input.role,
          isVerified: true,
        },
      });

      // Auto-create role profile based on role
      if (input.role === UserRole.PATIENT) {
        await tx.patientProfile.create({
          data: {
            userId: newUser.id,
            dateOfBirth: input.patientDetails?.dateOfBirth
              ? new Date(input.patientDetails.dateOfBirth)
              : null,
            gender: input.patientDetails?.gender || null,
            bloodGroup: input.patientDetails?.bloodGroup || null,
            address: input.patientDetails?.address || null,
            village: input.patientDetails?.village || null,
            district: input.patientDetails?.district || null,
            state: input.patientDetails?.state || null,
            emergencyContact: input.patientDetails?.emergencyContact || null,
            preferredLanguage: input.patientDetails?.preferredLanguage || "en",
          },
        });
      } else if (input.role === UserRole.DOCTOR && input.doctorDetails) {
        await tx.doctorProfile.create({
          data: {
            userId: newUser.id,
            hospitalId: input.doctorDetails.hospitalId || null,
            specialization: input.doctorDetails.specialization,
            qualification: input.doctorDetails.qualification,
            registrationNumber: input.doctorDetails.registrationNumber,
            experience: input.doctorDetails.experience,
            consultationFee: input.doctorDetails.consultationFee,
          },
        });
      } else if (
        (input.role === UserRole.ASHA ||
          input.role === UserRole.ANM ||
          input.role === UserRole.CHO) &&
        input.workerDetails
      ) {
        await tx.healthcareWorkerProfile.create({
          data: {
            userId: newUser.id,
            workerType: input.workerDetails.workerType,
            village: input.workerDetails.village,
            district: input.workerDetails.district,
            state: input.workerDetails.state,
            assignedFacilityId: input.workerDetails.assignedFacilityId || null,
          },
        });
      }

      // Log registration audit event
      await tx.auditLog.create({
        data: {
          userId: newUser.id,
          action: "USER_REGISTERED",
          entity: "User",
          entityId: newUser.id,
          metadata: { role: newUser.role, phone: newUser.phone },
        },
      });

      return newUser;
    });

    const tokenPayload = {
      userId: result.id,
      role: result.role,
      email: result.email,
      phone: result.phone,
    };

    const accessToken = await signAccessToken(tokenPayload);
    const refreshToken = await signRefreshToken(tokenPayload);

    return {
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        phone: result.phone,
        role: result.role,
        isVerified: result.isVerified,
        createdAt: result.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }

  static async loginUser(input: LoginInput) {
    const isEmail = input.phoneOrEmail.includes("@");
    const user = await prisma.user.findFirst({
      where: isEmail
        ? { email: input.phoneOrEmail }
        : { phone: input.phoneOrEmail },
      include: {
        patientProfile: true,
        doctorProfile: true,
        healthcareWorkerProfile: true,
        hospitalAdmin: true,
      },
    });

    if (!user) {
      throw new Error("INVALID_CREDENTIALS: Invalid phone number/email or password.");
    }

    if (!user.isActive) {
      throw new Error("ACCOUNT_DISABLED: Your account has been deactivated. Please contact support.");
    }

    const isPasswordValid = await comparePassword(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("INVALID_CREDENTIALS: Invalid phone number/email or password.");
    }

    const tokenPayload = {
      userId: user.id,
      role: user.role,
      email: user.email,
      phone: user.phone,
    };

    const accessToken = await signAccessToken(tokenPayload);
    const refreshToken = await signRefreshToken(tokenPayload);

    // Audit log login
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_LOGIN",
        entity: "User",
        entityId: user.id,
        metadata: { role: user.role },
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        patientProfile: user.patientProfile,
        doctorProfile: user.doctorProfile,
        healthcareWorkerProfile: user.healthcareWorkerProfile,
        hospitalAdmin: user.hospitalAdmin,
      },
      accessToken,
      refreshToken,
    };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
        patientProfile: true,
        doctorProfile: {
          include: { hospital: true },
        },
        healthcareWorkerProfile: {
          include: { assignedFacility: true },
        },
        hospitalAdmin: {
          include: { hospital: true },
        },
        pharmacistProfile: {
          include: { pharmacy: true },
        },
      },
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND: User record not found.");
    }

    return user;
  }
}
