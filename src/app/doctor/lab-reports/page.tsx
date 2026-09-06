'use client';

import React, { useState, useEffect } from 'react';
import { ClinicalSidebar } from '../../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { medicalRecordService } from '../../../services';
import { LabReport } from '../../../types';
import { TestTube, AlertTriangle, CheckCircle2, Download } from 'lucide-react';

export default function DoctorLabReportsPage() {
  const [reports, setReports] = useState<LabReport[]>([]);

  useEffect(() => {
    medicalRecordService.getLabReportsByPatient('pat-1').then(setReports);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="DOCTOR" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="DOCTOR" title="Diagnostic Lab Analyzer" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-4xl">
            <h2 className="text-base font-bold text-slate-900">Patient Laboratory Test Results</h2>

            <div className="space-y-4">
              {reports.map((lab) => (
                <Card key={lab.id}>
                  <CardHeader className="py-3 bg-slate-50 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <TestTube className="w-4 h-4 text-sky-600" />
                      <span className="font-bold text-slate-900">{lab.patientName} — {lab.reportType}</span>
                    </div>
                    <StatusBadge status={lab.status} />
                  </CardHeader>

                  <CardContent className="p-4 space-y-3 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Facility: {lab.hospitalName}</span>
                      <span>Date: {lab.reportDate}</span>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
                          <tr>
                            <th className="p-2.5">Parameter</th>
                            <th className="p-2.5">Recorded Value</th>
                            <th className="p-2.5">Reference Range</th>
                            <th className="p-2.5 text-right">Flag</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {lab.results.map((r) => (
                            <tr key={r.id} className={r.abnormalFlag ? 'bg-red-50/50' : ''}>
                              <td className="p-2.5 font-semibold text-slate-900">{r.parameter}</td>
                              <td className={`p-2.5 font-bold ${r.abnormalFlag ? 'text-red-600' : 'text-slate-800'}`}>
                                {r.value} {r.unit}
                              </td>
                              <td className="p-2.5 text-slate-500">{r.referenceRange}</td>
                              <td className="p-2.5 text-right">
                                {r.abnormalFlag ? (
                                  <span className="px-2 py-0.5 bg-red-100 text-red-700 font-bold rounded text-[10px]">
                                    ⚠️ ABNORMAL
                                  </span>
                                ) : (
                                  <span className="text-emerald-600 font-semibold">Normal</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end pt-1">
                      <a href={lab.fileUrl} target="_blank" rel="noreferrer">
                        <button className="text-sky-700 font-semibold hover:underline flex items-center gap-1">
                          <Download className="w-3.5 h-3.5" /> Download Full Diagnostic PDF
                        </button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
