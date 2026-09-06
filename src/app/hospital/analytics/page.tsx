'use client';

import React from 'react';
import { ClinicalSidebar } from '../../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { BarChart3, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const ADMISSION_DATA = [
  { day: 'Mon', count: 18 },
  { day: 'Tue', count: 24 },
  { day: 'Wed', count: 22 },
  { day: 'Thu', count: 30 },
  { day: 'Fri', count: 25 },
  { day: 'Sat', count: 14 },
];

export default function HospitalAnalyticsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="HOSPITAL_ADMIN" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="HOSPITAL_ADMIN" title="Facility Analytics & Utilization" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-4xl">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-sky-600" /> Daily Patient Admissions Trend
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ADMISSION_DATA}>
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
