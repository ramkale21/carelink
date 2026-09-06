'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CommunityHeader } from '@/components/layout/CommunityHeader';
import { CommunityBottomNav } from '@/components/layout/CommunityBottomNav';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { doctorService } from '@/services';
import { Doctor } from '@/types';
import { Stethoscope, Building2, Calendar, Star, CheckCircle2 } from 'lucide-react';

export default function DoctorDiscoveryPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');

  useEffect(() => {
    doctorService.getDoctors({ search, specialization }).then(setDoctors);
  }, [search, specialization]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      <DemoRoleSwitcher />
      <CommunityHeader title="Find Doctors & Specialists" />

      <main className="flex-1 p-4 max-w-4xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input placeholder="Search doctor name or specialty..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select
            options={[
              { value: '', label: 'All Specializations' },
              { value: 'General Medicine', label: 'General Medicine / MD' },
              { value: 'Obstetrics', label: 'Obstetrics & Gynecology' },
              { value: 'Cardiology', label: 'Cardiology' },
              { value: 'Pediatrics', label: 'Pediatrics' },
            ]}
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {doctors.map((doc) => (
            <Card key={doc.id} className="hover:border-sky-400 transition-all">
              <CardContent className="p-4 flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Medical Officer
                    </span>
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {doc.rating || 4.8}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{doc.name}</h3>
                  <p className="text-xs font-semibold text-sky-700">{doc.specialization} ({doc.qualification})</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> {doc.hospitalName}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span>Exp: {doc.experienceYears} Years</span>
                    <span>Available: {doc.availableDays?.join(', ')}</span>
                  </div>
                </div>

                <div className="sm:text-right shrink-0 space-y-2 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <span className="text-xs font-bold text-emerald-700 block">FREE OPD Consultation</span>
                  <Link href={`/patient/appointments/book?doctorId=${doc.id}&hospitalId=${doc.hospitalId}`}>
                    <Button size="sm" className="w-full sm:w-auto">
                      <Calendar className="w-3.5 h-3.5 mr-1" /> Book Slot
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <CommunityBottomNav />
    </div>
  );
}
