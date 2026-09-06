'use client';

import React from 'react';
import Link from 'next/link';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Activity, Building2, Stethoscope, Pill, Share2, PhoneCall } from 'lucide-react';

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DemoRoleSwitcher />
      <PublicHeader />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold text-slate-900">CareLink Services</h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Comprehensive digital health modules tailored for rural communities, public health facilities, and field workers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 space-y-3">
              <Activity className="w-8 h-8 text-sky-600" />
              <h3 className="text-base font-bold text-slate-900">AI Risk Assessment</h3>
              <p className="text-xs text-slate-600">Multi-step symptom triage classifying medical risk into Low, Medium, High, and Critical alert levels.</p>
              <Link href="/patient/symptoms" className="inline-block text-xs font-bold text-sky-600 hover:underline">Start Assessment →</Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <Building2 className="w-8 h-8 text-teal-600" />
              <h3 className="text-base font-bold text-slate-900">Facility & Bed Finder</h3>
              <p className="text-xs text-slate-600">Real-time availability of Sub-Centers, PHCs, CHCs, District Hospitals, and ICU emergency beds.</p>
              <Link href="/find-care" className="inline-block text-xs font-bold text-teal-600 hover:underline">Find Facilities →</Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <Stethoscope className="w-8 h-8 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">Doctor Scheduling & Queue</h3>
              <p className="text-xs text-slate-600">Digital OPD token booking, physician availability calendars, and live queue wait time monitoring.</p>
              <Link href="/patient/doctors" className="inline-block text-xs font-bold text-emerald-600 hover:underline">Find Doctors →</Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <Share2 className="w-8 h-8 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">Inter-Facility Referrals</h3>
              <p className="text-xs text-slate-600">Digital referral transfer slips with priority escalation from village sub-centers to district trauma hubs.</p>
              <Link href="/patient/referrals" className="inline-block text-xs font-bold text-amber-600 hover:underline">Track Referrals →</Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <Pill className="w-8 h-8 text-purple-600" />
              <h3 className="text-base font-bold text-slate-900">Pharmacy & Stock Tracking</h3>
              <p className="text-xs text-slate-600">E-prescription dispensing workflow, essential medicine inventory tracking, and low-stock alerts.</p>
              <Link href="/pharmacy" className="inline-block text-xs font-bold text-purple-600 hover:underline">Pharmacy Portal →</Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <PhoneCall className="w-8 h-8 text-red-600" />
              <h3 className="text-base font-bold text-slate-900">108 Emergency Response</h3>
              <p className="text-xs text-slate-600">One-tap emergency SOS button broadcasting patient GPS location to nearest trauma center and 108 dialer.</p>
              <Link href="/patient/emergency" className="inline-block text-xs font-bold text-red-600 hover:underline">Emergency UI →</Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
