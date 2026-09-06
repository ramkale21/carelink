'use client';

import React, { useState, useEffect } from 'react';
import { DemoRoleSwitcher } from '../../components/layout/DemoRoleSwitcher';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { notificationService } from '../../services';
import { Notification } from '../../types';
import { Bell, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>([]);

  useEffect(() => {
    notificationService.getNotifications('all').then(setNotifs);
  }, []);

  const handleRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoRoleSwitcher />
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-sky-600" />
          <h1 className="text-lg font-bold text-slate-900">CareLink Notification Center</h1>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </Link>
      </header>

      <main className="flex-1 p-6 max-w-2xl mx-auto w-full space-y-4">
        {notifs.map((n) => (
          <Card key={n.id} className={!n.isRead ? 'border-sky-300 bg-sky-50/30' : ''}>
            <CardContent className="p-4 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-sky-700">{n.type}</span>
                <h3 className="font-bold text-slate-900 text-sm">{n.title}</h3>
                <p className="text-slate-600">{n.message}</p>
                <span className="text-[10px] text-slate-400 block pt-1">{new Date(n.createdAt).toLocaleString()}</span>
              </div>

              {!n.isRead && (
                <Button size="sm" variant="ghost" onClick={() => handleRead(n.id)}>
                  Mark Read
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}
