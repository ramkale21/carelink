'use client';

import React from 'react';
import Link from 'next/link';
import { ClinicalSidebar } from '../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../components/layout/DemoRoleSwitcher';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ShieldCheck, Users, Building2, Activity, Cpu } from 'lucide-react';

export default function SuperAdminDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="SUPER_ADMIN" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="SUPER_ADMIN" title="CareLink Platform Governance & Administration" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-5xl">
            {/* KPI Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Platform Users</span>
                    <span className="text-2xl font-extrabold text-slate-900">4,820 Users</span>
                  </div>
                  <div className="p-3 bg-sky-100 text-sky-700 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Registered Facilities</span>
                    <span className="text-2xl font-extrabold text-teal-700">142 PHC/CHCs</span>
                  </div>
                  <div className="p-3 bg-teal-100 text-teal-700 rounded-xl">
                    <Building2 className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">AI Audit Predictions</span>
                    <span className="text-2xl font-extrabold text-purple-700">12,450 Runs</span>
                  </div>
                  <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">
                    <Cpu className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">System Health</span>
                    <span className="text-2xl font-extrabold text-emerald-600">100% Operational</span>
                  </div>
                  <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                    <Activity className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-600" /> Platform Governance Quick Access
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <Link href="/admin/users" className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-sky-500 transition-all">
                  <h4 className="font-bold text-slate-900 text-sm mb-1">User Directory Management</h4>
                  <p className="text-slate-500">Manage accounts across Patients, Doctors, Pharmacists, ASHA, ANM, CHO, and Admins.</p>
                </Link>

                <Link href="/admin/audit-logs" className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-sky-500 transition-all">
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Immutable Audit Log Inspector</h4>
                  <p className="text-slate-500">Inspect security access logs, patient data queries, and ML prediction hash audits.</p>
                </Link>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
