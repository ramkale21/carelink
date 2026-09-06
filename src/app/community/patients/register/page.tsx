'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CommunityHeader } from '../../../../components/layout/CommunityHeader';
import { CommunityBottomNav } from '../../../../components/layout/CommunityBottomNav';
import { DemoRoleSwitcher } from '../../../../components/layout/DemoRoleSwitcher';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Input, Select } from '../../../../components/ui/Input';
import { patientService } from '../../../../services';
import { CheckCircle2, UserPlus, ArrowRight } from 'lucide-react';

export default function RegisterVillagePatientPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState(35);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [village, setVillage] = useState('Anandpur');
  const [district, setDistrict] = useState('Pune');
  const [history, setHistory] = useState('Gestational hypertension');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await patientService.registerPatient({
        name,
        phone,
        age,
        gender,
        bloodGroup,
        village,
        district,
        state: 'Maharashtra',
        medicalHistory: [history],
        currentRisk: 'MEDIUM',
      });
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/community/patients');
      }, 1500);
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      <DemoRoleSwitcher />
      <CommunityHeader title="Register Village Resident" isWorker />

      <main className="flex-1 p-4 max-w-xl mx-auto w-full space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            {isSuccess ? (
              <div className="py-8 text-center space-y-3 animate-fade-in">
                <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto" />
                <h2 className="text-xl font-bold text-slate-900">Patient Registered Successfully!</h2>
                <p className="text-xs text-slate-600">Saved to local field storage and synced with PHC database.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Full Name" placeholder="e.g. Sunita More" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input label="Mobile Number" placeholder="+91 98000 00000" value={phone} onChange={(e) => setPhone(e.target.value)} required />

                <div className="grid grid-cols-2 gap-3">
                  <Input label="Age (Years)" type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} required />
                  <Select
                    label="Gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    options={[
                      { value: 'Female', label: 'Female' },
                      { value: 'Male', label: 'Male' },
                      { value: 'Other', label: 'Other' },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input label="Village Name" value={village} onChange={(e) => setVillage(e.target.value)} required />
                  <Input label="District" value={district} onChange={(e) => setDistrict(e.target.value)} required />
                </div>

                <Input label="Known Medical History / Notes" value={history} onChange={(e) => setHistory(e.target.value)} />

                <Button type="submit" isLoading={isLoading} variant="teal" className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" /> Save Village Record
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>

      <CommunityBottomNav isWorker />
    </div>
  );
}
