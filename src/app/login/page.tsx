'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { UserRole } from '@/types';
import { HeartPulse, Lock, Phone, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('+91 98765 43210');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<UserRole>('PATIENT');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      switch (role) {
        case 'PATIENT':
          router.push('/patient');
          break;
        case 'DOCTOR':
          router.push('/doctor');
          break;
        case 'HOSPITAL_ADMIN':
          router.push('/hospital');
          break;
        case 'PHARMACIST':
          router.push('/pharmacy');
          break;
        case 'ASHA':
        case 'ANM':
        case 'CHO':
          router.push(`/community?role=${role}`);
          break;
        case 'SUPER_ADMIN':
          router.push('/admin');
          break;
        default:
          router.push('/patient');
      }
    }, 600);
  };

  const loginAsPreset = (targetRole: UserRole, targetRoute: string) => {
    setRole(targetRole);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push(targetRoute);
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DemoRoleSwitcher />
      <PublicHeader />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="text-center bg-slate-50/50 pb-4">
              <div className="w-12 h-12 bg-sky-600 text-white rounded-xl flex items-center justify-center mx-auto mb-2 shadow-xs">
                <HeartPulse className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl">Sign in to CareLink</CardTitle>
              <p className="text-xs text-slate-500">Integrated Healthcare Access Platform</p>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <Select
                  label="Select User Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  options={[
                    { value: 'PATIENT', label: 'Patient / Community Member' },
                    { value: 'DOCTOR', label: 'Doctor / Medical Officer' },
                    { value: 'HOSPITAL_ADMIN', label: 'Hospital Administrator' },
                    { value: 'PHARMACIST', label: 'Pharmacist' },
                    { value: 'ASHA', label: 'ASHA Field Worker' },
                    { value: 'ANM', label: 'ANM Health Worker' },
                    { value: 'CHO', label: 'Community Health Officer (CHO)' },
                    { value: 'SUPER_ADMIN', label: 'Super Admin' },
                  ]}
                />

                <Input
                  label="Mobile Number"
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-1.5 text-slate-600">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-sky-600" />
                    Remember me
                  </label>
                  <Link href="/forgot-password" className="text-sky-600 hover:underline font-semibold">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" isLoading={isLoading} className="w-full">
                  Sign In to Dashboard
                </Button>
              </form>

              {/* SIH Quick Evaluator Presets */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700">
                  <Sparkles className="w-4 h-4 text-sky-500" /> 1-Click SIH Demo Role Presets:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => loginAsPreset('PATIENT', '/patient')}
                    className="p-2 bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-800 rounded border border-slate-200 text-left font-medium transition-colors cursor-pointer"
                  >
                    👤 Patient Role
                  </button>
                  <button
                    onClick={() => loginAsPreset('DOCTOR', '/doctor')}
                    className="p-2 bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-800 rounded border border-slate-200 text-left font-medium transition-colors cursor-pointer"
                  >
                    🩺 Doctor Role
                  </button>
                  <button
                    onClick={() => loginAsPreset('ASHA', '/community?role=ASHA')}
                    className="p-2 bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-800 rounded border border-slate-200 text-left font-medium transition-colors cursor-pointer"
                  >
                    ❤️ ASHA Worker
                  </button>
                  <button
                    onClick={() => loginAsPreset('HOSPITAL_ADMIN', '/hospital')}
                    className="p-2 bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-800 rounded border border-slate-200 text-left font-medium transition-colors cursor-pointer"
                  >
                    🏥 Hospital Admin
                  </button>
                </div>
              </div>

              <div className="text-center pt-2 text-xs text-slate-500">
                Don't have an account?{' '}
                <Link href="/register" className="text-sky-600 font-bold hover:underline">
                  Register now
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
