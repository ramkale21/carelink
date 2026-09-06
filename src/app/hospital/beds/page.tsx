'use client';

import React, { useState, useEffect } from 'react';
import { ClinicalSidebar } from '../../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { hospitalService } from '../../../services';
import { BedCategory } from '../../../types';
import { BedDouble, Plus, Minus, CheckCircle2 } from 'lucide-react';

export default function HospitalBedsPage() {
  const [beds, setBeds] = useState<BedCategory[]>([]);

  useEffect(() => {
    hospitalService.getBedCapacities('hosp-1').then(setBeds);
  }, []);

  const adjustBedCount = async (category: BedCategory['category'], delta: number) => {
    const target = beds.find((b) => b.category === category);
    if (!target) return;

    const newAvail = Math.max(0, target.available + delta);
    const newOcc = Math.max(0, target.occupied - delta);

    const updated = await hospitalService.updateBedCapacity('hosp-1', category, {
      available: newAvail,
      occupied: newOcc,
    });
    setBeds([...updated]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="HOSPITAL_ADMIN" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="HOSPITAL_ADMIN" title="Bed Capacity & Ward Management" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-5xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-slate-900">Bed Occupancy Matrix</h2>
                <p className="text-xs text-slate-500">Live ward capacity broadcasted to regional emergency network.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {beds.map((b) => {
                const occupancyPct = ((b.occupied / b.total) * 100).toFixed(0);

                return (
                  <Card key={b.category} className="border-slate-200">
                    <CardHeader className="py-3 bg-slate-50 flex justify-between items-center">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <BedDouble className="w-4 h-4 text-sky-600" /> {b.category} Ward
                      </CardTitle>
                      <span className="text-xs font-mono font-bold text-slate-600">Total: {b.total} Beds</span>
                    </CardHeader>

                    <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                          <span className="text-[10px] text-emerald-700 font-bold block">Available</span>
                          <span className="text-base font-extrabold text-emerald-900">{b.available}</span>
                        </div>
                        <div className="bg-sky-50 p-2 rounded-lg border border-sky-200">
                          <span className="text-[10px] text-sky-700 font-bold block">Occupied</span>
                          <span className="text-base font-extrabold text-sky-900">{b.occupied}</span>
                        </div>
                        <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">
                          <span className="text-[10px] text-amber-700 font-bold block">Reserved</span>
                          <span className="text-base font-extrabold text-amber-900">{b.reserved}</span>
                        </div>
                        <div className="bg-slate-100 p-2 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-600 font-bold block">Maint.</span>
                          <span className="text-base font-extrabold text-slate-800">{b.maintenance}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                          <span>Occupancy Rate</span>
                          <span>{occupancyPct}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-sky-600 h-2 rounded-full" style={{ width: `${occupancyPct}%` }} />
                        </div>
                      </div>

                      {/* Quick Adjust Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-xs font-semibold text-slate-500">Quick Availability Adjust:</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => adjustBedCount(b.category, -1)}>
                            <Minus className="w-3.5 h-3.5" /> Discharge Patient
                          </Button>
                          <Button size="sm" onClick={() => adjustBedCount(b.category, 1)}>
                            <Plus className="w-3.5 h-3.5" /> Admit Patient
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
