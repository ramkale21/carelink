import prisma from "@/lib/prisma";
import { CreateAppointmentInput } from "@/validators/appointment.validator";
import { AppointmentPriority, AppointmentStatus, QueueEventType } from "@prisma/client";
import { checkIdempotencyKey } from "@/lib/idempotency";

export class AppointmentService {
  /**
   * Calculate available 15m/custom slots for doctor on a specific date YYYY-MM-DD
   */
  static async getAvailableSlots(doctorId: string, dateStr: string) {
    const targetDate = new Date(dateStr);
    const dayOfWeek = targetDate.getDay(); // 0-6

    // 1. Get Doctor's schedule for this day of week
    const schedule = await prisma.doctorSchedule.findFirst({
      where: { doctorId, dayOfWeek },
    });

    if (!schedule) {
      return {
        doctorId,
        date: dateStr,
        available: false,
        message: "Doctor does not have scheduled hours on this day.",
        slots: [],
      };
    }

    // 2. Fetch existing booked appointments on this date
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: { gte: startOfDay, lte: endOfDay },
        status: { notIn: [AppointmentStatus.CANCELLED] },
      },
      select: { startTime: true },
    });

    const bookedTimes = new Set(existingAppointments.map((a) => a.startTime));

    // 3. Generate time slots from startTime to endTime
    const slots: { startTime: string; endTime: string; isBooked: boolean }[] = [];
    const [startH, startM] = schedule.startTime.split(":").map(Number);
    const [endH, endM] = schedule.endTime.split(":").map(Number);

    let currentMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;
    const duration = schedule.slotDuration || 15;

    while (currentMins + duration <= endMins) {
      const h = Math.floor(currentMins / 60);
      const m = currentMins % 60;
      const timeStr = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;

      const nextMins = currentMins + duration;
      const nextH = Math.floor(nextMins / 60);
      const nextM = nextMins % 60;
      const nextTimeStr = `${nextH.toString().padStart(2, "0")}:${nextM.toString().padStart(2, "0")}`;

      slots.push({
        startTime: timeStr,
        endTime: nextTimeStr,
        isBooked: bookedTimes.has(timeStr),
      });

      currentMins += duration;
    }

    return {
      doctorId,
      date: dateStr,
      available: true,
      slotDuration: duration,
      slots,
    };
  }

  /**
   * Concurrency-Safe Appointment Booking
   */
  static async bookAppointment(input: CreateAppointmentInput, idempotencyKey?: string) {
    // 1. Check idempotency key first
    if (idempotencyKey) {
      const existing = await checkIdempotencyKey(idempotencyKey);
      if (existing) return existing;
    }

    const apptDate = new Date(input.appointmentDate);
    const startOfDay = new Date(apptDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(apptDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Calculate end time (default +15 mins)
    const [h, m] = input.startTime.split(":").map(Number);
    const totalMins = h * 60 + m + 15;
    const endH = Math.floor(totalMins / 60);
    const endM = totalMins % 60;
    const endTime = `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`;

    // Execute in serializable/isolated DB Transaction
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Double check slot availability inside transaction
        const existingSlot = await tx.appointment.findFirst({
          where: {
            doctorId: input.doctorId,
            appointmentDate: { gte: startOfDay, lte: endOfDay },
            startTime: input.startTime,
            status: { notIn: [AppointmentStatus.CANCELLED] },
          },
        });

        if (existingSlot) {
          throw new Error("SLOT_UNAVAILABLE: The selected doctor slot is already booked.");
        }

        // Count current appointments today to generate sequential token
        const countToday = await tx.appointment.count({
          where: {
            doctorId: input.doctorId,
            appointmentDate: { gte: startOfDay, lte: endOfDay },
          },
        });

        const tokenNumber = countToday + 1;

        // Create appointment record
        const appointment = await tx.appointment.create({
          data: {
            patientId: input.patientId,
            doctorId: input.doctorId,
            hospitalId: input.hospitalId,
            appointmentDate: apptDate,
            startTime: input.startTime,
            endTime,
            tokenNumber,
            status: AppointmentStatus.BOOKED,
            priority: input.priority,
            reason: input.reason || null,
            idempotencyKey: idempotencyKey || null,
          },
          include: {
            patient: { include: { user: { select: { name: true, phone: true } } } },
            doctor: { include: { user: { select: { name: true } } } },
            hospital: { select: { name: true } },
          },
        });

        // Record Queue Event
        await tx.appointmentEvent.create({
          data: {
            appointmentId: appointment.id,
            eventType: QueueEventType.BOOKED,
            metadata: { tokenNumber, priority: input.priority },
          },
        });

        // Notify patient
        const patientUser = await tx.patientProfile.findUnique({
          where: { id: input.patientId },
          select: { userId: true },
        });

        if (patientUser) {
          await tx.notification.create({
            data: {
              userId: patientUser.userId,
              type: "APPOINTMENT",
              title: "Appointment Confirmed",
              message: `Your appointment with Dr. ${appointment.doctor.user.name} at ${appointment.hospital.name} is confirmed for ${input.appointmentDate} at ${input.startTime}. Token: A-${tokenNumber}.`,
            },
          });
        }

        return appointment;
      });

      return result;
    } catch (error: any) {
      if (error?.code === "P2002") {
        throw new Error("SLOT_UNAVAILABLE: The selected doctor slot is already booked.");
      }
      throw error;
    }
  }

  static async updateStatus(
    appointmentId: string,
    newStatus: AppointmentStatus,
    actorId?: string
  ) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new Error("APPOINTMENT_NOT_FOUND: Appointment record does not exist.");
    }

    let eventType: QueueEventType = QueueEventType.BOOKED;
    if (newStatus === AppointmentStatus.CHECKED_IN) eventType = QueueEventType.CHECKED_IN;
    else if (newStatus === AppointmentStatus.IN_CONSULTATION) eventType = QueueEventType.STARTED;
    else if (newStatus === AppointmentStatus.COMPLETED) eventType = QueueEventType.COMPLETED;
    else if (newStatus === AppointmentStatus.CANCELLED) eventType = QueueEventType.CANCELLED;

    const updated = await prisma.$transaction(async (tx) => {
      const appt = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: newStatus },
        include: {
          patient: { include: { user: { select: { name: true, phone: true } } } },
          doctor: { include: { user: { select: { name: true } } } },
          hospital: { select: { name: true } },
        },
      });

      await tx.appointmentEvent.create({
        data: {
          appointmentId,
          eventType,
          actorId: actorId || null,
        },
      });

      return appt;
    });

    return updated;
  }

  static async getHospitalQueue(hospitalId: string, dateStr?: string) {
    const targetDate = dateStr ? new Date(dateStr) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: {
        hospitalId,
        appointmentDate: { gte: startOfDay, lte: endOfDay },
        status: { notIn: [AppointmentStatus.CANCELLED] },
      },
      orderBy: [
        { priority: "desc" }, // EMERGENCY -> HIGH -> NORMAL
        { tokenNumber: "asc" },
      ],
      include: {
        patient: { include: { user: { select: { name: true, phone: true } } } },
        doctor: { include: { user: { select: { name: true } } } },
      },
    });

    return {
      hospitalId,
      date: dateStr || new Date().toISOString().split("T")[0],
      totalInQueue: appointments.length,
      waiting: appointments.filter((a) => a.status === "WAITING" || a.status === "BOOKED").length,
      inConsultation: appointments.filter((a) => a.status === "IN_CONSULTATION").length,
      completed: appointments.filter((a) => a.status === "COMPLETED").length,
      queue: appointments,
    };
  }
}
