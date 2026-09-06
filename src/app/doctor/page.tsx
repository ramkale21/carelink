'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClinicalSidebar } from '@/components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '@/components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { appointmentService, referralService } from '@/services';
import { QueueEntry, Referral } from '@/types';
import {
  Users,
  Clock,
  Activity,
  AlertTriangle,
  Stethoscope,
  Share2,
  FileText,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function DoctorDashboardPage() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);

  useEffect(() => {
    appointmentService.getDoctorQueue('doc-1', '2026-09-06').then(setQueue);
    referralService.getReferralsByHospital('hosp-1', 'incoming').then(setReferrals);
  }, []);

  const emergencyCount = queue.filter((q) => q.priority === 'EMERGENCY').length;
  const waitingCount = queue.filter((q) => q.status === 'WAITING' || q.status === 'CHECKED_IN').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="DOCTOR" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="DOCTOR" title="Physician Clinical Dashboard" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Today's OPD Queue</span>
                    <span className="text-2xl font-extrabold text-slate-900">{queue.length} Patients</span>
                  </div>
                  <div className="p-3 bg-sky-100 text-sky-700 rounded-xl">
                    <Clock className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Emergency Cases</span>
                    <span className="text-2xl font-extrabold text-red-600">{emergencyCount} Cases</span>
                  </div>
                  <div className="p-3 bg-red-100 text-red-700 rounded-xl">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Waiting Patients</span>
                    <span className="text-2xl font-extrabold text-amber-600">{waitingCount} Waiting</span>
                  </div>
                  <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Incoming Referrals</span>
                    <span className="text-2xl font-extrabold text-teal-700">{referrals.length} Pending</span>
                  </div>
                  <div className="p-3 bg-teal-100 text-teal-700 rounded-xl">
                    <Share2 className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Queue & Action Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Queue List */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader className="py-3 flex justify-between items-center">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Clock className="w-4 h-4 text-sky-600" /> Live Patient Queue (PHC Khed OPD)
                    </CardTitle>
                    <Link href="/doctor/queue">
                      <Button variant="outline" size="sm">Manage Full Queue</Button>
                    </Link>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100 text-xs">
                      {queue.map((q) => (
                        <div key={q.appointmentId} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-sky-700 text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
                              #{q.tokenNumber}
                            </span>
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">{q.patientName} ({q.age}y, {q.gender})</h4>
                              <p className="text-slate-500 text-[11px]">Time: {q.appointmentTime} | Est Wait: {q.waitTimeMinutes}m</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <RiskBadge level={q.riskLevel} size="sm" />
                            <StatusBadge status={q.status} />
                            <Link href={`/doctor/consultation?patientId=${q.patientId}&aptId=${q.appointmentId}`}>
                              <Button size="sm">
                                <Stethoscope className="w-3.5 h-3.5 mr-1" /> Examine
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Clinical Tools */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-bold">Quick Clinical Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    <Link href="/doctor/consultation" className="block">
                      <Button variant="teal" size="sm" className="w-full justify-start">
                        <Stethoscope className="w-4 h-4 mr-2" /> Start New Consultation
                      </Button>
                    </Link>
                    <Link href="/doctor/prescriptions" className="block">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" /> Issue E-Prescription
                      </Button>
                    </Link>
                    <Link href="/doctor/referrals" className="block">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Share2 className="w-4 h-4 mr-2" /> Dispatch Hospital Referral
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Priority Emergency Case Callout */}
                {emergencyCount > 0 && (
                  <div className="p-4 bg-red-600 text-white rounded-xl shadow-md space-y-2 animate-pulse-glow">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      <h4 className="font-bold text-sm">Emergency Case Alert!</h4>
                    </div>
                    <p className="text-xs text-red-100">
                      Mahesh Jadhav (Token #1) flagged as CRITICAL risk with chest discomfort. Immediate review needed.
                    </p>
                    <Link href="/doctor/consultation?patientId=pat-4">
                      <Button size="sm" className="w-full bg-white text-red-700 hover:bg-red-50 font-bold mt-1">
                        Open Emergency File →
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
