'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@/types';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  FileText,
  Share2,
  Activity,
  BedDouble,
  Building2,
  Pill,
  ShieldCheck,
  HeartPulse,
  BarChart3,
  Settings,
  ClipboardList,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export const ClinicalSidebar: React.FC<{ role: UserRole }> = ({ role }) => {
  const pathname = usePathname();

  const doctorNav: SidebarItem[] = [
    { label: 'Dashboard', href: '/doctor', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Live Queue', href: '/doctor/queue', icon: <Clock className="w-4 h-4" /> },
    { label: 'Patients', href: '/doctor/patients', icon: <Users className="w-4 h-4" /> },
    { label: 'Consultation Workspace', href: '/doctor/consultation', icon: <Activity className="w-4 h-4" /> },
    { label: 'E-Prescriptions', href: '/doctor/prescriptions', icon: <Pill className="w-4 h-4" /> },
    { label: 'Lab Analyzer', href: '/doctor/lab-reports', icon: <FileText className="w-4 h-4" /> },
    { label: 'Referrals Dispatch', href: '/doctor/referrals', icon: <Share2 className="w-4 h-4" /> },
    { label: 'Schedule Config', href: '/doctor/availability', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Clinical Analytics', href: '/doctor/analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const hospitalNav: SidebarItem[] = [
    { label: 'Dashboard', href: '/hospital', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Patient Directory', href: '/hospital/patients', icon: <Users className="w-4 h-4" /> },
    { label: 'Doctors Roster', href: '/hospital/doctors', icon: <HeartPulse className="w-4 h-4" /> },
    { label: 'Appointments Calendar', href: '/hospital/appointments', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Central Queue Monitor', href: '/hospital/queue', icon: <Clock className="w-4 h-4" /> },
    { label: 'Bed Capacity Matrix', href: '/hospital/beds', icon: <BedDouble className="w-4 h-4" /> },
    { label: 'Departments', href: '/hospital/departments', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Regional Referrals', href: '/hospital/referrals', icon: <Share2 className="w-4 h-4" /> },
    { label: 'Facility Analytics', href: '/hospital/analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const pharmacyNav: SidebarItem[] = [
    { label: 'Dashboard', href: '/pharmacy', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Dispensing Queue', href: '/pharmacy/orders', icon: <ClipboardList className="w-4 h-4" /> },
    { label: 'Medicine Inventory', href: '/pharmacy/inventory', icon: <Pill className="w-4 h-4" /> },
    { label: 'Low Stock Alerts', href: '/pharmacy/low-stock', icon: <Activity className="w-4 h-4" /> },
    { label: 'Inventory Analytics', href: '/pharmacy/analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const adminNav: SidebarItem[] = [
    { label: 'Governance', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'User Directory', href: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { label: 'Facilities List', href: '/admin/facilities', icon: <Building2 className="w-4 h-4" /> },
    { label: 'System Audit Logs', href: '/admin/audit-logs', icon: <ShieldCheck className="w-4 h-4" /> },
    { label: 'Infrastructure Health', href: '/admin/system-health', icon: <Activity className="w-4 h-4" /> },
  ];

  const choNav: SidebarItem[] = [
    { label: 'PHC Overview', href: '/community?role=CHO', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Village Patients', href: '/community/patients', icon: <Users className="w-4 h-4" /> },
    { label: 'Screening Triage', href: '/community/screening', icon: <Activity className="w-4 h-4" /> },
    { label: 'Follow-ups Log', href: '/community/follow-ups', icon: <Clock className="w-4 h-4" /> },
    { label: 'Facility Referrals', href: '/community/referrals', icon: <Share2 className="w-4 h-4" /> },
  ];

  let items = doctorNav;
  if (role === 'HOSPITAL_ADMIN') items = hospitalNav;
  if (role === 'PHARMACIST') items = pharmacyNav;
  if (role === 'SUPER_ADMIN') items = adminNav;
  if (role === 'CHO') items = choNav;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 min-h-screen">
      <div className="p-4 border-b border-slate-800 flex items-center gap-2">
        <div className="p-1.5 bg-sky-600 text-white rounded-md">
          <HeartPulse className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-white tracking-tight">CareLink</h2>
          <span className="text-[10px] text-sky-400 font-semibold uppercase tracking-wider block">
            {role.replace('_', ' ')} PORTAL
          </span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-sky-600 text-white shadow-xs font-bold'
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <Link
          href="/profile"
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Profile & Settings</span>
        </Link>
      </div>
    </aside>
  );
};
