'use client';

import React from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Card, CardContent } from '@/components/ui/Card';
import { HeartPulse, ShieldCheck, Users, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DemoRoleSwitcher />
      <PublicHeader />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold text-slate-900">About CareLink</h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            CareLink was built to bridge the gap between rural communities, frontline health workers, primary health centers, and tertiary referral hospitals across India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6 space-y-3">
              <Target className="w-8 h-8 text-sky-600" />
              <h3 className="text-base font-bold text-slate-900">Our Mission</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                To ensure every citizen, regardless of geographical remoteness or digital literacy, receives timely medical decision support, diagnostic access, and seamless referral care.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <Users className="w-8 h-8 text-teal-600" />
              <h3 className="text-base font-bold text-slate-900">Community Empowerment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Equipping ASHA, ANM, and CHO health workers with mobile-first screening tools that function even in low-connectivity rural environments.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Core Principles
            </h3>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                <strong>Accessibility & Low Literacy First:</strong> Clean interfaces, visual indicators, and multilingual support (English & Hindi) designed for rural users.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                <strong>Decoupled Presentation Layer:</strong> Architected with clean service interfaces allowing seamless API integration without UI refactoring.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                <strong>Clinical Decision Support:</strong> Machine learning algorithms assist physician diagnosis and prioritize high-risk emergency cases.
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>

      <PublicFooter />
    </div>
  );
}
