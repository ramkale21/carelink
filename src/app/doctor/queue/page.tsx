'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClinicalSidebar } from '@/components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '@/components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { appointmentService } from '@/services';
import { QueueEntry } from '@/types';
import { Clock, Stethoscope, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export default function DoctorQueuePage() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);

  useEffect(() => {
    appointmentService.getDoctorQueue('doc-1', '2026-09-06').then(setQueue);
  }, []);

  const handleStatusChange = async (aptId: string, status: QueueEntry['status']) => {
    await appointmentService.updateAppointmentStatus(aptId, status);
    setQueue(queue.map((q) => (q.appointmentId === aptId ? { ...q, status } : q)));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="DOCTOR" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="DOCTOR" title="Live OPD Patient Queue" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Today's OPD Queue — PHC Khed</h2>
                <p className="text-xs text-slate-500">Prioritized by clinical risk triage level & check-in order.</p>
              </div>
              <span className="px-3 py-1 bg-sky-100 text-sky-800 font-bold text-xs rounded-full">
                Total Patients: {queue.length}
              </span>
            </div>

            <div className="space-y-3">
              {queue.map((q) => (
                <Card
                  key={q.appointmentId}
                  className={`transition-all ${
                    q.priority === 'EMERGENCY' ? 'border-red-300 bg-red-50/20' : 'border-slate-200'
                  }`}
                >
                  <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="w-12 h-12 rounded-xl bg-sky-700 text-white flex items-center justify-center font-extrabold text-base shadow-xs shrink-0">
                        #{q.tokenNumber}
                      </span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">{q.patientName}</h3>
                          <span className="text-xs text-slate-500">({q.age}y, {q.gender})</span>
                          <RiskBadge level={q.riskLevel} size="sm" />
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-2">
                          <span>Slot Time: {q.appointmentTime}</span>
                          <span>•</span>
                          <span>Est Wait: {q.waitTimeMinutes} mins</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <StatusBadge status={q.status} />

                      {q.status === 'BOOKED' && (
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(q.appointmentId, 'CHECKED_IN')}>
                          Check In
                        </Button>
                      )}

                      {q.status !== 'COMPLETED' && (
                        <Link href={`/doctor/consultation?patientId=${q.patientId}&aptId=${q.appointmentId}`}>
                          <Button size="sm">
                            <Stethoscope className="w-4 h-4 mr-1" /> Open Consultation
                          </Button>
                        </Link>
                      )}
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
