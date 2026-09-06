import React from 'react';
import Link from 'next/link';
import { HeartPulse } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <div className="p-1.5 bg-sky-600 text-white rounded-md">
              <HeartPulse className="w-4 h-4" />
            </div>
            <span>CareLink</span>
          </div>
          <p className="text-xs text-slate-400">
            Integrated digital healthcare platform designed for rural and public healthcare delivery in India.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Healthcare Journeys</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/patient/symptoms" className="hover:text-white">AI Symptom Assessment</Link></li>
            <li><Link href="/patient/hospitals" className="hover:text-white">Find Nearby Facilities</Link></li>
            <li><Link href="/patient/appointments/book" className="hover:text-white">Book Doctor Appointment</Link></li>
            <li><Link href="/patient/emergency" className="hover:text-white">108 Emergency Assistance</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Ecosystem Portals</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/doctor" className="hover:text-white">Doctor Clinical Portal</Link></li>
            <li><Link href="/hospital" className="hover:text-white">Hospital Administration</Link></li>
            <li><Link href="/pharmacy" className="hover:text-white">Pharmacy & Stock</Link></li>
            <li><Link href="/community" className="hover:text-white">ASHA / ANM / CHO Field Portal</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Trust & Compliance</h4>
          <p className="text-xs text-slate-400 mb-2">
            CareLink decision support systems comply with ABDM guidelines and NHA digital health standards.
          </p>
          <span className="inline-block px-2.5 py-1 bg-slate-800 text-sky-400 text-xs font-mono rounded">
            SIH 2024 Demonstration
          </span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-800 text-xs text-center text-slate-500">
        © 2026 CareLink Platform. Accessible healthcare, wherever you are.
      </div>
    </footer>
  );
};
