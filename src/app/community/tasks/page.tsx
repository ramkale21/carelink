'use client';

import React from 'react';
import { CommunityHeader } from '../../../components/layout/CommunityHeader';
import { CommunityBottomNav } from '../../../components/layout/CommunityBottomNav';
import { DemoRoleSwitcher } from '../../../components/layout/DemoRoleSwitcher';
import { Card, CardContent } from '../../../components/ui/Card';
import { CheckSquare } from 'lucide-react';

const TASKS = [
  { id: 't1', task: 'Distribute ORS pouches to 5 households in Anandpur', done: true },
  { id: 't2', task: 'Verify maternal vaccination records for Sunita More', done: false },
  { id: 't3', task: 'Submit weekly NCD screening report to PHC Khed MO', done: false },
];

export default function CommunityTasksPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      <DemoRoleSwitcher />
      <CommunityHeader title="Daily Field Tasks Checklist" isWorker />

      <main className="flex-1 p-4 max-w-3xl mx-auto w-full space-y-6">
        <h2 className="text-base font-bold text-slate-900">Today's Field Action Items</h2>

        <div className="space-y-3">
          {TASKS.map((t) => (
            <Card key={t.id}>
              <CardContent className="p-4 flex items-center gap-3 text-xs">
                <input type="checkbox" defaultChecked={t.done} className="w-4 h-4 text-teal-600 rounded" />
                <span className={t.done ? 'line-through text-slate-400 font-medium' : 'font-bold text-slate-900'}>
                  {t.task}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <CommunityBottomNav isWorker />
    </div>
  );
}
