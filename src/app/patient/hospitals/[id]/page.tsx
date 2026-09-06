'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CommunityHeader } from '@/components/layout/CommunityHeader';
import { CommunityBottomNav } from '@/components/layout/CommunityBottomNav';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { hospitalService, doctorService } from '@/services';
import { Hospital, Doctor } from '@/types';
import { MapPin, Phone, Mail, BedDouble, Navigation, Stethoscope, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function HospitalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    if (params.id) {
      hospitalService.getHospitalById(params.id as string).then(setHospital);
      doctorService.getDoctors({ hospitalId: params.id as string }).then(setDoctors);
    }
  }, [params.id]);

  if (!hospital) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      <DemoRoleSwitcher />
      <CommunityHeader title={hospital.name} />

      <main className="flex-1 p-4 max-w-3xl mx-auto w-full space-y-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Facilities
        </Button>

        <Card>
          <CardHeader className="bg-sky-50/50">
            <div className="space-y-1">
              <span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-[10px] font-bold rounded uppercase">
                {hospital.type.replace('_', ' ')}
              </span>
              <CardTitle className="text-xl text-slate-900">{hospital.name}</CardTitle>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {hospital.address}, {hospital.district}, {hospital.state}
              </p>
            </div>
            {hospital.emergencyAvailable && <StatusBadge status="24/7 EMERGENCY AVAILABLE" variant="red" />}
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block">Phone Contact:</span>
                <a href={`tel:${hospital.phone}`} className="font-bold text-sky-700 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> {hospital.phone}
                </a>
              </div>
              <div>
                <span className="text-slate-500 block">Available Bed Capacity:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <BedDouble className="w-3.5 h-3.5" /> {hospital.availableBeds} / {hospital.totalBeds} Beds Free
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Available Clinical Services</h4>
              <div className="flex flex-wrap gap-2">
                {hospital.services?.map((svc, idx) => (
                  <span key={idx} className="px-3 py-1 bg-sky-50 text-sky-800 text-xs font-semibold rounded-lg border border-sky-200">
                    ✓ {svc}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Physicians On Duty At This Facility</h4>
              <div className="space-y-3">
                {doctors.map((doc) => (
                  <div key={doc.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">{doc.name}</h5>
                      <p className="text-[11px] text-slate-500">{doc.specialization}</p>
                    </div>
                    <Link href={`/patient/appointments/book?doctorId=${doc.id}&hospitalId=${hospital.id}`}>
                      <Button size="sm">Book Slot</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <a
                href={`https://maps.google.com/?q=${hospital.latitude || 18.8471},${hospital.longitude || 73.9056}`}
                target="_blank"
                rel="noreferrer"
                className="w-full"
              >
                <Button variant="outline" size="md" className="w-full">
                  <Navigation className="w-4 h-4 mr-1.5" /> Get Map Directions
                </Button>
              </a>
              <Link href={`/patient/appointments/book?hospitalId=${hospital.id}`} className="w-full">
                <Button size="md" className="w-full">
                  Book Appointment Now
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <CommunityBottomNav />
    </div>
  );
}
