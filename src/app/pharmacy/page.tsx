'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClinicalSidebar } from '../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../components/layout/DemoRoleSwitcher';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { pharmacyService } from '../../services';
import { PrescriptionOrder, InventoryItem } from '../../types';
import { Pill, AlertTriangle, ClipboardList, PackageCheck } from 'lucide-react';

export default function PharmacyDashboardPage() {
  const [orders, setOrders] = useState<PrescriptionOrder[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    pharmacyService.getOrders('pharm-1').then(setOrders);
    pharmacyService.getInventory('pharm-1').then(setInventory);
  }, []);

  const pendingOrders = orders.filter((o) => o.status === 'PENDING');
  const lowStockItems = inventory.filter((i) => i.isLowStock || i.quantity < 30);

  const handleDispense = async (orderId: string) => {
    await pharmacyService.dispenseOrder(orderId);
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: 'DISPENSED' } : o)));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="PHARMACIST" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="PHARMACIST" title="Pharmacy & Stock Management" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-5xl">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Pending Orders</span>
                    <span className="text-2xl font-extrabold text-amber-600">{pendingOrders.length} Orders</span>
                  </div>
                  <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Low Stock Medicines</span>
                    <span className="text-2xl font-extrabold text-red-600">{lowStockItems.length} Warnings</span>
                  </div>
                  <div className="p-3 bg-red-100 text-red-700 rounded-xl">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Inventory SKUs</span>
                    <span className="text-2xl font-extrabold text-slate-900">{inventory.length} Medicines</span>
                  </div>
                  <div className="p-3 bg-sky-100 text-sky-700 rounded-xl">
                    <Pill className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Dispensing Queue */}
            <Card>
              <CardHeader className="py-3 flex justify-between items-center">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-purple-600" /> Pending Dispensing Queue
                </CardTitle>
                <Link href="/pharmacy/orders">
                  <Button variant="outline" size="sm">View All Orders</Button>
                </Link>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{ord.patientName}</h4>
                        <StatusBadge status={ord.status} />
                      </div>
                      <p className="text-slate-500 mt-0.5">Doctor: {ord.doctorName} ({ord.hospitalName})</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {ord.medicines.map((m, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-purple-50 text-purple-800 font-semibold rounded text-[10px]">
                            {m.medicineName} ({m.duration})
                          </span>
                        ))}
                      </div>
                    </div>

                    {ord.status === 'PENDING' && (
                      <Button size="sm" variant="teal" onClick={() => handleDispense(ord.id)} className="shrink-0">
                        <PackageCheck className="w-4 h-4 mr-1" /> Dispense Medication
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
