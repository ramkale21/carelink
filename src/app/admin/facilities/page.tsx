'use client';

import React, { useState, useEffect } from 'react';
import { ClinicalSidebar } from '../../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { hospitalService } from '../../../services';
import { Hospital } from '../../../types';
import { Building2 } from 'lucide-react';

export default function AdminFacilitiesPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  useEffect(() => {
    hospitalService.getHospitals().then(setHospitals);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="SUPER_ADMIN" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="SUPER_ADMIN" title="Healthcare Facilities Governance" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-4xl">
            <h2 className="text-base font-bold text-slate-900">Registered Public & Private Healthcare Facilities</h2>

            <div className="space-y-3">
              {hospitals.map((hosp) => (
                <Card key={hosp.id}>
                  <CardContent className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-[10px] font-bold rounded uppercase">
                        {hosp.type.replace('_', ' ')}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 mt-1">{hosp.name}</h3>
                      <p className="text-slate-500">{hosp.address}, {hosp.district}</p>
                    </div>
                    <StatusBadge status="VERIFIED" variant="green" />
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
