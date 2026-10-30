'use client';

import React from 'react';
import Image from 'next/image';
import { IslandInfo } from '@/data/content';
import { FEST_EVENTS, EventItem } from '@/data/events';
import { useLenis } from '@/lib/lenis';
import { ArrowRight, Clock, MapPin, Sparkles } from 'lucide-react';

interface IslandProps {
  island: IslandInfo;
  isActive?: boolean;
  onSelectDayFilter?: (day: 1 | 2 | 3) => void;
}

export default function Island({
  island,
  onSelectDayFilter,
}: IslandProps) {
  const { scrollTo } = useLenis();

  // Find 3–4 highlight events for this island's day
  const highlightEvents = FEST_EVENTS.filter(
    (e) => e.day === island.dayNumber && e.highlight
  ).slice(0, 3);

  const handleDeepLink = () => {
    if (onSelectDayFilter) {
      onSelectDayFilter(island.dayNumber);
    }
    // Also trigger custom event in case of decoupled listener
    window.dispatchEvent(
      new CustomEvent('avinya:select-day', { detail: { day: island.dayNumber } })
    );
    scrollTo('#events');
  };

  return (
    <div
      data-theme={`day${island.dayNumber}`}
      className="relative flex min-h-[100svh] w-full flex-col justify-center overflow-hidden px-4 sm:px-8 py-16 lg:py-24"
    >
      {/* 3-LAYER PARALLAX BACKGROUND */}
      {/* Layer 1: Base Full-Bleed Background Image */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
        <Image
          src={island.image}
          alt={island.name}
          fill
          priority={island.dayNumber === 1}
          sizes="100vw"
          className="object-cover object-center scale-105"
        />
        {/* Dark Vignette & Halftone Mask */}
        <div className="absolute inset-0 bg-[#0A0A0C]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-[#0A0A0C]/80" />
        <div className="absolute inset-0 halftone-bg opacity-15 pointer-events-none text-white" />
      </div>

      {/* Layer 2: Atmospheric Color Wash & Lighting Spill (Hardware Accelerated) */}
      <div
        className="absolute inset-0 -z-20 pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(circle at 60% 40%, ${island.palette.accent} 0%, transparent 70%)`,
        }}
      />

      {/* Layer 3: Particle Atmosphere specific to each island (GPU Friendly) */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        {island.dayNumber === 1 && (
          /* Day 1: Dune Ember & Sand Shimmer */
          <div className="absolute inset-0 opacity-60">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-[#E07A2E] animate-pulse"
                style={{
                  top: `${20 + (i * 19) % 65}%`,
                  left: `${(i * 27) % 92}%`,
                  width: `${3 + (i % 2) * 2}px`,
                  height: `${3 + (i % 2) * 2}px`,
                  animationDuration: `${2.5 + (i % 3)}s`,
                  animationDelay: `${i * 0.35}s`,
                }}
              />
            ))}
          </div>
        )}

        {island.dayNumber === 2 && (
          /* Day 2: Cyberpunk Neon Rain & Grid Glow */
          <div className="absolute inset-0 opacity-50">
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#FF2E93]/20 to-transparent" />
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-[1px] bg-gradient-to-b from-transparent via-[#FF2E93] to-transparent animate-pulse"
                style={{
                  top: `${(i * 15) % 75}%`,
                  left: `${(i * 23) % 95}%`,
                  height: `${35 + (i % 4) * 25}px`,
                  animationDuration: `${2 + (i % 2)}s`,
                }}
              />
            ))}
          </div>
        )}

        {island.dayNumber === 3 && (
          /* Day 3: Carnival Golden Lanterns Floating */
          <div className="absolute inset-0 opacity-60">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-[#FFB703] blur-[1px] animate-statue-bob"
                style={{
                  top: `${15 + (i * 21) % 70}%`,
                  left: `${(i * 25) % 90}%`,
                  width: `${5 + (i % 3) * 2}px`,
                  height: `${7 + (i % 3) * 3}px`,
                  animationDuration: `${4 + (i % 2) * 2}s`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* FOREGROUND ISLAND EDITORIAL CONTENT */}
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Top Identification Frame */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/20 pb-4">
          <div className="flex items-center gap-3">
            <span
              className="px-2.5 py-1 font-mono text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase rounded"
              style={{
                backgroundColor: island.palette.accent,
                color: '#0A0A0C',
              }}
            >
              DAY 0{island.dayNumber}
            </span>
            <span className="font-mono text-xs sm:text-sm tracking-widest text-white/80">
              {island.date}
            </span>
          </div>

          <div className="font-mono text-[10px] sm:text-xs tracking-widest text-white/50">
            {island.coordinates}
          </div>
        </div>

        {/* Island Name & Theme Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
          <div className="lg:col-span-8">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-2">
              // ARCHIPELAGO LANDFALL 0{island.dayNumber}
            </p>
            <h2 className="font-mono text-4xl sm:text-6xl lg:text-7xl font-black tracking-[-0.03em] uppercase text-white drop-shadow-xl">
              {island.name}
            </h2>
            <p className="mt-4 font-serif text-xl sm:text-2xl italic text-neutral-300 max-w-2xl leading-relaxed">
              &ldquo;{island.quote}&rdquo;
            </p>
            <p className="mt-2 text-sm sm:text-base text-neutral-400 max-w-2xl">
              {island.description}
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-end">
            <button
              onClick={handleDeepLink}
              className="group inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 font-mono text-xs font-bold tracking-wider uppercase transition-all duration-300 border border-white/30 hover:border-transparent hover:scale-105"
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#FFFFFF',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = island.palette.accent;
                e.currentTarget.style.color = '#0A0A0C';
                e.currentTarget.style.boxShadow = `0 0 20px ${island.palette.accent}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span>SEE ALL DAY {island.dayNumber} EVENTS</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Highlight Events Cards Trio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {highlightEvents.map((event: EventItem, idx: number) => (
            <div
              key={event.id}
              className="editorial-frame p-5 sm:p-6 flex flex-col justify-between group hover:border-[var(--accent)]"
              style={{
                borderTop: `2px solid ${island.palette.accent}`,
              }}
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] text-white/50 tracking-wider mb-3">
                  <span>FIG. 0{island.dayNumber}.{idx + 1}</span>
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-semibold"
                    style={{
                      backgroundColor: `${island.palette.accent}20`,
                      color: island.palette.accent,
                    }}
                  >
                    {event.category}
                  </span>
                </div>

                <h3 className="font-mono text-lg sm:text-xl font-bold text-white group-hover:text-[var(--accent)] transition-colors">
                  {event.name}
                </h3>

                <p className="mt-1 font-serif text-xs italic text-[var(--accent)]">
                  {event.tagline || event.club}
                </p>

                <p className="mt-3 text-xs text-neutral-300 line-clamp-3 leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-[var(--accent)]" />
                  {event.time}
                </span>
                <span className="flex items-center gap-1 text-white/70">
                  <MapPin className="h-3 w-3 text-white/40" />
                  {event.venue}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
