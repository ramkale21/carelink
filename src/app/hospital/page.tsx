'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClinicalSidebar } from '../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../components/layout/DemoRoleSwitcher';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { hospitalService } from '../../services';
import { BedCategory } from '../../types';
import { BedDouble, Users, AlertTriangle, Activity, Share2, Calendar } from 'lucide-react';

export default function HospitalDashboardPage() {
  const [beds, setBeds] = useState<BedCategory[]>([]);

  useEffect(() => {
    hospitalService.getBedCapacities('hosp-1').then(setBeds);
  }, []);

  const totalBedsCount = beds.reduce((acc, b) => acc + b.total, 0);
  const totalAvailableBeds = beds.reduce((acc, b) => acc + b.available, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="HOSPITAL_ADMIN" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="HOSPITAL_ADMIN" title="Hospital Executive Dashboard — PHC Khed" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Facility KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Available Free Beds</span>
                    <span className="text-2xl font-extrabold text-emerald-600">{totalAvailableBeds} / {totalBedsCount}</span>
                  </div>
                  <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                    <BedDouble className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">OPD Patients Today</span>
                    <span className="text-2xl font-extrabold text-sky-900">128 OPD</span>
                  </div>
                  <div className="p-3 bg-sky-100 text-sky-700 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Doctors On Duty</span>
                    <span className="text-2xl font-extrabold text-slate-900">6 Physicians</span>
                  </div>
                  <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl">
                    <Activity className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Pending Referrals</span>
                    <span className="text-2xl font-extrabold text-amber-600">4 Intake</span>
                  </div>
                  <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
                    <Share2 className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bed Occupancy Matrix Overview */}
            <Card>
              <CardHeader className="py-3 flex justify-between items-center">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <BedDouble className="w-4 h-4 text-sky-600" /> Real-Time Bed Occupancy Summary
                </CardTitle>
                <Link href="/hospital/beds">
                  <Button variant="outline" size="sm">Manage Bed Matrix</Button>
                </Link>
              </CardHeader>

              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {beds.map((b) => (
                    <div key={b.category} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="text-xs font-bold text-slate-900 block">{b.category} Ward</span>
                      <div className="text-xs text-slate-600">
                        Available: <strong className="text-emerald-700">{b.available}</strong>
                      </div>
                      <div className="text-xs text-slate-500">Total: {b.total}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
