'use client';

import React from 'react';
import Link from 'next/link';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { OfflineBanner } from '@/components/layout/OfflineBanner';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Building2,
  Share2,
  Users,
  Activity,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  MapPin,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DemoRoleSwitcher />
      <OfflineBanner />
      <PublicHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-sky-900 via-slate-900 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold border border-sky-400/30">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            Empowering Public & Rural Healthcare Infrastructure in India
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Accessible healthcare, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">
              wherever you are.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            CareLink connects patients, healthcare workers, doctors, hospitals, pharmacies, and community healthcare services in one integrated, decision-supported platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/patient">
              <Button size="lg" className="w-full sm:w-auto text-base">
                Get Healthcare <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/find-care">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-700 text-white bg-slate-800/80 hover:bg-slate-800 text-base">
                <MapPin className="w-5 h-5 mr-2 text-sky-400" /> Find Nearby Hospital
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-2">INTEGRATED CARE ECOSYSTEM</h2>
          <h3 className="text-3xl font-extrabold text-slate-900">How CareLink Transforms Healthcare Delivery</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:border-sky-300 transition-all">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-xl flex items-center justify-center mx-auto">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">1. AI-Assisted Screening</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Patients and ASHA workers perform structured symptom evaluation with intelligent clinical risk stratification (Low, Medium, High, Emergency).
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-sky-300 transition-all">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center mx-auto">
                <Share2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">2. Seamless Referral Continuum</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Smooth escalation from Sub-Centers & PHCs to District Hospitals with digital transfer slips and real-time bed tracking.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-sky-300 transition-all">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mx-auto">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">3. Unified Clinical Records</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Doctors, pharmacists, and field health workers access unified electronic health records, e-prescriptions, and diagnostic reports.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Public Healthcare Roles Grid */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-2">MULTIFACETED PORTALS</h2>
            <h3 className="text-3xl font-extrabold text-slate-900">Built For Every Healthcare Stakeholder</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/patient" className="group">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl group-hover:border-sky-500 group-hover:shadow-md transition-all">
                <Users className="w-8 h-8 text-sky-600 mb-3" />
                <h4 className="font-bold text-slate-900 mb-1">Patients</h4>
                <p className="text-xs text-slate-500">Symptom checker, facility finder, doctor appointments, records & 108 emergency help.</p>
              </div>
            </Link>

            <Link href="/doctor" className="group">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl group-hover:border-sky-500 group-hover:shadow-md transition-all">
                <Stethoscope className="w-8 h-8 text-sky-600 mb-3" />
                <h4 className="font-bold text-slate-900 mb-1">Doctors & Specialists</h4>
                <p className="text-xs text-slate-500">Live triage queue, patient medical history, consultation room, e-prescriptions & labs.</p>
              </div>
            </Link>

            <Link href="/hospital" className="group">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl group-hover:border-sky-500 group-hover:shadow-md transition-all">
                <Building2 className="w-8 h-8 text-sky-600 mb-3" />
                <h4 className="font-bold text-slate-900 mb-1">Facility Administrators</h4>
                <p className="text-xs text-slate-500">Bed capacity management (ICU/General), OPD token queues, doctor duty rosters.</p>
              </div>
            </Link>

            <Link href="/community" className="group">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl group-hover:border-sky-500 group-hover:shadow-md transition-all">
                <HeartPulse className="w-8 h-8 text-sky-600 mb-3" />
                <h4 className="font-bold text-slate-900 mb-1">ASHA / ANM / CHO</h4>
                <p className="text-xs text-slate-500">Village patient registration, field vitals screening, household visit logs & follow-ups.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Safety Banner */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex p-3 bg-sky-500/20 text-sky-400 rounded-full mb-2">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h3 className="text-3xl font-extrabold">Decision Support, Not Autonomous Diagnosis</h3>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
            CareLink AI risk models provide clinical decision support to assist medical officers and field health workers. The platform does not replace certified healthcare professionals. Emergency cases trigger direct priority escalation to district trauma centers.
          </p>
          <div className="flex items-center justify-center gap-8 pt-4 text-xs font-semibold text-sky-300">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> ABDM Standards Compliant</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Low-Bandwidth Optimised</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multilingual Ready</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 text-center bg-sky-600 text-white">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Healthcare should not depend on where you live.</h2>
          <p className="text-sky-100 text-sm max-w-xl mx-auto">
            Experience the complete integrated CareLink ecosystem for rural and public healthcare delivery.
          </p>
          <div className="pt-2">
            <Link href="/patient">
              <Button variant="secondary" size="lg" className="px-8 text-base">
                Launch CareLink Ecosystem <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
