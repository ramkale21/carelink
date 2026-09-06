'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CommunityHeader } from '@/components/layout/CommunityHeader';
import { CommunityBottomNav } from '@/components/layout/CommunityBottomNav';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { triageService } from '@/services';
import { Activity, Search, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';

const COMMON_SYMPTOMS = [
  'Fever & Chills',
  'Chest Pain or Pressure',
  'Breathing Difficulty',
  'Persistent Cough',
  'Severe Headache',
  'Abdominal Pain',
  'Vomiting or Nausea',
  'Dizziness / Fainting',
  'Joint / Body Pain',
  'Skin Rash / Lesions',
];

const WIZARD_STEPS = [
  { id: 'symptoms', label: 'Symptoms' },
  { id: 'severity', label: 'Severity' },
  { id: 'duration', label: 'Duration' },
  { id: 'review', label: 'Review' },
];

export default function SymptomCheckerPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Fever & Chills']);
  const [customSymptom, setCustomSymptom] = useState('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  const [duration, setDuration] = useState('3 days');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleSymptom = (sx: string) => {
    if (selectedSymptoms.includes(sx)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sx));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sx]);
    }
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleRunAssessment = async () => {
    setIsLoading(true);
    try {
      const result = await triageService.assessSymptoms({
        symptoms: selectedSymptoms,
        severity,
        duration,
        additionalInfo,
        age: 41,
        gender: 'Male',
      });

      sessionStorage.setItem('carelink_assessment_result', JSON.stringify(result));
      router.push('/patient/symptoms/result');
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      <DemoRoleSwitcher />
      <CommunityHeader title="AI-Assisted Symptom Checker" />

      <main className="flex-1 p-4 max-w-2xl mx-auto w-full space-y-6">
        <ProgressIndicator steps={WIZARD_STEPS} currentStepIndex={currentStep} />

        {/* Disclaimer Banner */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Decision Support Notice:</strong> This assessment provides clinical decision support and does not replace a certified healthcare professional.
          </span>
        </div>

        {/* Step 0: Symptom Selection */}
        {currentStep === 0 && (
          <Card>
            <CardContent className="p-5 space-y-4">
              <h2 className="text-base font-bold text-slate-900">What symptoms are you experiencing?</h2>
              <p className="text-xs text-slate-500">Tap common symptoms or add specific complaints below.</p>

              <div className="flex gap-2">
                <Input
                  placeholder="Type a symptom..."
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSymptom())}
                />
                <Button variant="outline" size="sm" onClick={addCustomSymptom}>
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {COMMON_SYMPTOMS.map((sx) => {
                  const isSelected = selectedSymptoms.includes(sx);
                  return (
                    <button
                      key={sx}
                      type="button"
                      onClick={() => toggleSymptom(sx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {sx}
                    </button>
                  );
                })}
              </div>

              {selectedSymptoms.length === 0 && (
                <p className="text-xs text-red-600 font-semibold">Please select at least one symptom to proceed.</p>
              )}

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button
                  disabled={selectedSymptoms.length === 0}
                  onClick={() => setCurrentStep(1)}
                >
                  Next: Severity <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Severity Selection */}
        {currentStep === 1 && (
          <Card>
            <CardContent className="p-5 space-y-4">
              <h2 className="text-base font-bold text-slate-900">How severe are your symptoms?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSeverity('mild')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    severity === 'mild' ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500' : 'bg-white border-slate-200'
                  }`}
                >
                  <span className="font-bold text-sm text-emerald-900 block">Mild</span>
                  <span className="text-xs text-slate-500 block mt-1">Noticeable but manageable without disruption.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSeverity('moderate')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    severity === 'moderate' ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500' : 'bg-white border-slate-200'
                  }`}
                >
                  <span className="font-bold text-sm text-amber-900 block">Moderate</span>
                  <span className="text-xs text-slate-500 block mt-1">Interfering with daily routine or rest.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSeverity('severe')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    severity === 'severe' ? 'bg-red-50 border-red-500 ring-2 ring-red-500' : 'bg-white border-slate-200'
                  }`}
                >
                  <span className="font-bold text-sm text-red-900 block">Severe</span>
                  <span className="text-xs text-slate-500 block mt-1">Intense distress, unbearable pain, or emergency.</span>
                </button>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setCurrentStep(0)}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button onClick={() => setCurrentStep(2)}>
                  Next: Duration <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Duration */}
        {currentStep === 2 && (
          <Card>
            <CardContent className="p-5 space-y-4">
              <h2 className="text-base font-bold text-slate-900">How long have you had these symptoms?</h2>
              <Select
                label="Select Symptom Duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                options={[
                  { value: 'Less than 24 hours', label: 'Less than 24 hours (Sudden onset)' },
                  { value: '1 to 3 days', label: '1 to 3 days' },
                  { value: '4 to 7 days', label: '4 to 7 days' },
                  { value: 'More than 1 week', label: 'More than 1 week' },
                ]}
              />

              <Input
                label="Additional Health Information (Optional)"
                placeholder="e.g. Taking diabetes medication, pregnant, high fever..."
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button onClick={() => setCurrentStep(3)}>
                  Review & Submit <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Review & Submit */}
        {currentStep === 3 && (
          <Card>
            <CardContent className="p-5 space-y-4">
              <h2 className="text-base font-bold text-slate-900">Review Symptom Assessment</h2>
              <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs border border-slate-200">
                <div>
                  <span className="font-semibold text-slate-500 block">Selected Symptoms:</span>
                  <span className="font-bold text-slate-900">{selectedSymptoms.join(', ')}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 block">Severity Level:</span>
                  <span className="font-bold uppercase text-sky-700">{severity}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 block">Duration:</span>
                  <span className="font-bold text-slate-900">{duration}</span>
                </div>
                {additionalInfo && (
                  <div>
                    <span className="font-semibold text-slate-500 block">Notes:</span>
                    <span className="text-slate-800">{additionalInfo}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button isLoading={isLoading} onClick={handleRunAssessment}>
                  Run Risk Assessment <Activity className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <CommunityBottomNav />
    </div>
  );
}
