'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CommunityHeader } from '@/components/layout/CommunityHeader';
import { CommunityBottomNav } from '@/components/layout/CommunityBottomNav';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { doctorService, hospitalService, appointmentService } from '@/services';
import { Doctor, Hospital, Appointment } from '@/types';
import { Calendar, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

const SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00'];

function BookAppointmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDoctorId = searchParams.get('doctorId') || '';
  const initialHospitalId = searchParams.get('hospitalId') || 'hosp-1';

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  const [selectedHospitalId, setSelectedHospitalId] = useState(initialHospitalId);
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDoctorId);
  const [date, setDate] = useState('2026-09-06');
  const [time, setTime] = useState('10:00');
  const [reason, setReason] = useState('Persistent fever and chest discomfort review');

  const [isLoading, setIsLoading] = useState(false);
  const [bookedApt, setBookedApt] = useState<Appointment | null>(null);

  useEffect(() => {
    hospitalService.getHospitals().then(setHospitals);
  }, []);

  useEffect(() => {
    doctorService.getDoctors({ hospitalId: selectedHospitalId }).then((docs) => {
      setDoctors(docs);
      if (docs.length > 0 && !selectedDoctorId) {
        setSelectedDoctorId(docs[0].id);
      }
    });
  }, [selectedHospitalId]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const apt = await appointmentService.bookAppointment({
        patientId: 'pat-1',
        doctorId: selectedDoctorId || doctors[0]?.id || 'doc-1',
        hospitalId: selectedHospitalId,
        date,
        time,
        reason,
      });
      setIsLoading(false);
      setBookedApt(apt);
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 p-4 max-w-xl mx-auto w-full space-y-6">
      {bookedApt ? (
        <Card className="border-emerald-300 bg-emerald-50/50">
          <CardContent className="p-6 text-center space-y-4 animate-fade-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Appointment Booked Successfully!</h2>
            <p className="text-xs text-slate-600">Your OPD consultation token has been generated.</p>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2 text-left shadow-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">OPD Token Number:</span>
                <span className="font-extrabold text-sky-700 text-sm">#{bookedApt.tokenNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-bold text-slate-900">{bookedApt.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Facility:</span>
                <span className="font-bold text-slate-900">{bookedApt.hospitalName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Date & Time:</span>
                <span className="font-bold text-slate-900">{bookedApt.appointmentDate} at {bookedApt.startTime}</span>
              </div>
            </div>

            <Button onClick={() => router.push('/patient/appointments')} className="w-full">
              Go to My Appointments <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 space-y-4">
            <form onSubmit={handleBooking} className="space-y-4">
              <Select
                label="1. Select Healthcare Facility"
                value={selectedHospitalId}
                onChange={(e) => setSelectedHospitalId(e.target.value)}
                options={hospitals.map((h) => ({ value: h.id, label: `${h.name} (${h.district})` }))}
              />

              <Select
                label="2. Select Doctor / Medical Officer"
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                options={doctors.map((d) => ({ value: d.id, label: `${d.name} - ${d.specialization}` }))}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input label="3. Appointment Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    4. Available Slot
                  </label>
                  <select
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  >
                    {SLOTS.map((s) => (
                      <option key={s} value={s}>
                        {s} AM/PM
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="Reason for Visit / Main Complaints"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />

              <Button type="submit" isLoading={isLoading} className="w-full pt-3">
                Confirm Booking & Issue OPD Token
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

export default function BookAppointmentPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      <DemoRoleSwitcher />
      <CommunityHeader title="Book Doctor Appointment" />

      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading appointment booking...</div>}>
        <BookAppointmentForm />
      </Suspense>

      <CommunityBottomNav />
    </div>
  );
}

