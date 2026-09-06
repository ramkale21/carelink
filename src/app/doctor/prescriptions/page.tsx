'use client';

import React, { useState, useEffect } from 'react';
import { ClinicalSidebar } from '../../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { prescriptionService } from '../../../services';
import { Prescription } from '../../../types';
import { Pill, Calendar, User } from 'lucide-react';

export default function DoctorPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  useEffect(() => {
    prescriptionService.getPrescriptionsByPatient('pat-1').then(setPrescriptions);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="DOCTOR" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="DOCTOR" title="Issued E-Prescriptions Log" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-4xl">
            <h2 className="text-base font-bold text-slate-900">Recent Issued Prescriptions</h2>

            <div className="space-y-4">
              {prescriptions.map((rx) => (
                <Card key={rx.id}>
                  <CardHeader className="py-3 bg-slate-50 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-500" />
                      <span className="font-bold text-slate-900">{rx.patientName}</span>
                    </div>
                    <span className="text-slate-500">{new Date(rx.createdAt).toLocaleDateString()}</span>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2 text-xs">
                    <span className="font-semibold text-purple-700 uppercase tracking-wider block">Prescribed Medication List:</span>
                    {rx.medicines.map((m) => (
                      <div key={m.id} className="flex justify-between items-center bg-purple-50/50 p-2.5 rounded-lg border border-purple-100">
                        <span className="font-bold text-slate-900">{m.medicineName} ({m.dosage})</span>
                        <span className="text-purple-800 font-mono">{m.frequency} • {m.duration}</span>
                      </div>
                    ))}
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
