'use client';

import React from 'react';
import { CommunityHeader } from '@/components/layout/CommunityHeader';
import { CommunityBottomNav } from '@/components/layout/CommunityBottomNav';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { PhoneCall, MapPin, Navigation, AlertTriangle, ShieldAlert, Building2 } from 'lucide-react';

export default function PatientEmergencyPage() {
  return (
    <div className="min-h-screen bg-red-950 text-white flex flex-col pb-20 md:pb-8">
      <DemoRoleSwitcher />
      <header className="bg-red-900 px-4 py-3 border-b border-red-800 flex items-center justify-between">
        <h1 className="text-lg font-extrabold flex items-center gap-2">
          <PhoneCall className="w-5 h-5 animate-pulse text-red-400" /> 108 EMERGENCY SOS
        </h1>
        <span className="px-2.5 py-0.5 bg-red-800 text-red-200 text-xs font-mono font-bold rounded">
          HIGH PRIORITY
        </span>
      </header>

      <main className="flex-1 p-4 max-w-xl mx-auto w-full space-y-6">
        {/* Giant Emergency Call Button */}
        <div className="text-center py-6 space-y-4">
          <a href="tel:108" className="inline-block w-full">
            <button className="w-full py-6 bg-red-600 hover:bg-red-500 text-white font-extrabold text-2xl rounded-2xl shadow-2xl border-4 border-red-400 flex items-center justify-center gap-3 animate-pulse-glow cursor-pointer">
              <PhoneCall className="w-8 h-8 animate-bounce" /> CALL 108 AMBULANCE NOW
            </button>
          </a>
          <p className="text-xs text-red-200">Free 24/7 Government Medical Emergency Helpline</p>
        </div>

        {/* Current GPS Coordinates Card */}
        <Card className="bg-red-900/60 border-red-800 text-white">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-red-300 font-semibold uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-4 h-4 text-red-400" /> Your Location Telemetry
              </span>
              <span className="text-emerald-400 font-bold text-[10px]">GPS Fixed</span>
            </div>
            <p className="text-sm font-bold text-white">House #42, Main Bajar, Khed Village, Pune, MH</p>
            <p className="text-[11px] font-mono text-red-300">Lat: 18.8471° N | Long: 73.9056° E</p>
          </CardContent>
        </Card>

        {/* Nearest Emergency Center Card */}
        <Card className="bg-red-900/60 border-red-800 text-white">
          <CardContent className="p-4 space-y-3">
            <span className="text-xs text-red-300 font-semibold uppercase tracking-wider block">
              Nearest 24/7 Emergency Facility
            </span>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-extrabold text-base text-white">Community Health Centre (CHC) Manchar</h3>
                <p className="text-xs text-red-200">NH-60 Bypass Road, Manchar (14.8 km)</p>
                <p className="text-xs text-emerald-400 font-bold mt-1">✓ Trauma Care & ICU Beds Available</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <a href="tel:+912133224410" className="w-full">
                <Button variant="danger" size="md" className="w-full">
                  <PhoneCall className="w-4 h-4 mr-1.5" /> Call CHC Desk
                </Button>
              </a>
              <a
                href="https://maps.google.com/?q=19.0022,73.9431"
                target="_blank"
                rel="noreferrer"
                className="w-full"
              >
                <Button variant="outline" size="md" className="w-full text-white border-red-400 hover:bg-red-800">
                  <Navigation className="w-4 h-4 mr-1.5" /> Get Directions
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </main>

      <CommunityBottomNav />
    </div>
  );
}
