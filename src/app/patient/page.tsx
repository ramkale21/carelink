'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CommunityHeader } from '@/components/layout/CommunityHeader';
import { CommunityBottomNav } from '@/components/layout/CommunityBottomNav';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { OfflineBanner } from '@/components/layout/OfflineBanner';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { patientService, appointmentService, referralService } from '@/services';
import { Patient, Appointment, Referral } from '@/types';
import {
  Activity,
  Calendar,
  Building2,
  Stethoscope,
  FileText,
  Pill,
  Share2,
  PhoneCall,
  ArrowRight,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export default function PatientDashboard() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);

  useEffect(() => {
    patientService.getPatientById('pat-1').then(setPatient);
    appointmentService.getAppointmentsByPatient('pat-1').then(setAppointments);
    referralService.getReferralsByPatient('pat-1').then(setReferrals);
  }, []);

  const upcomingApt = appointments.find((a) => a.status === 'BOOKED' || a.status === 'CHECKED_IN' || a.status === 'IN_CONSULTATION');
  const activeReferral = referrals[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      <DemoRoleSwitcher />
      <OfflineBanner />
      <CommunityHeader title={`Namaste, ${patient?.name || 'Ravi'}`} />

      <main className="flex-1 p-4 max-w-4xl mx-auto w-full space-y-6">
        {/* Patient Health Header Card */}
        <Card className="bg-gradient-to-r from-sky-900 to-slate-900 text-white shadow-md">
          <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">HEALTH PROFILE</span>
              <h2 className="text-xl font-extrabold text-white">{patient?.name || 'Ravi Patil'} ({patient?.age || 41} yrs, {patient?.gender || 'Male'})</h2>
              <p className="text-xs text-slate-300">Village {patient?.village || 'Khed'}, {patient?.district || 'Pune'} District</p>
              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs text-slate-300">Assigned Risk Level:</span>
                <RiskBadge level={patient?.currentRisk || 'MEDIUM'} size="sm" />
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Link href="/patient/symptoms" className="w-full sm:w-auto">
                <Button variant="teal" size="sm" className="w-full">
                  <Activity className="w-4 h-4 mr-1.5" /> Check Symptoms
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Action Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Link href="/patient/symptoms">
            <div className="p-4 bg-white border border-slate-200 rounded-xl hover:border-sky-500 hover:shadow-md transition-all text-center space-y-2 group cursor-pointer">
              <div className="w-10 h-10 bg-sky-100 text-sky-700 rounded-xl flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">Symptom Checker</h4>
              <p className="text-[10px] text-slate-500">AI-assisted assessment</p>
            </div>
          </Link>

          <Link href="/patient/hospitals">
            <div className="p-4 bg-white border border-slate-200 rounded-xl hover:border-sky-500 hover:shadow-md transition-all text-center space-y-2 group cursor-pointer">
              <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">Find Hospital</h4>
              <p className="text-[10px] text-slate-500">PHCs & CHCs nearby</p>
            </div>
          </Link>

          <Link href="/patient/doctors">
            <div className="p-4 bg-white border border-slate-200 rounded-xl hover:border-sky-500 hover:shadow-md transition-all text-center space-y-2 group cursor-pointer">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">Book Doctor</h4>
              <p className="text-[10px] text-slate-500">Schedule OPD consultation</p>
            </div>
          </Link>

          <Link href="/patient/records">
            <div className="p-4 bg-white border border-slate-200 rounded-xl hover:border-sky-500 hover:shadow-md transition-all text-center space-y-2 group cursor-pointer">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">My Records</h4>
              <p className="text-[10px] text-slate-500">Consultations & Labs</p>
            </div>
          </Link>

          <Link href="/patient/prescriptions">
            <div className="p-4 bg-white border border-slate-200 rounded-xl hover:border-sky-500 hover:shadow-md transition-all text-center space-y-2 group cursor-pointer">
              <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <Pill className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">My Medicines</h4>
              <p className="text-[10px] text-slate-500">Dosage schedule</p>
            </div>
          </Link>

          <Link href="/patient/emergency">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl hover:border-red-500 hover:shadow-md transition-all text-center space-y-2 group cursor-pointer">
              <div className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center mx-auto group-hover:scale-105 transition-transform animate-pulse-glow">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-red-900">108 Emergency</h4>
              <p className="text-[10px] text-red-600 font-semibold">Immediate assistance</p>
            </div>
          </Link>
        </div>

        {/* Upcoming Appointment Status Card */}
        {upcomingApt ? (
          <Card className="border-sky-300 bg-sky-50/40">
            <CardHeader className="bg-sky-100/50 py-3">
              <CardTitle className="text-sm text-sky-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-700" /> Upcoming Appointment Today
              </CardTitle>
              <StatusBadge status={upcomingApt.status} />
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{upcomingApt.doctorName}</h4>
                  <p className="text-xs text-slate-600">{upcomingApt.doctorSpecialization}</p>
                  <p className="text-xs text-slate-500">{upcomingApt.hospitalName}</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-sky-700 text-white font-extrabold text-sm rounded-lg block">
                    Token #{upcomingApt.tokenNumber}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">Slot: {upcomingApt.startTime}</span>
                </div>
              </div>
              <div className="pt-2 flex justify-between items-center text-xs border-t border-sky-200/60">
                <span className="text-slate-600">Reason: {upcomingApt.reason}</span>
                <Link href="/patient/appointments" className="font-bold text-sky-700 hover:underline">
                  View Details →
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-slate-400" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">No Upcoming Appointments</h4>
                  <p className="text-[10px] text-slate-500">Need to consult a doctor at PHC Khed?</p>
                </div>
              </div>
              <Link href="/patient/appointments/book">
                <Button size="sm">Book Slot</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Active Referral Tracker Preview */}
        {activeReferral && (
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-600" /> Referral Progress Tracker
              </CardTitle>
              <StatusBadge status={activeReferral.status} />
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>From: {activeReferral.fromHospitalName}</span>
                <span>To: {activeReferral.toHospitalName}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-sky-600 h-2 rounded-full w-3/4" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Stage: {activeReferral.currentStage}</span>
                <Link href="/patient/referrals" className="text-sky-700 font-bold hover:underline">
                  Track Referral Journey →
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <CommunityBottomNav />
    </div>
  );
}
