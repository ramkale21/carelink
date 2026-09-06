'use client';

import React, { useState, useEffect } from 'react';
import { CommunityHeader } from '@/components/layout/CommunityHeader';
import { CommunityBottomNav } from '@/components/layout/CommunityBottomNav';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { referralService } from '@/services';
import { Referral } from '@/types';
import { Share2, Building2, CheckCircle2, ArrowRight } from 'lucide-react';

const REFERRAL_STAGES = ['Created', 'Under Review', 'Accepted', 'Scheduled', 'Completed'];

export default function PatientReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);

  useEffect(() => {
    referralService.getReferralsByPatient('pat-1').then(setReferrals);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      <DemoRoleSwitcher />
      <CommunityHeader title="Inter-Facility Referral Tracker" />

      <main className="flex-1 p-4 max-w-3xl mx-auto w-full space-y-6">
        <h2 className="text-base font-bold text-slate-900">My Active Referrals</h2>

        <div className="space-y-6">
          {referrals.map((ref) => {
            const currentStageIdx = REFERRAL_STAGES.indexOf(ref.currentStage);

            return (
              <Card key={ref.id} className="border-slate-200">
                <CardHeader className="bg-slate-50/60 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-xs text-slate-900">Referral #{ref.id}</span>
                  </div>
                  <StatusBadge status={ref.status} />
                </CardHeader>

                <CardContent className="p-5 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Originating Facility</span>
                      <h4 className="font-bold text-slate-900">{ref.fromHospitalName}</h4>
                    </div>

                    <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl space-y-1">
                      <span className="text-[10px] text-sky-700 uppercase font-bold">Referred Destination</span>
                      <h4 className="font-bold text-sky-900">{ref.toHospitalName}</h4>
                      {ref.doctorName && <p className="text-[11px] text-sky-800">Doctor: {ref.doctorName}</p>}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                    <span className="font-semibold text-slate-700 block">Referral Clinical Reason:</span>
                    <p className="text-slate-800">{ref.reason}</p>
                  </div>

                  {/* Step-by-Step Visual Referral Journey Bar */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Visual Care Journey:</span>
                    <div className="grid grid-cols-5 gap-1 text-center">
                      {REFERRAL_STAGES.map((stage, idx) => {
                        const isDone = idx <= currentStageIdx;
                        return (
                          <div key={stage} className="space-y-1">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                isDone ? 'bg-sky-600' : 'bg-slate-200'
                              }`}
                            />
                            <span className={`text-[10px] block font-semibold ${isDone ? 'text-sky-900' : 'text-slate-400'}`}>
                              {stage}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      <CommunityBottomNav />
    </div>
  );
}
