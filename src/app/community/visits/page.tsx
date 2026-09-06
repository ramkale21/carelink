'use client';

import React from 'react';
import { CommunityHeader } from '../../../components/layout/CommunityHeader';
import { CommunityBottomNav } from '../../../components/layout/CommunityBottomNav';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Home, Calendar, CheckCircle2 } from 'lucide-react';

const VISITS = [
  { id: '1', family: 'More Family (House #14)', village: 'Anandpur', purpose: 'Antenatal Checkup & Iron Supplementation', status: 'DUE_TODAY' },
  { id: '2', family: 'Patil Family (House #42)', village: 'Khed', purpose: 'Post-OPD Respiratory Follow-up', status: 'SCHEDULED' },
  { id: '3', family: 'Shinde Family (Wadi No 3)', village: 'Manchar', purpose: 'NCD Diabetes Glucose Check', status: 'COMPLETED' },
];

export default function HouseholdVisitsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      <DemoRoleSwitcher />
      <CommunityHeader title="Household Visit Planner" isWorker />

      <main className="flex-1 p-4 max-w-3xl mx-auto w-full space-y-6">
        <h2 className="text-base font-bold text-slate-900">Today's Village Household Visits</h2>

        <div className="space-y-3">
          {VISITS.map((v) => (
            <Card key={v.id}>
              <CardContent className="p-4 flex items-center justify-between text-xs">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Home className="w-4 h-4 text-teal-600" /> {v.family}
                  </h3>
                  <p className="text-slate-500">Village: {v.village} • Purpose: {v.purpose}</p>
                </div>
                <Button size="sm" variant="outline">Log Visit</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <CommunityBottomNav isWorker />
    </div>
  );
}
