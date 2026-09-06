'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsSyncing(true);
      setTimeout(() => {
        setIsOffline(false);
        setIsSyncing(false);
      }, 1500);
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline && !isSyncing) return null;

  return (
    <div
      className={`px-4 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
        isSyncing
          ? 'bg-amber-500 text-white'
          : 'bg-red-600 text-white'
      }`}
    >
      <div className="flex items-center gap-2">
        {isSyncing ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Connection Restored — Synchronizing pending field records...</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>Low Connectivity Mode — Saved offline. Changes will sync automatically when network returns.</span>
          </>
        )}
      </div>
      <span className="opacity-75">CareLink Offline Engine v1.0</span>
    </div>
  );
};
