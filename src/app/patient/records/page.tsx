'use client';

import React, { useState, useEffect } from 'react';
import { CommunityHeader } from '@/components/layout/CommunityHeader';
import { CommunityBottomNav } from '@/components/layout/CommunityBottomNav';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Card, CardContent } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { medicalRecordService } from '@/services';
import { MedicalRecord, LabReport } from '@/types';
import { FileText, Stethoscope, TestTube, Download } from 'lucide-react';

export default function PatientRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'consultations' | 'labs'>('all');

  useEffect(() => {
    medicalRecordService.getRecordsByPatient('pat-1').then(setRecords);
    medicalRecordService.getLabReportsByPatient('pat-1').then(setLabReports);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      <DemoRoleSwitcher />
      <CommunityHeader title="Electronic Health Records (EHR)" />

      <main className="flex-1 p-4 max-w-3xl mx-auto w-full space-y-6">
        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              activeTab === 'all' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            All History Timeline
          </button>
          <button
            onClick={() => setActiveTab('consultations')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              activeTab === 'consultations' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Doctor Consultations ({records.length})
          </button>
          <button
            onClick={() => setActiveTab('labs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              activeTab === 'labs' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Lab Reports ({labReports.length})
          </button>
        </div>

        {/* Timeline View */}
        <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6">
          {(activeTab === 'all' || activeTab === 'consultations') &&
            records.map((rec) => (
              <div key={rec.id} className="relative">
                <span className="absolute -left-9 top-1.5 w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs shadow-xs">
                  <Stethoscope className="w-3.5 h-3.5" />
                </span>
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{new Date(rec.createdAt).toLocaleDateString()}</span>
                      <span className="font-semibold text-sky-700">{rec.recordType}</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{rec.diagnosis}</h3>
                    <p className="text-xs text-slate-600">Doctor: {rec.doctorName} ({rec.hospitalName})</p>
                    {rec.notes && <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded">Notes: {rec.notes}</p>}
                    {rec.treatment && (
                      <div className="text-xs text-emerald-800 bg-emerald-50 p-2 rounded font-mono">
                        Treatment: {rec.treatment}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}

          {(activeTab === 'all' || activeTab === 'labs') &&
            labReports.map((lab) => (
              <div key={lab.id} className="relative">
                <span className="absolute -left-9 top-1.5 w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs shadow-xs">
                  <TestTube className="w-3.5 h-3.5" />
                </span>
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{lab.reportDate}</span>
                      <StatusBadge status={lab.status} />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{lab.reportType}</h3>
                    <p className="text-xs text-slate-500">Facility: {lab.hospitalName}</p>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5 text-xs">
                      <span className="font-semibold text-slate-700 block">Extracted Parameters:</span>
                      {lab.results.map((r) => (
                        <div key={r.id} className="flex justify-between items-center text-[11px]">
                          <span>{r.parameter}</span>
                          <span className={r.abnormalFlag ? 'text-red-600 font-bold' : 'text-slate-800'}>
                            {r.value} {r.unit} {r.abnormalFlag && '(ABNORMAL)'}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end pt-1">
                      <a href={lab.fileUrl} target="_blank" rel="noreferrer">
                        <button className="text-xs font-semibold text-sky-700 hover:underline flex items-center gap-1">
                          <Download className="w-3.5 h-3.5" /> Download Lab PDF
                        </button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
        </div>
      </main>

      <CommunityBottomNav />
    </div>
  );
}
