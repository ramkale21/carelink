'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CommunityHeader } from '@/components/layout/CommunityHeader';
import { CommunityBottomNav } from '@/components/layout/CommunityBottomNav';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { MLRiskResult } from '@/types';
import {
  ShieldAlert,
  AlertTriangle,
  Building2,
  Calendar,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  Activity,
} from 'lucide-react';

export default function AssessmentResultPage() {
  const [result, setResult] = useState<MLRiskResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('carelink_assessment_result');
    if (raw) {
      try {
        setResult(JSON.parse(raw));
      } catch {
        setResult(null);
      }
    } else {
      setResult({
        riskLevel: 'MEDIUM',
        confidence: 0.89,
        possibleConditions: ['Acute Upper Respiratory Tract Infection', 'Mild Hypertensive Reaction'],
        recommendedAction: 'Consult a primary care physician at PHC Khed within 24 hours.',
        nextSteps: [
          'Schedule an OPD appointment at PHC Khed',
          'Rest, hydrate with ORS fluids',
          'Monitor body temperature every 4 hours',
        ],
        requiresEmergency: false,
        recommendedFacilityType: 'PHC',
      });
    }
  }, []);

  if (!result) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      <DemoRoleSwitcher />
      <CommunityHeader title="AI Health Risk Assessment Result" />

      <main className="flex-1 p-4 max-w-2xl mx-auto w-full space-y-6">
        {/* Emergency SOS High-Visibility Alert if Critical */}
        {result.requiresEmergency && (
          <div className="p-5 bg-red-600 text-white rounded-xl shadow-lg space-y-3 animate-pulse-glow">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-6 h-6 animate-bounce" />
              <h2 className="text-lg font-extrabold uppercase tracking-wide">EMERGENCY ATTENTION REQUIRED</h2>
            </div>
            <p className="text-xs text-red-100 leading-relaxed">
              Your symptoms indicate potential high clinical risk. Immediate medical evaluation at a District Trauma Facility or 108 Emergency Ambulance dispatch is strongly recommended.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <a href="tel:108" className="w-full sm:w-auto">
                <Button variant="secondary" size="md" className="w-full font-bold bg-white text-red-700 hover:bg-red-50">
                  <PhoneCall className="w-4 h-4 mr-1.5" /> Call 108 Ambulance Now
                </Button>
              </a>
              <Link href="/patient/emergency" className="w-full sm:w-auto">
                <Button variant="outline" size="md" className="w-full text-white border-white hover:bg-red-700">
                  Emergency Facility Directions
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Risk Card */}
        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-sky-600" />
              <CardTitle className="text-base">Assessed Risk Summary</CardTitle>
            </div>
            <RiskBadge level={result.riskLevel} size="lg" />
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            <div>
              <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider mb-1">Recommended Action</span>
              <p className="text-sm font-bold text-slate-900 bg-sky-50 p-3 rounded-lg border border-sky-200">
                {result.recommendedAction}
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider mb-2">Possible Clinical Conditions</span>
              <ul className="space-y-1.5">
                {result.possibleConditions.map((cond, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                    {cond}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider mb-2">Recommended Next Steps</span>
              <ul className="space-y-2">
                {result.nextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <Link href="/patient/appointments/book" className="w-full">
                <Button size="md" className="w-full">
                  <Calendar className="w-4 h-4 mr-1.5" /> Book Doctor Appointment
                </Button>
              </Link>
              <Link href="/patient/hospitals" className="w-full">
                <Button variant="outline" size="md" className="w-full">
                  <Building2 className="w-4 h-4 mr-1.5" /> Find Nearby Facility
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer Footer */}
        <div className="text-[11px] text-slate-500 text-center space-y-1">
          <p>Confidence score: {(result.confidence * 100).toFixed(0)}% based on CareLink ML triage engine v1.2</p>
          <p>This assessment is decision support only and does not replace professional medical advice.</p>
        </div>
      </main>

      <CommunityBottomNav />
    </div>
  );
}
