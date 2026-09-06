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
import { HeartPulse, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('PATIENT');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('Pune');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DemoRoleSwitcher />
      <PublicHeader />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-lg space-y-6">
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="text-center bg-slate-50/50 pb-4">
              <div className="w-12 h-12 bg-sky-600 text-white rounded-xl flex items-center justify-center mx-auto mb-2 shadow-xs">
                <HeartPulse className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl">Register for CareLink</CardTitle>
              <p className="text-xs text-slate-500">Join the Integrated Public Healthcare Network</p>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              {isSubmitted ? (
                <div className="py-8 text-center space-y-3 animate-fade-in">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="font-bold text-lg text-slate-900">Registration Successful!</h3>
                  <p className="text-xs text-slate-600">Redirecting to login portal...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Select
                    label="I am registering as"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    options={[
                      { value: 'PATIENT', label: 'Patient / Citizen' },
                      { value: 'DOCTOR', label: 'Doctor / Medical Specialist' },
                      { value: 'ASHA', label: 'ASHA Field Worker' },
                      { value: 'ANM', label: 'ANM Health Worker' },
                      { value: 'CHO', label: 'Community Health Officer' },
                      { value: 'PHARMACIST', label: 'Pharmacist' },
                      { value: 'HOSPITAL_ADMIN', label: 'Hospital Administrator' },
                    ]}
                  />

                  <Input label="Full Name" placeholder="e.g. Sunita More" value={name} onChange={(e) => setName(e.target.value)} required />
                  <Input label="Mobile Number" placeholder="+91 98000 00000" value={phone} onChange={(e) => setPhone(e.target.value)} required />

                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Village / Location" placeholder="e.g. Khed" value={village} onChange={(e) => setVillage(e.target.value)} />
                    <Input label="District" value={district} onChange={(e) => setDistrict(e.target.value)} />
                  </div>

                  <Input label="Password" type="password" placeholder="••••••••" required />

                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </form>
              )}

              <div className="text-center pt-2 text-xs text-slate-500">
                Already have an account?{' '}
                <Link href="/login" className="text-sky-600 font-bold hover:underline">
                  Sign In
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
