'use client';

import React from 'react';
import { ClinicalSidebar } from '../../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent } from '../../../components/ui/Card';
import { RiskBadge } from '../../../components/ui/RiskBadge';
import { AlertTriangle, PhoneCall, BedDouble } from 'lucide-react';

export default function HospitalEmergencyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="HOSPITAL_ADMIN" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="HOSPITAL_ADMIN" title="Emergency & Trauma Triage Center" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-4xl">
            <div className="p-4 bg-red-600 text-white rounded-xl shadow-md flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Emergency Triage Status: ACTIVE
                </h2>
                <p className="text-xs text-red-100">8 Emergency Trauma Beds Available • 108 Ambulance Dispatch Online</p>
              </div>
              <span className="px-3 py-1 bg-white text-red-700 font-extrabold text-xs rounded-lg">
                108 SOS ACTIVE
              </span>
            </div>

            <Card>
              <CardContent className="p-4 space-y-3 text-xs">
                <h3 className="font-bold text-slate-900 text-sm">Active Critical / Emergency Patients</h3>
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Mahesh Jadhav (25y, Male)</h4>
                    <p className="text-red-700 font-semibold">Diagnosis: Sudden arrhythmia & syncope</p>
                    <p className="text-slate-500">Admitted to Emergency Bay #2</p>
                  </div>
                  <RiskBadge level="CRITICAL" size="md" />
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
