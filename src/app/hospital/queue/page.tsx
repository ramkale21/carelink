'use client';

import React, { useState, useEffect } from 'react';
import { ClinicalSidebar } from '../../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent } from '../../../components/ui/Card';
import { RiskBadge } from '../../../components/ui/RiskBadge';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { appointmentService } from '../../../services';
import { QueueEntry } from '../../../types';
import { Clock } from 'lucide-react';

export default function HospitalQueuePage() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);

  useEffect(() => {
    appointmentService.getDoctorQueue('doc-1', '2026-09-06').then(setQueue);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="HOSPITAL_ADMIN" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="HOSPITAL_ADMIN" title="Central Departmental Token Queue" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-4xl">
            <h2 className="text-base font-bold text-slate-900">OPD Central Queue Monitor</h2>

            <div className="space-y-3">
              {queue.map((q) => (
                <Card key={q.appointmentId}>
                  <CardContent className="p-4 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-sky-700 text-white flex items-center justify-center font-extrabold text-sm">
                        #{q.tokenNumber}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{q.patientName}</h4>
                        <p className="text-slate-500">Time: {q.appointmentTime} | Wait: {q.waitTimeMinutes}m</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <RiskBadge level={q.riskLevel} size="sm" />
                      <StatusBadge status={q.status} />
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
