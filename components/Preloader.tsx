'use client';

import { useEffect, useState } from 'react';

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Check if user has already visited in this session
    const hasVisited = sessionStorage.getItem('avinya_preloader_seen');
    if (hasVisited) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setExiting(true);
      sessionStorage.setItem('avinya_preloader_seen', 'true');
      const removeTimer = setTimeout(() => {
        setVisible(false);
      }, 500);
      return () => clearTimeout(removeTimer);
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0A0A0C] text-[#F2F2F0] transition-all duration-500 ease-out ${
        exiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Halftone dot matrix backdrop */}
      <div className="absolute inset-0 halftone-dense opacity-20 pointer-events-none text-white" />

      {/* Center Monogram & Tide-Out Ripple */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <div className="mb-4 inline-flex items-center gap-2 border border-white/20 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-[#F5C542] uppercase">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#F5C542] animate-ping" />
          VOYAGE SEQUENCE // 00
        </div>

        <h1 className="font-mono text-3xl sm:text-5xl font-black tracking-[-0.04em] text-white">
          AVINYA <span className="text-[#F5C542]">2027</span>
        </h1>

        <p className="mt-3 font-serif italic text-sm text-neutral-400">
          The Marble & Halftone Voyage — IIIT Dharwad
        </p>

        {/* Tide Progress Bar */}
        <div className="mt-6 h-[2px] w-48 overflow-hidden bg-white/10">
          <div className="h-full bg-[#F5C542] transition-all duration-1000 ease-in-out w-full animate-[pulse_1s_infinite]" />
        </div>
      </div>
    </div>
  );
}
