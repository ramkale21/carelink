'use client';

import React, { useState, useEffect } from 'react';
import { ClinicalSidebar } from '../../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { RiskBadge } from '../../../components/ui/RiskBadge';
import { patientService } from '../../../services';
import { Patient } from '../../../types';
import { Users, Search } from 'lucide-react';

export default function HospitalPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    patientService.getPatients().then(setPatients);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="HOSPITAL_ADMIN" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="HOSPITAL_ADMIN" title="Facility Patient Directory" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-5xl">
            <h2 className="text-base font-bold text-slate-900">Hospital Admitted & Outpatient Registry</h2>

            <div className="space-y-3">
              {patients.map((pat) => (
                <Card key={pat.id}>
                  <CardContent className="p-4 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{pat.name}</h3>
                      <p className="text-slate-500">{pat.age}y, {pat.gender} • Village {pat.village}, {pat.district}</p>
                      <p className="text-slate-700 mt-1">History: {pat.medicalHistory?.join(', ') || 'None'}</p>
                    </div>
                    <RiskBadge level={pat.currentRisk || 'LOW'} size="sm" />
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
