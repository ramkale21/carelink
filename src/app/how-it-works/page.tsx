'use client';

import React from 'react';
import Link from 'next/link';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { UserCheck, Stethoscope, Share2, Pill, Activity, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DemoRoleSwitcher />
      <PublicHeader />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold text-slate-900">How CareLink Works</h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            A step-by-step breakdown of how CareLink connects patient self-assessment, village health workers, primary health centers, district hospitals, and pharmacies into one unified care journey.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 bg-sky-100 text-sky-700 rounded-xl shrink-0">
                <Activity className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-sky-600 uppercase">Step 1</span>
                <h3 className="text-lg font-bold text-slate-900">Symptom Assessment & Screening</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The patient or ASHA worker enters symptoms and vitals (blood pressure, temperature, pulse, Spo2). The embedded ML risk engine evaluates risk (Low, Medium, High, Emergency) and provides decision support.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 bg-teal-100 text-teal-700 rounded-xl shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-teal-600 uppercase">Step 2</span>
                <h3 className="text-lg font-bold text-slate-900">Facility Discovery & Appointment Booking</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Based on risk assessment, CareLink recommends the nearest appropriate healthcare facility (Sub-Center, PHC, CHC, or District Hospital) and books an OPD slot with a doctor.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-600 uppercase">Step 3</span>
                <h3 className="text-lg font-bold text-slate-900">Physician Consultation & E-Prescription</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The consulting Medical Officer reviews live queue priority, opens the patient's EHR, records diagnosis, issues electronic prescriptions, and orders lab diagnostic tests.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-xl shrink-0">
                <Share2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-600 uppercase">Step 4</span>
                <h3 className="text-lg font-bold text-slate-900">Tiered Referral Escalation</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  If specialized ICU, surgery, or cardiology care is required, the doctor creates a digital referral to a District Hospital with real-time bed tracking and status updates.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 bg-purple-100 text-purple-700 rounded-xl shrink-0">
                <Pill className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-purple-600 uppercase">Step 5</span>
                <h3 className="text-lg font-bold text-slate-900">Pharmacy Fulfillment & Community Follow-up</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The hospital pharmacy dispenses prescribed medications while ASHA/ANM field workers receive automated follow-up reminders to verify patient recovery in the village.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center pt-4">
          <Link href="/patient/symptoms">
            <Button size="lg">
              Try Symptom Assessment Now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
