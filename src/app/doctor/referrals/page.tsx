'use client';

import React, { useState, useEffect } from 'react';
import { ClinicalSidebar } from '../../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { referralService } from '../../../services';
import { Referral } from '../../../types';
import { Share2, CheckCircle2, XCircle } from 'lucide-react';

export default function DoctorReferralsPage() {
  const [incoming, setIncoming] = useState<Referral[]>([]);
  const [outgoing, setOutgoing] = useState<Referral[]>([]);

  useEffect(() => {
    referralService.getReferralsByHospital('hosp-1', 'incoming').then(setIncoming);
    referralService.getReferralsByHospital('hosp-1', 'outgoing').then(setOutgoing);
  }, []);

  const handleUpdate = async (id: string, status: Referral['status']) => {
    await referralService.updateReferralStatus(id, status);
    setIncoming(incoming.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="DOCTOR" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="DOCTOR" title="Inter-Facility Referrals Dispatch" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-4xl">
            {/* Incoming Referrals */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Incoming Referrals To Facility</h3>
              {incoming.map((ref) => (
                <Card key={ref.id}>
                  <CardContent className="p-4 flex items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{ref.patientName}</span>
                        <StatusBadge status={ref.status} />
                      </div>
                      <p className="text-slate-500">From: {ref.fromHospitalName}</p>
                      <p className="text-slate-700 bg-slate-50 p-2 rounded">Reason: {ref.reason}</p>
                    </div>

                    {ref.status === 'CREATED' && (
                      <div className="flex gap-2 shrink-0">
                        <Button size="sm" onClick={() => handleUpdate(ref.id, 'ACCEPTED')}>
                          Accept Referral
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Outgoing Referrals */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Outgoing Transfer Referrals</h3>
              {outgoing.map((ref) => (
                <Card key={ref.id}>
                  <CardContent className="p-4 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900">{ref.patientName}</h4>
                      <p className="text-slate-500">Destination: {ref.toHospitalName}</p>
                      <p className="text-slate-700 mt-1">Reason: {ref.reason}</p>
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
