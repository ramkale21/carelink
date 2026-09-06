'use client';

import React from 'react';
import { ClinicalSidebar } from '../../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent } from '../../../components/ui/Card';
import { Activity, CheckCircle2, Cpu, Database, Server } from 'lucide-react';

export default function AdminSystemHealthPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="SUPER_ADMIN" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="SUPER_ADMIN" title="Infrastructure & ML Service Status" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-4xl">
            <h2 className="text-base font-bold text-slate-900">System Telemetry & Microservices Health</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold">
                    <Server className="w-5 h-5" /> Next.js Frontend Server
                  </div>
                  <p className="text-slate-500">Latency: 12ms • Uptime: 99.98%</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold">
                    <Database className="w-5 h-5" /> PostgreSQL & Prisma
                  </div>
                  <p className="text-slate-500">Active Pool: 8/20 • Status: Healthy</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold">
                    <Cpu className="w-5 h-5" /> ML Risk Engine Service
                  </div>
                  <p className="text-slate-500">Inference Time: 45ms • Model v1.2</p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
