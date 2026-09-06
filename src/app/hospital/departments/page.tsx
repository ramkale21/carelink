'use client';

import React from 'react';
import { ClinicalSidebar } from '../../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Building2, Activity, Users } from 'lucide-react';

const DEPARTMENTS = [
  { name: 'General OPD & Internal Medicine', doctors: 3, activeQueue: 18, status: 'Normal Operating Load' },
  { name: 'Maternal & Obstetrics Ward', doctors: 2, activeQueue: 8, status: 'Moderate Load' },
  { name: 'Pediatrics & Child Care', doctors: 2, activeQueue: 6, status: 'Normal Operating Load' },
  { name: '24/7 Emergency & Trauma Bay', doctors: 2, activeQueue: 2, status: 'High Alert Priority' },
];

export default function HospitalDepartmentsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="HOSPITAL_ADMIN" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="HOSPITAL_ADMIN" title="Facility Clinical Departments" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-4xl">
            <h2 className="text-base font-bold text-slate-900">Departmental Workload & Roster Overview</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DEPARTMENTS.map((dept) => (
                <Card key={dept.name}>
                  <CardHeader className="py-3 bg-slate-50">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-sky-600" /> {dept.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Physicians On Duty:</span>
                      <span className="font-bold text-slate-900">{dept.doctors} Doctors</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Active Queue Token Count:</span>
                      <span className="font-bold text-sky-700">{dept.activeQueue} Patients</span>
                    </div>
                    <div className="pt-2 border-t text-[11px] font-semibold text-emerald-700">
                      Status: {dept.status}
                    </div>
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
