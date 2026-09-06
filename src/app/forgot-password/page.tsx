'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { KeyRound, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
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
                <KeyRound className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl">Reset Password</CardTitle>
              <p className="text-xs text-slate-500">We will send an OTP reset code to your registered phone number</p>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              {sent ? (
                <div className="py-6 text-center space-y-3">
                  <div className="p-3 bg-emerald-100 text-emerald-700 rounded-full inline-block">✓</div>
                  <h4 className="font-bold text-slate-900 text-base">OTP Sent!</h4>
                  <p className="text-xs text-slate-600">Please check SMS on {phone || 'your phone'} to complete password recovery.</p>
                  <Link href="/login" className="inline-block pt-2">
                    <Button variant="outline" size="sm">Back to Login</Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Registered Mobile Number"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full">
                    Send Recovery OTP
                  </Button>
                </form>
              )}

              <div className="text-center pt-2">
                <Link href="/login" className="text-xs text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
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
