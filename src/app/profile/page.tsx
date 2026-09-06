'use client';

import React from 'react';
import { DemoRoleSwitcher } from '../../components/layout/DemoRoleSwitcher';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { User, Settings, ShieldCheck, Globe, Phone } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-900">User Profile & Account Settings</h1>
        <Link href="/">
          <Button variant="outline" size="sm">Back to Home</Button>
        </Link>
      </header>

      <main className="flex-1 p-6 max-w-2xl mx-auto w-full space-y-6">
        <Card>
          <CardHeader className="py-4 bg-slate-50 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-sky-700 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              RP
            </div>
            <div>
              <CardTitle className="text-base">Ravi Patil</CardTitle>
              <p className="text-xs text-slate-500">Patient & Citizen Account • Khed Village</p>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Phone Number:</span>
                <span className="font-bold text-slate-900">+91 98765 43210</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Preferred Language:</span>
                <span className="font-bold text-slate-900">English (EN) / Hindi (HI)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Emergency Contact:</span>
                <span className="font-bold text-slate-900">+91 98765 43211 (Brother)</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">ABDM Health ID (ABHA):</span>
                <span className="font-mono font-bold text-sky-700">91-4401-2041-8892</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
