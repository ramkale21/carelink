'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CommunityHeader } from '@/components/layout/CommunityHeader';
import { CommunityBottomNav } from '@/components/layout/CommunityBottomNav';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { healthWorkerService } from '@/services';
import { FollowUp, WorkerType } from '@/types';
import {
  HeartPulse,
  Users,
  ClipboardCheck,
  Calendar,
  AlertTriangle,
  Plus,
  ArrowRight,
  CheckCircle2,
  Share2,
} from 'lucide-react';

function CommunityWorkerDashboardContent() {
  const searchParams = useSearchParams();
  const activeRole = (searchParams.get('role') as WorkerType) || 'ASHA';

  const [followUps, setFollowUps] = useState<FollowUp[]>([]);

  useEffect(() => {
    healthWorkerService.getFollowUps().then(setFollowUps);
  }, []);

  const pendingFollowUps = followUps.filter((f) => f.status === 'PENDING');

  const handleCompleteFollowUp = async (id: string) => {
    await healthWorkerService.markFollowUpComplete(id);
    setFollowUps(followUps.map((f) => (f.id === id ? { ...f, status: 'COMPLETED' } : f)));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      <DemoRoleSwitcher />
      <CommunityHeader title={`${activeRole} Field Dashboard`} isWorker />

      <main className="flex-1 p-4 max-w-4xl mx-auto w-full space-y-6">
        {/* Worker Profile Header Banner */}
        <Card className="bg-gradient-to-r from-teal-900 to-slate-900 text-white">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                COMMUNITY HEALTHWORKER PROFILE
              </span>
              <h2 className="text-xl font-extrabold text-white">
                {activeRole === 'ASHA' ? 'ASHA Sangeeta Gaikwad' : activeRole === 'ANM' ? 'ANM Anita Kulkarni' : 'CHO Dr. Nilesh Patil'}
              </h2>
              <p className="text-xs text-slate-300">Sub-Center Anandpur • Khed Block • Pune District</p>
            </div>
            <Link href="/community/patients/register">
              <Button variant="teal" size="sm">
                <Plus className="w-4 h-4 mr-1" /> Register Patient
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Role Specific Action Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/community/patients/register">
            <div className="p-4 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:shadow-md transition-all text-center space-y-2 cursor-pointer">
              <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center mx-auto">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">Register Patient</h4>
              <p className="text-[10px] text-slate-500">Household survey form</p>
            </div>
          </Link>

          <Link href="/community/screening">
            <div className="p-4 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:shadow-md transition-all text-center space-y-2 cursor-pointer">
              <div className="w-10 h-10 bg-sky-100 text-sky-700 rounded-xl flex items-center justify-center mx-auto">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">Health Screening</h4>
              <p className="text-[10px] text-slate-500">Record field vitals & risk</p>
            </div>
          </Link>

          <Link href="/community/follow-ups">
            <div className="p-4 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:shadow-md transition-all text-center space-y-2 cursor-pointer">
              <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mx-auto">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">Follow-up Tasks</h4>
              <p className="text-[10px] text-slate-500">{pendingFollowUps.length} Pending</p>
            </div>
          </Link>

          <Link href="/community/referrals">
            <div className="p-4 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:shadow-md transition-all text-center space-y-2 cursor-pointer">
              <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center mx-auto">
                <Share2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">Community Referrals</h4>
              <p className="text-[10px] text-slate-500">Escalate to PHC / CHC</p>
            </div>
          </Link>
        </div>

        {/* Priority Overdue Follow-up Tasks */}
        <Card className="border-amber-300">
          <CardHeader className="py-3 bg-amber-50/50 flex justify-between items-center">
            <CardTitle className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Pending Village Patient Follow-ups
            </CardTitle>
            <Link href="/community/follow-ups" className="text-xs font-bold text-amber-700 hover:underline">
              View All →
            </Link>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {pendingFollowUps.map((fol) => (
              <div key={fol.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{fol.patientName}</h4>
                    <RiskBadge level={fol.riskLevel || 'LOW'} size="sm" />
                  </div>
                  <p className="text-slate-600">Reason: {fol.reason}</p>
                  <p className="text-slate-400 text-[10px]">Due Date: {fol.followUpDate} {fol.notes && `(${fol.notes})`}</p>
                </div>

                <Button size="sm" variant="teal" onClick={() => handleCompleteFollowUp(fol.id)}>
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Complete
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>

      <CommunityBottomNav isWorker />
    </div>
  );
}

export default function CommunityWorkerDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading community dashboard...</div>}>
      <CommunityWorkerDashboardContent />
    </Suspense>
  );
}

