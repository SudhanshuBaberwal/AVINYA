'use client';

import dynamic from 'next/dynamic';
import StatueSlices from './StatueSlices';
import VectorText from './VectorText';
import { useLenis } from '@/lib/lenis';
import { ArrowDown, Anchor } from 'lucide-react';
import { FEST_METADATA } from '@/data/content';

// Lazy-load canvas wave grid without SSR
const PatternWaves = dynamic(() => import('./reactbits/PatternWaves'), {
  ssr: false,
});

export default function Hero() {
  const { scrollTo } = useLenis();

  return (
    <section
      id="hero"
      data-theme="default"
      className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden pt-24 sm:pt-28 pb-10 px-4 sm:px-8 border-b border-white/10"
    >
      {/* Pattern Waves Ocean Canvas Underneath */}
      <div className="absolute inset-x-0 bottom-0 top-[25%] pointer-events-none opacity-40">
        <PatternWaves amplitude={20} speed={0.02} gap={24} />
      </div>

      {/* Subtle Halftone Gradient Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0C] via-transparent to-[#0A0A0C]/90 pointer-events-none" />

      {/* Top Metadata Row */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] sm:text-xs tracking-[0.25em] text-white/50 uppercase border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="text-white">IIIT DHARWAD</span>
          <span className="text-white/30">// TECHNO-CULTURAL FEST</span>
        </div>

        <div className="flex items-center gap-4 text-[var(--accent)]">
          <span>LAT 15°23&apos;N // LON 75°01&apos;E</span>
          <span className="hidden md:inline text-white/40">MARBLE & HALFTONE EDITION</span>
        </div>
      </div>

      {/* Main Center Composition: Hero Title & Sliced Bust */}
      <div className="relative z-10 my-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12 py-6">
        {/* Left Column: Huge Vector Wordmark and Editorial Narrative */}
        <div className="lg:col-span-7 flex flex-col items-start justify-center">
          <div className="mb-3 inline-flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-[var(--accent)] rounded-full">
            <Anchor className="h-3 w-3" />
            <span>THE ANNUAL VOYAGE BEGINS</span>
          </div>

          <VectorText
            text="AVINYA"
            size="hero"
            subtext="12 · 13 · 14 MARCH 2027 — IIIT DHARWAD"
          />

          <p className="mt-6 max-w-xl font-serif text-lg sm:text-2xl italic leading-relaxed text-neutral-300">
            A three-day odyssey across uncharted archipelagos. Slicing through antiquity, 
            synthwave frequencies, and lantern-lit midnight revelry.
          </p>

          {/* Quick Date & Venue Badges */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="border border-white/15 bg-black/40 px-4 py-2 font-mono text-xs">
              <span className="block text-[10px] text-white/40 tracking-wider">DATES</span>
              <span className="text-[var(--accent)] font-bold">{FEST_METADATA.dates}</span>
            </div>

            <div className="border border-white/15 bg-black/40 px-4 py-2 font-mono text-xs">
              <span className="block text-[10px] text-white/40 tracking-wider">LOCATION</span>
              <span className="text-white">{FEST_METADATA.venue.shortName}, Karnataka</span>
            </div>

            <div className="border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-2 font-mono text-xs">
              <span className="block text-[10px] text-[var(--accent)]/70 tracking-wider">FLAGSHIP HACK</span>
              <span className="text-[var(--accent)] font-bold">Hack2Future 36H</span>
            </div>
          </div>
        </div>

        {/* Right Column: Sliced Floating Marble Bust */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <StatueSlices />
        </div>
      </div>

      {/* Waterline and Bobbing Boat Scroll Cue */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-4">
        {/* Bobbing Boat Icon at Waterline */}
        <div className="relative mb-2 flex flex-col items-center">
          <div className="animate-statue-bob text-[var(--accent)] drop-shadow-[0_0_12px_var(--accent)]">
            <svg
              width="36"
              height="28"
              viewBox="0 0 36 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transform hover:scale-110 transition-transform"
            >
              <path
                d="M4 18L18 24L32 18L28 26H8L4 18Z"
                fill="currentColor"
                opacity="0.9"
              />
              <path
                d="M18 4V21M18 4L28 16H18M18 6L8 16H18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Ship Lantern Glow */}
              <circle cx="18" cy="4" r="2.5" fill="#FFF" className="animate-ping" />
            </svg>
          </div>
          {/* Subtle Waterline ripple */}
          <div className="h-[1px] w-28 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-60 mt-1" />
        </div>

        {/* Scroll Cue Button */}
        <button
          onClick={() => scrollTo('#manifesto')}
          className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-white/70 hover:text-[var(--accent)] transition-colors uppercase"
          aria-label="Set sail to manifesto section"
        >
          <span>SET SAIL</span>
          <ArrowDown className="h-3.5 w-3.5 text-[var(--accent)] group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </section>
  );
}
