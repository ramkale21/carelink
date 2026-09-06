'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ClinicalSidebar } from '@/components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '@/components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { patientService, medicalRecordService, prescriptionService, referralService } from '@/services';
import { Patient, PrescriptionMedicine } from '@/types';
import { Stethoscope, Plus, Trash2, CheckCircle2, Save, Share2, Pill } from 'lucide-react';

function DoctorConsultationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const patientId = searchParams.get('patientId') || 'pat-1';

  const [patient, setPatient] = useState<Patient | null>(null);
  const [complaint, setComplaint] = useState('High fever (101°F), dry cough, and mild breathlessness');
  const [bp, setBp] = useState('138/88');
  const [hr, setHr] = useState('84');
  const [spo2, setSpo2] = useState('97');
  const [diagnosis, setDiagnosis] = useState('Acute Upper Respiratory Infection with Mild Bronchospasm');
  const [clinicalNotes, setClinicalNotes] = useState('Advised warm saline gargles, hydration, and salt restriction. Re-evaluate in 3 days.');

  const [medicines, setMedicines] = useState<Omit<PrescriptionMedicine, 'id'>[]>([
    { medicineId: 'med-1', medicineName: 'Paracetamol 650mg', dosage: '1 Tablet', frequency: '1-0-1 (Twice daily)', duration: '5 days', instructions: 'Take after meals' },
    { medicineId: 'med-2', medicineName: 'Amoxicillin 500mg', dosage: '1 Capsule', frequency: '1-0-1 (Twice daily)', duration: '5 days', instructions: 'Complete full course' },
  ]);

  const [newMedName, setNewMedName] = useState('');
  const [newDosage, setNewDosage] = useState('1 Tablet');
  const [newFrequency, setNewFrequency] = useState('1-0-1 (Twice daily)');
  const [newDuration, setNewDuration] = useState('5 days');

  const [createReferral, setCreateReferral] = useState(false);
  const [referralTarget, setReferralTarget] = useState('hosp-3');
  const [referralReason, setReferralReason] = useState('Escalation to District Hospital for specialized pulmonology review');

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    patientService.getPatientById(patientId).then(setPatient);
  }, [patientId]);

  const addMedicine = () => {
    if (newMedName.trim()) {
      setMedicines([
        ...medicines,
        {
          medicineId: `med-${Date.now()}`,
          medicineName: newMedName,
          dosage: newDosage,
          frequency: newFrequency,
          duration: newDuration,
        },
      ]);
      setNewMedName('');
    }
  };

  const removeMedicine = (idx: number) => {
    setMedicines(medicines.filter((_, i) => i !== idx));
  };

  const handleCompleteConsultation = async () => {
    setIsSaving(true);

    await medicalRecordService.createRecord({
      patientId,
      doctorId: 'doc-1',
      doctorName: 'Dr. Anand Deshmukh',
      hospitalId: 'hosp-1',
      hospitalName: 'PHC Khed',
      recordType: 'CONSULTATION',
      diagnosis,
      notes: clinicalNotes,
      treatment: medicines.map((m) => m.medicineName).join(', '),
    });

    if (medicines.length > 0) {
      await prescriptionService.createPrescription({
        patientId,
        patientName: patient?.name || 'Ravi Patil',
        doctorId: 'doc-1',
        doctorName: 'Dr. Anand Deshmukh',
        instructions: 'Take medicines as directed.',
        medicines: medicines.map((m, idx) => ({ ...m, id: `pm-${idx}` })),
      });
    }

    if (createReferral) {
      await referralService.createReferral({
        patientId,
        patientName: patient?.name || 'Ravi Patil',
        fromHospitalId: 'hosp-1',
        fromHospitalName: 'PHC Khed',
        toHospitalId: referralTarget,
        toHospitalName: 'District Hospital Aundh (Pune)',
        doctorId: 'doc-1',
        doctorName: 'Dr. Anand Deshmukh',
        reason: referralReason,
        priority: 'HIGH',
      });
    }

    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => {
      router.push('/doctor/queue');
    }, 1500);
  };

  if (!patient) return <div className="p-8 text-center text-slate-500 text-xs">Loading patient consultation details...</div>;

  return (
    <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-5xl">
      {isSaved ? (
        <Card className="border-emerald-300 bg-emerald-50/50">
          <CardContent className="p-8 text-center space-y-3 animate-fade-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Consultation Completed & Saved!</h2>
            <p className="text-xs text-slate-600">EHR record created, E-Prescription issued & queue token updated.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Active Patient Demographics Strip */}
          <Card className="bg-slate-900 text-white">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-white">{patient.name}</h3>
                  <span className="text-xs text-slate-300">({patient.age}y, {patient.gender})</span>
                  <RiskBadge level={patient.currentRisk || 'LOW'} size="sm" />
                </div>
                <p className="text-xs text-slate-400">Village {patient.village}, {patient.district} • Blood Group: {patient.bloodGroup}</p>
              </div>
              <div className="text-xs text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                History: {patient.medicalHistory?.join(', ') || 'None'}
              </div>
            </CardContent>
          </Card>

          {/* Vitals & Chief Complaints */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader className="py-3">
                <CardTitle className="text-xs uppercase font-bold text-slate-700">1. Chief Complaints & Clinical Findings</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <Input label="Chief Complaint" value={complaint} onChange={(e) => setComplaint(e.target.value)} />
                <Input label="Primary Diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-xs uppercase font-bold text-slate-700">2. Recorded Vitals</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2 text-xs">
                <Input label="Blood Pressure (mmHg)" value={bp} onChange={(e) => setBp(e.target.value)} />
                <Input label="Heart Rate (BPM)" value={hr} onChange={(e) => setHr(e.target.value)} />
                <Input label="Spo2 (%)" value={spo2} onChange={(e) => setSpo2(e.target.value)} />
              </CardContent>
            </Card>
          </div>

          {/* E-Prescription Builder */}
          <Card>
            <CardHeader className="py-3 flex justify-between items-center">
              <CardTitle className="text-xs uppercase font-bold text-purple-800 flex items-center gap-2">
                <Pill className="w-4 h-4 text-purple-600" /> 3. E-Prescription Medication Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Add Medicine Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                <Input placeholder="Medicine Name (e.g. Paracetamol 650mg)" value={newMedName} onChange={(e) => setNewMedName(e.target.value)} />
                <Input placeholder="Dosage (e.g. 1 Tablet)" value={newDosage} onChange={(e) => setNewDosage(e.target.value)} />
                <Input placeholder="Frequency (e.g. 1-0-1)" value={newFrequency} onChange={(e) => setNewFrequency(e.target.value)} />
                <div className="flex gap-2">
                  <Input placeholder="Duration (e.g. 5 days)" value={newDuration} onChange={(e) => setNewDuration(e.target.value)} />
                  <Button type="button" variant="teal" size="sm" onClick={addMedicine} className="shrink-0 mt-auto">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Prescribed List */}
              <div className="space-y-2">
                {medicines.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{m.medicineName}</span>
                      <span className="text-slate-500">Dosage: {m.dosage} • Frequency: {m.frequency} • Duration: {m.duration}</span>
                    </div>
                    <button onClick={() => removeMedicine(idx)} className="text-red-500 hover:text-red-700 p-1 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Referral Toggle Section */}
          <Card>
            <CardHeader className="py-3 flex justify-between items-center">
              <CardTitle className="text-xs uppercase font-bold text-amber-800 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-600" /> 4. Higher Center Referral Escalation
              </CardTitle>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={createReferral}
                  onChange={(e) => setCreateReferral(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600"
                />
                Create Digital Referral Slip
              </label>
            </CardHeader>
            {createReferral && (
              <CardContent className="p-4 space-y-3 bg-amber-50/40">
                <Select
                  label="Referred Hospital Facility"
                  value={referralTarget}
                  onChange={(e) => setReferralTarget(e.target.value)}
                  options={[
                    { value: 'hosp-3', label: 'District Hospital Aundh (Pune) - Tertiary ICU/Trauma Hub' },
                    { value: 'hosp-2', label: 'Community Health Centre (CHC) Manchar' },
                  ]}
                />
                <Input label="Referral Reason" value={referralReason} onChange={(e) => setReferralReason(e.target.value)} />
              </CardContent>
            )}
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="outline" onClick={() => router.push('/doctor/queue')}>
              Cancel
            </Button>
            <Button isLoading={isSaving} onClick={handleCompleteConsultation} size="lg">
              <Save className="w-4 h-4 mr-2" /> Complete Consultation & Save EHR
            </Button>
          </div>
        </>
      )}
    </main>
  );
}

export default function DoctorConsultationPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="DOCTOR" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="DOCTOR" title="Consultation Workspace" />

          <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading consultation workspace...</div>}>
            <DoctorConsultationForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

