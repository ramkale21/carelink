'use client';

import React from 'react';
import { ClinicalSidebar } from '../../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

const VOLUME_DATA = [
  { day: 'Mon', patients: 32 },
  { day: 'Tue', patients: 45 },
  { day: 'Wed', patients: 38 },
  { day: 'Thu', patients: 52 },
  { day: 'Fri', patients: 40 },
  { day: 'Sat', patients: 28 },
];

const DIAGNOSIS_SPLIT = [
  { name: 'Respiratory', value: 45, color: '#0284c7' },
  { name: 'Hypertension', value: 25, color: '#0d9488' },
  { name: 'Diabetes', value: 18, color: '#d97706' },
  { name: 'Gastroenteritis', value: 12, color: '#dc2626' },
];

export default function DoctorAnalyticsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="DOCTOR" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="DOCTOR" title="Clinical Trends & Analytics" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Volume Bar Chart */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-sky-600" /> Weekly OPD Patient Volume
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={VOLUME_DATA}>
                      <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="patients" fill="#0284c7" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Diagnosis Distribution Pie Chart */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-600" /> Top Diagnostic Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 h-64 flex flex-col items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={DIAGNOSIS_SPLIT} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                        {DIAGNOSIS_SPLIT.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
