'use client';

import React, { useState, useEffect } from 'react';
import { ClinicalSidebar } from '../../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { doctorService } from '../../../services';
import { Doctor } from '../../../types';
import { Stethoscope, CheckCircle2 } from 'lucide-react';

export default function HospitalDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    doctorService.getDoctors().then(setDoctors);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="HOSPITAL_ADMIN" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="HOSPITAL_ADMIN" title="Doctors & Staff Duty Roster" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-4xl">
            <h2 className="text-base font-bold text-slate-900">Physicians On Duty Roster</h2>

            <div className="space-y-3">
              {doctors.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-4 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{doc.name}</h3>
                      <p className="text-sky-700 font-semibold">{doc.specialization} ({doc.qualification})</p>
                      <p className="text-slate-500">Reg: {doc.registrationNumber} • Facility: {doc.hospitalName}</p>
                    </div>
                    <StatusBadge status={doc.isAvailable ? 'AVAILABLE' : 'OFF_DUTY'} variant={doc.isAvailable ? 'green' : 'gray'} />
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
