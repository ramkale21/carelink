'use client';

import React, { useState, useEffect } from 'react';
import { CommunityHeader } from '@/components/layout/CommunityHeader';
import { CommunityBottomNav } from '@/components/layout/CommunityBottomNav';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { prescriptionService } from '@/services';
import { Prescription } from '@/types';
import { Pill, Calendar, Clock, CheckCircle2 } from 'lucide-react';

export default function PatientPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  useEffect(() => {
    prescriptionService.getPrescriptionsByPatient('pat-1').then(setPrescriptions);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      <DemoRoleSwitcher />
      <CommunityHeader title="My Prescriptions & Medicines" />

      <main className="flex-1 p-4 max-w-3xl mx-auto w-full space-y-6">
        <h2 className="text-base font-bold text-slate-900">Active Prescriptions</h2>

        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <Card key={rx.id} className="border-slate-200">
              <CardHeader className="bg-slate-50/60 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span>Prescribed on {new Date(rx.createdAt).toLocaleDateString()}</span>
                </div>
                <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-xs font-bold rounded border border-purple-200">
                  By {rx.doctorName}
                </span>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Prescribed Medicines:</span>
                  <div className="space-y-2">
                    {rx.medicines.map((med) => (
                      <div key={med.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                            <Pill className="w-4 h-4 text-purple-600" /> {med.medicineName}
                          </h4>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded">
                            {med.duration}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                          <span>Dosage: {med.dosage}</span>
                          <span className="font-semibold text-purple-700">Frequency: {med.frequency}</span>
                        </div>
                        {med.instructions && (
                          <p className="text-[11px] text-slate-500 pt-1">Instructions: {med.instructions}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {rx.instructions && (
                  <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100">
                    <strong>Doctor Instructions:</strong> {rx.instructions}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <CommunityBottomNav />
    </div>
  );
}
