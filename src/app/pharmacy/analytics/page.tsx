'use client';

import React from 'react';
import { ClinicalSidebar } from '../../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const DISPENSE_DATA = [
  { med: 'Paracetamol', qty: 240 },
  { med: 'Amoxicillin', qty: 120 },
  { med: 'Amlodipine', qty: 180 },
  { med: 'ORS Pouches', qty: 95 },
];

export default function PharmacyAnalyticsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="PHARMACIST" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="PHARMACIST" title="Dispensing Analytics" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-4xl">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-600" /> Fast-Moving Essential Medicines
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DISPENSE_DATA}>
                    <XAxis dataKey="med" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="qty" fill="#9333ea" radius={[4, 4, 0, 0]} />
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
