'use client';

import React, { useState, useEffect } from 'react';
import { ClinicalSidebar } from '../../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { pharmacyService } from '../../../services';
import { PrescriptionOrder } from '../../../types';
import { ClipboardList, PackageCheck } from 'lucide-react';

export default function PharmacyOrdersPage() {
  const [orders, setOrders] = useState<PrescriptionOrder[]>([]);

  useEffect(() => {
    pharmacyService.getOrders('pharm-1').then(setOrders);
  }, []);

  const handleDispense = async (id: string) => {
    await pharmacyService.dispenseOrder(id);
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: 'DISPENSED' } : o)));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="PHARMACIST" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="PHARMACIST" title="Prescription Dispensing Orders Queue" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-4xl">
            <h2 className="text-base font-bold text-slate-900">Dispensing Queue</h2>

            <div className="space-y-3">
              {orders.map((ord) => (
                <Card key={ord.id}>
                  <CardContent className="p-4 flex justify-between items-center text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">{ord.patientName}</h3>
                        <StatusBadge status={ord.status} />
                      </div>
                      <p className="text-slate-500">Doctor: {ord.doctorName} • Date: {new Date(ord.orderDate).toLocaleDateString()}</p>
                    </div>

                    {ord.status === 'PENDING' && (
                      <Button size="sm" variant="teal" onClick={() => handleDispense(ord.id)}>
                        <PackageCheck className="w-4 h-4 mr-1" /> Mark Dispensed
                      </Button>
                    )}
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
