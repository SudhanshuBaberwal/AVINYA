'use client';

import React, { useState } from 'react';
import { EventItem } from '@/data/events';
import { Clock, MapPin, Users, ArrowUpRight, Check } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  onCardClick?: (event: EventItem) => void;
  onRegisterClick?: (event: EventItem) => void;
}

export default function EventCard({ event, onCardClick, onRegisterClick }: EventCardProps) {
  const [registered, setRegistered] = useState(false);

  const handleRegister = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRegistered(true);
    if (onRegisterClick) {
      onRegisterClick(event);
    }
  };

  const dayBadges = {
    1: { name: 'DAY 1 · OUTPOST', color: '#E07A2E', bg: 'rgba(224, 122, 46, 0.15)' },
    2: { name: 'DAY 2 · PANDEMONIUM', color: '#FF2E93', bg: 'rgba(255, 46, 147, 0.15)' },
    3: { name: 'DAY 3 · CARNIVAL', color: '#FFB703', bg: 'rgba(255, 183, 3, 0.15)' },
  };

  const badge = dayBadges[event.day];

  return (
    <div
      onClick={() => onCardClick?.(event)}
      className="editorial-frame group relative flex h-full flex-col justify-between p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* Halftone texture overlay that fades on hover */}
      <div className="absolute inset-0 halftone-dense opacity-10 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none text-white" />

      <div>
        {/* Top Header Tags */}
        <div className="mb-3 flex items-center justify-between font-mono text-[10px]">
          <span
            className="px-2 py-0.5 rounded font-bold tracking-wider"
            style={{ color: badge.color, backgroundColor: badge.bg }}
          >
            {badge.name}
          </span>

          <span className="border border-white/20 bg-white/5 px-2 py-0.5 text-white/70 tracking-widest uppercase">
            {event.category}
          </span>
        </div>

        {/* Event Title */}
        <h3 className="font-mono text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-[var(--accent)] transition-colors">
          {event.name}
        </h3>

        {/* Club Organizer */}
        <div className="mt-1 flex items-center gap-1.5 font-serif text-xs italic text-[var(--accent)]">
          <Users className="h-3 w-3 opacity-70" />
          <span>{event.club}</span>
        </div>

        {/* Description */}
        <p className="mt-3 text-xs sm:text-sm text-neutral-300 line-clamp-3 leading-relaxed">
          {event.description}
        </p>
      </div>

      {/* Footer Info & Action */}
      <div className="mt-6 border-t border-white/10 pt-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>{event.time}</span>
          </span>

          <span className="flex items-center gap-1.5 text-white/70">
            <MapPin className="h-3.5 w-3.5 text-white/40" />
            <span>{event.venue}</span>
          </span>
        </div>

        <button
          onClick={handleRegister}
          className={`flex w-full items-center justify-center gap-2 rounded-full py-2 font-mono text-xs font-bold tracking-wider uppercase transition-all duration-200 border ${
            registered
              ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
              : 'border-white/20 bg-white/5 hover:border-[var(--accent)] hover:bg-[var(--accent)] text-white hover:text-black hover:shadow-[0_0_15px_var(--glow-accent)]'
          }`}
        >
          {registered ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>INTEREST REGISTERED</span>
            </>
          ) : (
            <>
              <span>REGISTER FOR ARENA</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
