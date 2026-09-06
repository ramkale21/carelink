'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CommunityHeader } from '../../../components/layout/CommunityHeader';
import { CommunityBottomNav } from '../../../components/layout/CommunityBottomNav';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { RiskBadge } from '../../../components/ui/RiskBadge';
import { patientService } from '../../../services';
import { Patient } from '../../../types';
import { Users, Plus, ClipboardCheck } from 'lucide-react';

export default function CommunityPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    patientService.getPatients().then(setPatients);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      <DemoRoleSwitcher />
      <CommunityHeader title="Village Patients List" isWorker />

      <main className="flex-1 p-4 max-w-3xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Assigned Household Residents</h2>
          <Link href="/community/patients/register">
            <Button size="sm" variant="teal">
              <Plus className="w-4 h-4 mr-1" /> New Resident
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {patients.map((pat) => (
            <Card key={pat.id}>
              <CardContent className="p-4 flex items-center justify-between gap-4 text-xs">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{pat.name}</h3>
                  <p className="text-slate-500">{pat.age}y, {pat.gender} • Village {pat.village}</p>
                  <p className="text-slate-600 mt-0.5">Phone: {pat.phone}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <RiskBadge level={pat.currentRisk || 'LOW'} size="sm" />
                  <Link href={`/community/screening?patientId=${pat.id}`}>
                    <Button size="sm" variant="outline">
                      <ClipboardCheck className="w-3.5 h-3.5 mr-1" /> Field Screen
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <CommunityBottomNav isWorker />
    </div>
  );
}
