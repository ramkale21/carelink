'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ClinicalSidebar } from '@/components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '@/components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { patientService, medicalRecordService, prescriptionService, referralService } from '@/services';
import { Patient, MedicalRecord, Prescription, Referral } from '@/types';
import { ArrowLeft, Stethoscope, FileText, Pill, Share2, Phone, Calendar } from 'lucide-react';

export default function ClinicalPatientProfilePage() {
  const params = useParams();
  const router = useRouter();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);

  useEffect(() => {
    if (params.id) {
      const pid = params.id as string;
      patientService.getPatientById(pid).then(setPatient);
      medicalRecordService.getRecordsByPatient(pid).then(setRecords);
      prescriptionService.getPrescriptionsByPatient(pid).then(setPrescriptions);
      referralService.getReferralsByPatient(pid).then(setReferrals);
    }
  }, [params.id]);

  if (!patient) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="DOCTOR" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="DOCTOR" title={`Clinical EHR: ${patient.name}`} />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-5xl">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Patient List
            </Button>

            {/* Demographics Summary Card */}
            <Card className="bg-white">
              <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-extrabold text-slate-900">{patient.name}</h2>
                    <RiskBadge level={patient.currentRisk || 'LOW'} size="md" />
                  </div>
                  <p className="text-xs text-slate-600">
                    {patient.age} years old, {patient.gender} • Blood Group: <strong className="text-slate-900">{patient.bloodGroup}</strong>
                  </p>
                  <p className="text-xs text-slate-500">Address: {patient.address}, Village {patient.village}, {patient.district}</p>
                  <p className="text-xs text-slate-500">Emergency Contact: {patient.emergencyContact}</p>
                </div>

                <Link href={`/doctor/consultation?patientId=${patient.id}`}>
                  <Button size="md">
                    <Stethoscope className="w-4 h-4 mr-1.5" /> Start Consultation
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Medical History & Allergies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-xs uppercase font-bold text-slate-700">Chronic Medical History</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                    {patient.medicalHistory?.map((m, idx) => (
                      <li key={idx} className="font-semibold">{m}</li>
                    )) || <li>No recorded history</li>}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-xs uppercase font-bold text-red-700">Known Allergies</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies?.map((a, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 text-xs font-bold rounded-lg">
                        ⚠️ {a}
                      </span>
                    )) || <span className="text-xs text-slate-500">No known drug allergies</span>}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Past Consultations Timeline */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-600" /> Past Consultations & Diagnostics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {records.map((r) => (
                  <div key={r.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between font-semibold text-slate-500">
                      <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                      <span className="text-sky-700">{r.doctorName} ({r.hospitalName})</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{r.diagnosis}</h4>
                    <p className="text-slate-600">Notes: {r.notes}</p>
                    <p className="text-emerald-800 font-mono">Treatment: {r.treatment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Prescriptions History */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Pill className="w-4 h-4 text-purple-600" /> Active E-Prescriptions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {prescriptions.map((rx) => (
                  <div key={rx.id} className="p-3 bg-purple-50/50 rounded-xl border border-purple-200 text-xs space-y-2">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Prescribed by {rx.doctorName}</span>
                      <span className="text-slate-500">{new Date(rx.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="space-y-1">
                      {rx.medicines.map((m) => (
                        <div key={m.id} className="flex justify-between text-slate-700 bg-white p-2 rounded border border-purple-100">
                          <span className="font-bold">{m.medicineName} ({m.dosage})</span>
                          <span>{m.frequency} x {m.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
