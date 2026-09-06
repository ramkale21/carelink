'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Stethoscope, FileText, Share2, User, Users, ClipboardCheck, PhoneCall } from 'lucide-react';

interface BottomNavProps {
  isWorker?: boolean;
}

export const CommunityBottomNav: React.FC<BottomNavProps> = ({ isWorker = false }) => {
  const pathname = usePathname();

  const patientTabs = [
    { label: 'Home', href: '/patient', icon: <Home className="w-5 h-5" /> },
    { label: 'Symptoms', href: '/patient/symptoms', icon: <Stethoscope className="w-5 h-5" /> },
    { label: 'Emergency', href: '/patient/emergency', icon: <PhoneCall className="w-5 h-5 text-red-600" /> },
    { label: 'Records', href: '/patient/records', icon: <FileText className="w-5 h-5" /> },
    { label: 'Referrals', href: '/patient/referrals', icon: <Share2 className="w-5 h-5" /> },
  ];

  const workerTabs = [
    { label: 'Dashboard', href: '/community', icon: <Home className="w-5 h-5" /> },
    { label: 'Patients', href: '/community/patients', icon: <Users className="w-5 h-5" /> },
    { label: 'Screening', href: '/community/screening', icon: <ClipboardCheck className="w-5 h-5" /> },
    { label: 'Follow-ups', href: '/community/follow-ups', icon: <FileText className="w-5 h-5" /> },
    { label: 'Profile', href: '/profile', icon: <User className="w-5 h-5" /> },
  ];

  const tabs = isWorker ? workerTabs : patientTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-2 py-1 flex items-center justify-around shadow-lg md:hidden">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
              isActive ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.icon}
            <span className="mt-0.5">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export const CommunityHeader: React.FC<{ title: string; isWorker?: boolean }> = ({ title, isWorker = false }) => {
  return (
    <header className="bg-sky-700 text-white px-4 py-3 sticky top-0 z-30 flex items-center justify-between shadow-xs">
      <div>
        <span className="text-[10px] uppercase font-bold text-sky-200 tracking-wider block">
          {isWorker ? 'COMMUNITY HEALTH WORKER PORTAL' : 'PATIENT HEALTHCARE PORTAL'}
        </span>
        <h1 className="text-base font-bold leading-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/patient/emergency"
          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs animate-pulse-glow flex items-center gap-1"
        >
          <span>108 SOS</span>
        </Link>
      </div>
    </header>
  );
};
