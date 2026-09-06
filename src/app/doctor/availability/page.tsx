'use client';

import React, { useState } from 'react';
import { ClinicalSidebar } from '../../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';

export default function DoctorAvailabilityPage() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [slotDuration, setSlotDuration] = useState('15');
  const [maxPatients, setMaxPatients] = useState('30');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="DOCTOR" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="DOCTOR" title="Schedule & Availability Configurator" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-xl">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-600" /> OPD Consultation Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {saved && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Schedule configurations updated successfully!
                  </div>
                )}

                <form onSubmit={handleSave} className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                    <div>
                      <span className="font-bold text-slate-900 block">Available For Duty Today</span>
                      <span className="text-slate-500 text-[11px]">Accepting new OPD appointment bookings</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="w-5 h-5 rounded text-sky-600 cursor-pointer"
                    />
                  </div>

                  <Input label="Slot Duration (Minutes)" value={slotDuration} onChange={(e) => setSlotDuration(e.target.value)} />
                  <Input label="Max Daily Patients Limit" value={maxPatients} onChange={(e) => setMaxPatients(e.target.value)} />

                  <Button type="submit" className="w-full">
                    Save Schedule Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
