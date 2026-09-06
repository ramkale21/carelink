'use client';

import React, { useState, useEffect } from 'react';
import { CommunityHeader } from '../../../components/layout/CommunityHeader';
import { CommunityBottomNav } from '../../../components/layout/CommunityBottomNav';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { referralService } from '../../../services';
import { Referral } from '../../../types';
import { Share2 } from 'lucide-react';

export default function CommunityReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);

  useEffect(() => {
    referralService.getReferralsByPatient('pat-2').then(setReferrals);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      <DemoRoleSwitcher />
      <CommunityHeader title="Community Referral Gateway" isWorker />

      <main className="flex-1 p-4 max-w-3xl mx-auto w-full space-y-6">
        <h2 className="text-base font-bold text-slate-900">Village-to-Facility Referrals</h2>

        <div className="space-y-3">
          {referrals.map((ref) => (
            <Card key={ref.id}>
              <CardContent className="p-4 flex items-center justify-between text-xs">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{ref.patientName}</h3>
                  <p className="text-slate-500">From: {ref.fromHospitalName} → To: {ref.toHospitalName}</p>
                  <p className="text-slate-700 bg-slate-50 p-2 rounded mt-1">Reason: {ref.reason}</p>
                </div>
                <StatusBadge status={ref.status} />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <CommunityBottomNav isWorker />
    </div>
  );
}
