'use client';

import React from 'react';
import Link from 'next/link';
import { HeartPulse, Globe } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { Button } from '@/components/ui/Button';

export const PublicHeader: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-slate-900 font-bold text-xl tracking-tight">
          <div className="p-2 bg-sky-600 text-white rounded-lg shadow-xs">
            <HeartPulse className="w-5 h-5" />
          </div>
          <span>Care<span className="text-sky-600">Link</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/how-it-works" className="hover:text-sky-600 transition-colors">
            How It Works
          </Link>
          <Link href="/services" className="hover:text-sky-600 transition-colors">
            Services
          </Link>
          <Link href="/find-care" className="hover:text-sky-600 transition-colors">
            Find Care
          </Link>
          <Link href="/about" className="hover:text-sky-600 transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>
          <Link href="/login">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/patient">
            <Button size="sm">
              Get Healthcare
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
