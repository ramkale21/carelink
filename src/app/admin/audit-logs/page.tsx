'use client';

import React from 'react';
import { ClinicalSidebar } from '../../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent } from '../../../components/ui/Card';
import { ShieldCheck } from 'lucide-react';

const AUDIT_LOGS = [
  { id: 'a1', user: 'Dr. Anand Deshmukh', action: 'APPOINTMENT_CONSULTATION_COMPLETE', entity: 'Appointment #apt-101', ip: '10.20.4.12', time: '2026-09-06 10:45:12' },
  { id: 'a2', user: 'ASHA Sangeeta Gaikwad', action: 'PATIENT_FIELD_SCREENING', entity: 'HealthAssessment #ha-1', ip: '192.168.1.45', time: '2026-09-06 09:12:00' },
  { id: 'a3', user: 'Ravi Patil', action: 'SYMPTOM_ASSESSMENT_RUN', entity: 'MLPrediction #ml-4401', ip: '106.210.4.88', time: '2026-09-06 08:30:22' },
];

export default function AdminAuditLogsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="SUPER_ADMIN" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="SUPER_ADMIN" title="Immutable System Audit Logs" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-4xl">
            <h2 className="text-base font-bold text-slate-900">Security & Clinical Transaction Audit Trail</h2>

            <div className="space-y-3">
              {AUDIT_LOGS.map((log) => (
                <Card key={log.id}>
                  <CardContent className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sky-700">{log.action}</span>
                        <span className="text-slate-500">• {log.user}</span>
                      </div>
                      <p className="text-slate-600 mt-1">{log.entity}</p>
                    </div>
                    <div className="text-right text-[11px] text-slate-400 font-mono">
                      <span>IP: {log.ip}</span>
                      <span className="block">{log.time}</span>
                    </div>
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
