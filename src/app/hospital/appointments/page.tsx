'use client';

import React, { useState, useEffect } from 'react';
import { ClinicalSidebar } from '../../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { appointmentService } from '../../../services';
import { Appointment } from '../../../types';
import { Calendar } from 'lucide-react';

export default function HospitalAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    appointmentService.getAppointmentsByHospital('hosp-1').then(setAppointments);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="HOSPITAL_ADMIN" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="HOSPITAL_ADMIN" title="Facility Appointments Schedule" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-4xl">
            <h2 className="text-base font-bold text-slate-900">Facility-Wide OPD Appointments</h2>

            <div className="space-y-3">
              {appointments.map((apt) => (
                <Card key={apt.id}>
                  <CardContent className="p-4 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{apt.patientName}</h3>
                      <p className="text-slate-500">Doctor: {apt.doctorName} ({apt.doctorSpecialization})</p>
                      <p className="text-slate-600 mt-0.5">Date: {apt.appointmentDate} at {apt.startTime} (Token #{apt.tokenNumber})</p>
                    </div>
                    <StatusBadge status={apt.status} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
