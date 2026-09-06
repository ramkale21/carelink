'use client';

import React, { useState, useEffect } from 'react';
import { ClinicalSidebar } from '../../../components/layout/ClinicalSidebar';
import { ClinicalTopBar } from '../../../components/layout/ClinicalTopBar';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { pharmacyService } from '../../../services';
import { InventoryItem } from '../../../types';
import { Pill, Plus, AlertTriangle } from 'lucide-react';

export default function PharmacyInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [medName, setMedName] = useState('');
  const [category, setCategory] = useState('Analgesic');
  const [quantity, setQuantity] = useState(100);
  const [batch, setBatch] = useState('PCM-2026-10');
  const [price, setPrice] = useState(25.0);

  useEffect(() => {
    pharmacyService.getInventory('pharm-1').then(setInventory);
  }, []);

  const handleStockUpdate = async (id: string, currentQty: number, delta: number) => {
    const newQty = Math.max(0, currentQty + delta);
    const updated = await pharmacyService.updateStock(id, newQty);
    setInventory(inventory.map((i) => (i.id === id ? updated : i)));
  };

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = await pharmacyService.addInventoryItem({
      pharmacyId: 'pharm-1',
      medicineId: `med-${Date.now()}`,
      medicineName: medName,
      category,
      quantity,
      batchNumber: batch,
      expiryDate: '2027-12-31',
      price,
    });
    setInventory([newItem, ...inventory]);
    setIsModalOpen(false);
    setMedName('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <div className="flex flex-1">
        <ClinicalSidebar role="PHARMACIST" />

        <div className="flex-1 flex flex-col min-w-0">
          <ClinicalTopBar role="PHARMACIST" title="Medicine Inventory Manager" />

          <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-5xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Essential Drug Inventory</h2>
                <p className="text-xs text-slate-500">Track batch numbers, expiry dates & stock thresholds.</p>
              </div>
              <Button size="sm" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1" /> Add New Medicine
              </Button>
            </div>

            <div className="space-y-3">
              {inventory.map((item) => (
                <Card key={item.id} className={item.isLowStock ? 'border-red-300 bg-red-50/20' : ''}>
                  <CardContent className="p-4 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{item.medicineName}</h4>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded text-[10px]">
                          {item.category}
                        </span>
                        {item.isLowStock && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 font-bold rounded text-[10px] flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> LOW STOCK
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 mt-1">Batch: {item.batchNumber} • Expiry: {item.expiryDate} • Price: ₹{item.price}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 text-sm">Qty: {item.quantity}</span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleStockUpdate(item.id, item.quantity, -10)}>
                          -10
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleStockUpdate(item.id, item.quantity, 50)}>
                          +50
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>

          {/* Add Medicine Modal */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Stock Item">
            <form onSubmit={handleAddMedicine} className="space-y-4 text-xs">
              <Input label="Medicine Name" placeholder="e.g. Ciprofloxacin 500mg" value={medName} onChange={(e) => setMedName(e.target.value)} required />
              <Input label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
              <div className="grid grid-cols-3 gap-2">
                <Input label="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
                <Input label="Batch #" value={batch} onChange={(e) => setBatch(e.target.value)} />
                <Input label="Price (₹)" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
              </div>
              <Button type="submit" className="w-full">Save Stock Item</Button>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
}
