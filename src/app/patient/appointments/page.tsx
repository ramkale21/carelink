'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CommunityHeader } from '@/components/layout/CommunityHeader';
import { CommunityBottomNav } from '@/components/layout/CommunityBottomNav';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { appointmentService } from '@/services';
import { Appointment } from '@/types';
import { Calendar, Clock, Stethoscope, Building2, Plus, CheckCircle2 } from 'lucide-react';

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    appointmentService.getAppointmentsByPatient('pat-1').then(setAppointments);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      <DemoRoleSwitcher />
      <CommunityHeader title="My Medical Appointments" />

      <main className="flex-1 p-4 max-w-3xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Scheduled Appointments</h2>
          <Link href="/patient/appointments/book">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" /> Book New Slot
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {appointments.map((apt) => (
            <Card key={apt.id} className="border-slate-200">
              <CardHeader className="bg-slate-50/60 py-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <span>Date: {apt.appointmentDate} at {apt.startTime}</span>
                </div>
                <StatusBadge status={apt.status} />
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{apt.doctorName}</h3>
                    <p className="text-xs text-sky-700 font-medium">{apt.doctorSpecialization}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> {apt.hospitalName}
                    </p>
                  </div>
                  {apt.tokenNumber && (
                    <div className="text-center px-3 py-1.5 bg-sky-700 text-white rounded-lg shadow-xs">
                      <span className="text-[10px] block opacity-80 uppercase">OPD Token</span>
                      <span className="text-base font-extrabold">#{apt.tokenNumber}</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <strong>Reason for visit:</strong> {apt.reason}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <CommunityBottomNav />
    </div>
  );
}
