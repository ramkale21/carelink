'use client';

import React, { useState, useEffect } from 'react';
import { CommunityHeader } from '../../../components/layout/CommunityHeader';
import { CommunityBottomNav } from '../../../components/layout/CommunityBottomNav';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { RiskBadge } from '../../../components/ui/RiskBadge';
import { healthWorkerService } from '../../../services';
import { FollowUp } from '../../../types';
import { Clock, CheckCircle2 } from 'lucide-react';

export default function CommunityFollowUpsPage() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);

  useEffect(() => {
    healthWorkerService.getFollowUps().then(setFollowUps);
  }, []);

  const handleComplete = async (id: string) => {
    await healthWorkerService.markFollowUpComplete(id);
    setFollowUps(followUps.map((f) => (f.id === id ? { ...f, status: 'COMPLETED' } : f)));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      <DemoRoleSwitcher />
      <CommunityHeader title="Patient Follow-up Tasks" isWorker />

      <main className="flex-1 p-4 max-w-3xl mx-auto w-full space-y-6">
        <h2 className="text-base font-bold text-slate-900">Scheduled Patient Follow-ups</h2>

        <div className="space-y-3">
          {followUps.map((fol) => (
            <Card key={fol.id} className={fol.status === 'PENDING' ? 'border-amber-300' : ''}>
              <CardContent className="p-4 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{fol.patientName}</h3>
                    <RiskBadge level={fol.riskLevel || 'LOW'} size="sm" />
                  </div>
                  <p className="text-slate-600 mt-1">Reason: {fol.reason}</p>
                  <p className="text-slate-400 text-[10px]">Due Date: {fol.followUpDate}</p>
                </div>

                {fol.status === 'PENDING' ? (
                  <Button size="sm" variant="teal" onClick={() => handleComplete(fol.id)}>
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Complete
                  </Button>
                ) : (
                  <span className="text-emerald-700 font-bold">✓ Completed</span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <CommunityBottomNav isWorker />
    </div>
  );
}
