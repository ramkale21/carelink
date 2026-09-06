'use client';

import React, { useState, useEffect } from 'react';
import { ClinicalSidebar } from '../../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { pharmacyService } from '../../../services';
import { InventoryItem } from '../../../types';
import { AlertTriangle } from 'lucide-react';

export default function PharmacyLowStockPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    pharmacyService.getInventory('pharm-1').then((items) => {
      setInventory(items.filter((i) => i.isLowStock || i.quantity < 30));
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="PHARMACIST" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="PHARMACIST" title="Urgent Reorder & Low Stock Alerts" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-4xl">
            <div className="p-4 bg-red-600 text-white rounded-xl shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <h2 className="font-bold text-sm">Low Stock SKUs Requiring Reorder</h2>
              </div>
              <span className="text-xs font-mono bg-red-800 px-2.5 py-1 rounded">{inventory.length} Alert Items</span>
            </div>

            <div className="space-y-3">
              {inventory.map((item) => (
                <Card key={item.id} className="border-red-300 bg-red-50/20">
                  <CardContent className="p-4 flex justify-between items-center text-xs">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{item.medicineName}</h3>
                      <p className="text-slate-500">Category: {item.category} • Batch: {item.batchNumber}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-red-700 text-sm block">Qty: {item.quantity} Remaining</span>
                      <Button size="sm" className="mt-1">Reorder Stock</Button>
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
