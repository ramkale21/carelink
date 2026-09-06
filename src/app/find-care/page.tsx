'use client';

import React, { useState, useEffect } from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { DemoRoleSwitcher } from '@/components/layout/DemoRoleSwitcher';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { hospitalService } from '@/services';
import { Hospital } from '@/types';
import { MapPin, Phone, Building2, BedDouble, AlertCircle, Navigation } from 'lucide-react';

export default function FindCarePage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  useEffect(() => {
    hospitalService
      .getHospitals({
        search: search || undefined,
        type: selectedType || undefined,
        emergency: emergencyOnly || undefined,
      })
      .then(setHospitals);
  }, [search, selectedType, emergencyOnly]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DemoRoleSwitcher />
      <PublicHeader />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Find Nearby Care & Facilities</h1>
            <p className="text-xs text-slate-600">Locate Sub-Centers, PHCs, CHCs, District Hospitals, and Pharmacies in your district.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Current Location:</span>
            <span className="px-3 py-1 bg-white border border-slate-300 rounded-full text-xs font-bold text-sky-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-600" /> Khed / Pune, Maharashtra
            </span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <Input
            placeholder="Search facility name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            options={[
              { value: '', label: 'All Facility Types' },
              { value: 'PHC', label: 'Primary Health Centre (PHC)' },
              { value: 'CHC', label: 'Community Health Centre (CHC)' },
              { value: 'DISTRICT_HOSPITAL', label: 'District Hospital' },
              { value: 'SUB_CENTER', label: 'Sub-Center' },
            ]}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEmergencyOnly(!emergencyOnly)}
              className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                emergencyOnly
                  ? 'bg-red-600 text-white border-red-700 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <AlertCircle className="w-4 h-4" /> 24/7 Emergency Facilities Only
            </button>
          </div>
        </div>

        {/* Map Placeholder + List View Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
              <span>Showing {hospitals.length} Healthcare Facilities</span>
              <span>Sorted by Distance (Nearest First)</span>
            </div>

            {hospitals.map((hosp) => (
              <Card
                key={hosp.id}
                className={`transition-all cursor-pointer hover:border-sky-400 ${
                  selectedHospital?.id === hosp.id ? 'ring-2 ring-sky-500 border-sky-500' : ''
                }`}
                onClick={() => setSelectedHospital(hosp)}
              >
                <CardContent className="p-5 flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-[10px] font-bold rounded uppercase">
                        {hosp.type.replace('_', ' ')}
                      </span>
                      {hosp.emergencyAvailable && <StatusBadge status="24/7 EMERGENCY" variant="red" />}
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{hosp.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {hosp.address}, {hosp.district}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {hosp.services?.slice(0, 4).map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0 space-y-2 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <div className="text-xs font-bold text-sky-700">{hosp.distanceKm} km away</div>
                    <div className="text-xs text-slate-600 flex items-center sm:justify-end gap-1">
                      <BedDouble className="w-3.5 h-3.5 text-slate-400" /> {hosp.availableBeds} / {hosp.totalBeds} Beds Free
                    </div>
                    <div className="pt-1 flex gap-2 sm:justify-end">
                      <a href={`tel:${hosp.phone}`}>
                        <Button variant="outline" size="sm">
                          <Phone className="w-3.5 h-3.5 mr-1" /> Call
                        </Button>
                      </a>
                      <a
                        href={`https://maps.google.com/?q=${hosp.latitude || 18.8471},${hosp.longitude || 73.9056}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button size="sm">
                          <Navigation className="w-3.5 h-3.5 mr-1" /> Map
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Interactive Map Provider Integration Container */}
          <div className="lg:col-span-1">
            <Card className="h-full min-h-[400px] flex flex-col">
              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-sky-600" /> Facility GIS Map
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">Map Provider Ready</span>
                </div>

                {/* Simulated Geographic Map View */}
                <div className="flex-1 bg-slate-900 rounded-xl relative overflow-hidden flex flex-col justify-between p-4 text-white">
                  <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />

                  <div className="relative z-10 flex justify-between items-start">
                    <span className="px-2 py-1 bg-slate-800/90 text-sky-400 text-[10px] font-mono rounded border border-slate-700">
                      GPS: 18.8471° N, 73.9056° E
                    </span>
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">
                      Live Telemetry
                    </span>
                  </div>

                  {selectedHospital ? (
                    <div className="relative z-10 bg-slate-800/95 backdrop-blur-xs p-4 rounded-xl border border-sky-500 space-y-2">
                      <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">Selected Facility</span>
                      <h4 className="font-bold text-sm text-white">{selectedHospital.name}</h4>
                      <p className="text-xs text-slate-300">{selectedHospital.address}</p>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-700">
                        <span>Distance: {selectedHospital.distanceKm} km</span>
                        <span className="text-emerald-400 font-bold">{selectedHospital.availableBeds} Beds Free</span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative z-10 text-center py-12 text-slate-400 space-y-2">
                      <MapPin className="w-8 h-8 mx-auto text-sky-400 animate-bounce" />
                      <p className="text-xs">Click any hospital from the list to view exact location and directions.</p>
                    </div>
                  )}

                  <div className="relative z-10 text-[10px] text-slate-400 text-center">
                    Integrates with OpenStreetMap / MapmyIndia / Google Maps API
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
