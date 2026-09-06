'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClinicalSidebar } from '@/components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '@/components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { patientService } from '@/services';
import { Patient } from '@/types';
import { Users, Search, ChevronRight, Stethoscope, Phone } from 'lucide-react';

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    patientService.getPatients().then(setPatients);
  }, []);

  const filtered = patients.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.village?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="DOCTOR" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="DOCTOR" title="Patient Clinical Directory" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Registered Patient Records</h2>
                <p className="text-xs text-slate-500">Access electronic health records across Pune District.</p>
              </div>
              <div className="w-full sm:w-72">
                <Input placeholder="Search patient name or village..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((pat) => (
                <Card key={pat.id} className="hover:border-sky-400 transition-all">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-base text-slate-900">{pat.name}</h3>
                        <p className="text-xs text-slate-500">
                          {pat.age}y, {pat.gender} • Blood Group: <strong className="text-slate-800">{pat.bloodGroup}</strong>
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">Village {pat.village}, {pat.district}</p>
                      </div>
                      <RiskBadge level={pat.currentRisk || 'LOW'} size="sm" />
                    </div>

                    <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                      <span className="text-slate-500 font-semibold block">Known History:</span>
                      <p className="text-slate-800 font-medium">{pat.medicalHistory?.join(', ') || 'None recorded'}</p>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Link href={`/doctor/patients/${pat.id}`} className="w-full">
                        <Button variant="outline" size="sm" className="w-full">
                          View EHR Profile <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
                      <Link href={`/doctor/consultation?patientId=${pat.id}`} className="w-full">
                        <Button size="sm" className="w-full">
                          <Stethoscope className="w-3.5 h-3.5 mr-1" /> Consult
                        </Button>
                      </Link>
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
