'use client';

import React, { useState, useEffect } from 'react';
import { ClinicalSidebar } from '../../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { referralService } from '../../../services';
import { Referral } from '../../../types';
import { Share2 } from 'lucide-react';

export default function HospitalReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);

  useEffect(() => {
    referralService.getReferralsByHospital('hosp-1', 'incoming').then(setReferrals);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="HOSPITAL_ADMIN" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="HOSPITAL_ADMIN" title="Regional Inter-Facility Referral Hub" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-4xl">
            <h2 className="text-base font-bold text-slate-900">Regional Referral Transfer Intake</h2>

            <div className="space-y-3">
              {referrals.map((ref) => (
                <Card key={ref.id}>
                  <CardContent className="p-4 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{ref.patientName}</h4>
                      <p className="text-slate-500">From: {ref.fromHospitalName} → To: {ref.toHospitalName}</p>
                      <p className="text-slate-700 bg-slate-50 p-2 rounded mt-1">Reason: {ref.reason}</p>
                    </div>
                    <StatusBadge status={ref.status} />
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
