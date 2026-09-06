'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserRole } from '@/types';
import { UserCheck, ShieldAlert, Stethoscope, Building2, Pill, HeartPulse, User } from 'lucide-react';

interface RoleOption {
  role: UserRole;
  label: string;
  route: string;
  icon: React.ReactNode;
}

const ROLES: RoleOption[] = [
  { role: 'PATIENT', label: 'Patient', route: '/patient', icon: <User className="w-3.5 h-3.5" /> },
  { role: 'DOCTOR', label: 'Doctor', route: '/doctor', icon: <Stethoscope className="w-3.5 h-3.5" /> },
  { role: 'HOSPITAL_ADMIN', label: 'Hospital', route: '/hospital', icon: <Building2 className="w-3.5 h-3.5" /> },
  { role: 'PHARMACIST', label: 'Pharmacy', route: '/pharmacy', icon: <Pill className="w-3.5 h-3.5" /> },
  { role: 'ASHA', label: 'ASHA', route: '/community?role=ASHA', icon: <HeartPulse className="w-3.5 h-3.5" /> },
  { role: 'ANM', label: 'ANM', route: '/community?role=ANM', icon: <UserCheck className="w-3.5 h-3.5" /> },
  { role: 'CHO', label: 'CHO', route: '/community?role=CHO', icon: <Stethoscope className="w-3.5 h-3.5" /> },
  { role: 'SUPER_ADMIN', label: 'Admin', route: '/admin', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
];

export const DemoRoleSwitcher: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="bg-slate-900 text-white text-xs py-1.5 px-4 flex items-center justify-between overflow-x-auto border-b border-slate-800 shrink-0 sticky top-0 z-50">
      <div className="flex items-center gap-2 shrink-0">
        <span className="font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          SIH DEMO MODE:
        </span>
        <span className="text-slate-400 hidden md:inline">Switch Active Ecosystem Role:</span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto py-0.5">
        {ROLES.map((r) => {
          const isActive = pathname.startsWith(r.route.split('?')[0]);
          return (
            <button
              key={r.role}
              onClick={() => router.push(r.route)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                isActive
                  ? 'bg-sky-600 text-white font-bold shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {r.icon}
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
