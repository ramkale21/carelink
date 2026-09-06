'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CommunityHeader } from '@/components/layout/CommunityHeader';
import { CommunityBottomNav } from '@/components/layout/CommunityBottomNav';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { healthWorkerService, patientService } from '@/services';
import { Patient, RiskLevel } from '@/types';
import { Activity, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

function FieldHealthScreeningContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialPatientId = searchParams.get('patientId') || 'pat-1';

  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId);

  const [bp, setBp] = useState('140/90');
  const [hr, setHr] = useState(88);
  const [temp, setTemp] = useState(100.4);
  const [spo2, setSpo2] = useState(97);
  const [symptoms, setSymptoms] = useState('Fever, Cough, Fatigue');

  const [isLoading, setIsLoading] = useState(false);
  const [screenedRisk, setScreenedRisk] = useState<RiskLevel | null>(null);

  useEffect(() => {
    patientService.getPatients().then(setPatients);
  }, []);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  const handleScreeningSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const computedRisk: RiskLevel = temp > 102 || spo2 < 93 ? 'HIGH' : temp > 99.5 ? 'MEDIUM' : 'LOW';

    await healthWorkerService.submitScreening({
      patientId: selectedPatientId,
      patientName: selectedPatient?.name || 'Sunita More',
      workerId: 'wrk-1',
      workerName: 'ASHA Sangeeta Gaikwad',
      symptoms: symptoms.split(',').map((s) => s.trim()),
      vitals: { bloodPressure: bp, heartRate: hr, temperature: temp, spo2 },
      riskLevel: computedRisk,
      notes: 'Recorded during village household screening visit.',
    });

    setIsLoading(false);
    setScreenedRisk(computedRisk);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      <DemoRoleSwitcher />
      <CommunityHeader title="Field Health Screening" isWorker />

      <main className="flex-1 p-4 max-w-xl mx-auto w-full space-y-6">
        <Card>
          <CardHeader className="py-3 bg-sky-50/50">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-600" /> Village Vitals Screening & AI Risk Triage
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {screenedRisk ? (
              <div className="py-6 text-center space-y-4 animate-fade-in">
                <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto" />
                <h2 className="text-xl font-bold text-slate-900">Screening Recorded!</h2>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-slate-600">Assigned Triage Level:</span>
                  <RiskBadge level={screenedRisk} size="md" />
                </div>

                {screenedRisk === 'HIGH' || screenedRisk === 'CRITICAL' ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 space-y-2">
                    <p className="font-bold flex items-center justify-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-red-600" /> Priority Hospital Referral Triggered!
                    </p>
                    <p>An urgent follow-up task and referral recommendation have been dispatched.</p>
                  </div>
                ) : null}

                <Button onClick={() => router.push('/community')} className="w-full">
                  Return to Dashboard <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            ) : (
              <form onSubmit={handleScreeningSubmit} className="space-y-4">
                <Select
                  label="Select Patient"
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  options={patients.map((p) => ({ value: p.id, label: `${p.name} (Village ${p.village})` }))}
                />

                <Input label="Observed Symptoms" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} required />

                <div className="grid grid-cols-2 gap-3">
                  <Input label="Blood Pressure (mmHg)" value={bp} onChange={(e) => setBp(e.target.value)} />
                  <Input label="Heart Rate (BPM)" type="number" value={hr} onChange={(e) => setHr(Number(e.target.value))} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input label="Body Temperature (°F)" type="number" step="0.1" value={temp} onChange={(e) => setTemp(Number(e.target.value))} />
                  <Input label="Spo2 Oxygen (%)" type="number" value={spo2} onChange={(e) => setSpo2(Number(e.target.value))} />
                </div>

                <Button type="submit" isLoading={isLoading} variant="teal" className="w-full">
                  Submit Field Screening & Calculate Risk
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>

      <CommunityBottomNav isWorker />
    </div>
  );
}

export default function FieldHealthScreeningPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading screening form...</div>}>
      <FieldHealthScreeningContent />
    </Suspense>
  );
}

