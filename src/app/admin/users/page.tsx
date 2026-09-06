'use client';

import React from 'react';
import { ClinicalSidebar } from '../../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Users } from 'lucide-react';

const MOCK_USERS = [
  { id: '1', name: 'Ravi Patil', phone: '+91 98765 43210', role: 'PATIENT', status: 'ACTIVE' },
  { id: '2', name: 'Dr. Anand Deshmukh', phone: '+91 98220 11223', role: 'DOCTOR', status: 'ACTIVE' },
  { id: '3', name: 'Sangeeta Gaikwad', phone: '+91 94220 55667', role: 'ASHA', status: 'ACTIVE' },
  { id: '4', name: 'Khed PHC Pharmacist', phone: '+91 91234 56789', role: 'PHARMACIST', status: 'ACTIVE' },
];

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="SUPER_ADMIN" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="SUPER_ADMIN" title="Multi-Role User Directory" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-4xl">
            <h2 className="text-base font-bold text-slate-900">User Management</h2>

            <div className="space-y-3">
              {MOCK_USERS.map((u) => (
                <Card key={u.id}>
                  <CardContent className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{u.name}</h4>
                      <p className="text-slate-500">Phone: {u.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-sky-50 text-sky-700 font-bold rounded border border-sky-200 uppercase">
                        {u.role}
                      </span>
                      <StatusBadge status={u.status} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
