'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CommunityHeader } from '@/components/layout/CommunityHeader';
import { CommunityBottomNav } from '@/components/layout/CommunityBottomNav';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { hospitalService } from '@/services';
import { Hospital } from '@/types';
import { MapPin, Phone, BedDouble, Navigation, ChevronRight } from 'lucide-react';

export default function PatientHospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    hospitalService.getHospitals({ search, type }).then(setHospitals);
  }, [search, type]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      <DemoRoleSwitcher />
      <CommunityHeader title="Find Healthcare Facilities" />

      <main className="flex-1 p-4 max-w-4xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input placeholder="Search hospital name or village..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select
            options={[
              { value: '', label: 'All Facility Types' },
              { value: 'PHC', label: 'PHC (Primary Health Centre)' },
              { value: 'CHC', label: 'CHC (Community Health Centre)' },
              { value: 'DISTRICT_HOSPITAL', label: 'District Hospital' },
              { value: 'SUB_CENTER', label: 'Health Sub-Center' },
            ]}
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {hospitals.map((hosp) => (
            <Card key={hosp.id} className="hover:border-sky-400 transition-all">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-[10px] font-bold rounded uppercase">
                      {hosp.type.replace('_', ' ')}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{hosp.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {hosp.address}, {hosp.district}
                    </p>
                  </div>
                  {hosp.emergencyAvailable && <StatusBadge status="24/7 EMERGENCY" variant="red" />}
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="font-bold text-sky-700">{hosp.distanceKm} km away</span>
                  <span className="text-slate-600 flex items-center gap-1">
                    <BedDouble className="w-3.5 h-3.5 text-slate-400" /> {hosp.availableBeds} / {hosp.totalBeds} Beds Free
                  </span>
                </div>

                <div className="flex gap-2 pt-1">
                  <Link href={`/patient/hospitals/${hosp.id}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full">
                      View Facility Details <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                  <Link href={`/patient/appointments/book?hospitalId=${hosp.id}`} className="w-full">
                    <Button size="sm" className="w-full">
                      Book Doctor Slot
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
