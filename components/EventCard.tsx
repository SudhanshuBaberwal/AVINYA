'use client';

import React from 'react';
import { EventItem } from '@/data/events';
import { Clock, MapPin, Users, ArrowUpRight, Star } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  index: number;
  isBookmarked?: boolean;
  onToggleBookmark?: (eventId: string, e: React.MouseEvent) => void;
  onCardClick?: (event: EventItem) => void;
}

export default function EventCard({
  event,
  index,
  isBookmarked = false,
  onToggleBookmark,
  onCardClick,
}: EventCardProps) {
  const dayConfigs = {
    1: {
      island: 'THE LAST OUTPOST',
      coord: 'LAT 15°23\'N',
      accent: '#E07A2E',
      glow: 'rgba(224, 122, 46, 0.25)',
      border: 'border-[#E07A2E]/40',
      badgeBg: 'bg-[#E07A2E]/10 text-[#E07A2E] border-[#E07A2E]/30',
    },
    2: {
      island: 'THE PANDEMONIUM',
      coord: 'LAT 15°24\'N',
      accent: '#FF2E93',
      glow: 'rgba(255, 46, 147, 0.25)',
      border: 'border-[#FF2E93]/40',
      badgeBg: 'bg-[#FF2E93]/10 text-[#FF2E93] border-[#FF2E93]/30',
    },
    3: {
      island: 'THE CARNIVAL',
      coord: 'LAT 15°24\'N',
      accent: '#FFB703',
      glow: 'rgba(255, 183, 3, 0.25)',
      border: 'border-[#FFB703]/40',
      badgeBg: 'bg-[#FFB703]/10 text-[#FFB703] border-[#FFB703]/30',
    },
  };

  const dayConfig = dayConfigs[event.day];

  return (
    <article
      onClick={() => onCardClick?.(event)}
      className={`group relative flex h-full flex-col justify-between overflow-hidden border border-white/15 bg-[#0C0D12] p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-opacity-80 cursor-pointer ${
        event.highlight ? 'ring-1 ring-white/10 hover:ring-opacity-100' : ''
      }`}
      style={{
        boxShadow: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = dayConfig.accent;
        e.currentTarget.style.boxShadow = `0 10px 30px -10px ${dayConfig.glow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Halftone texture overlay that subtly reveals on hover */}
      <div className="absolute inset-0 halftone-dense opacity-5 group-hover:opacity-15 transition-opacity duration-400 pointer-events-none text-white" />

      {/* Technical Corner Crosshairs */}
      <div className="absolute top-0 left-0 h-2.5 w-2.5 border-t border-l border-white/30 group-hover:border-white transition-colors" />
      <div className="absolute top-0 right-0 h-2.5 w-2.5 border-t border-r border-white/30 group-hover:border-white transition-colors" />
      <div className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-white/30 group-hover:border-white transition-colors" />
      <div className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-white/30 group-hover:border-white transition-colors" />

      <div>
        {/* Top Metadata Strip */}
        <div className="mb-4 flex items-center justify-between font-mono text-[9px] sm:text-[10px]">
          <div className="flex items-center gap-2">
            <span
              className={`border px-2 py-0.5 font-bold tracking-widest uppercase rounded-sm ${dayConfig.badgeBg}`}
            >
              DAY 0{event.day} · {dayConfig.island}
            </span>
            <span className="text-white/40 hidden sm:inline">{dayConfig.coord}</span>
          </div>

          <div className="flex items-center gap-2">
            {event.highlight && (
              <span className="border border-white/20 bg-white/5 px-2 py-0.5 text-white/90 uppercase tracking-widest font-semibold text-[9px]">
                MARQUEE ARENA
              </span>
            )}
            {/* Star / Bookmark Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark?.(event.id, e);
              }}
              aria-label={isBookmarked ? 'Remove from manifest' : 'Bookmark to manifest'}
              className={`p-1 rounded transition-colors ${
                isBookmarked
                  ? 'text-[var(--accent)]'
                  : 'text-white/30 hover:text-white'
              }`}
            >
              <Star
                className="h-3.5 w-3.5"
                fill={isBookmarked ? 'currentColor' : 'none'}
              />
            </button>
          </div>
        </div>

        {/* Index Numeral & Category Tag */}
        <div className="flex items-baseline justify-between border-b border-white/10 pb-2 mb-3">
          <span className="font-mono text-[10px] text-white/40 tracking-[0.25em]">
            REF. 0{event.day}.{String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-300">
            // {event.category}
          </span>
        </div>

        {/* Event Title */}
        <h3 className="font-mono text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-[var(--accent)] transition-colors leading-snug">
          {event.name}
        </h3>

        {/* Format / Competition Stance Badge */}
        {event.format && (
          <div className="mt-2 inline-flex items-center gap-1.5 border border-white/15 bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] text-neutral-300">
            <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
            <span>FORMAT: {event.format.toUpperCase()}</span>
          </div>
        )}

        {/* Club Organizer */}
        <div className="mt-2 flex items-center gap-1.5 font-serif text-xs italic text-neutral-400">
          <Users className="h-3 w-3 opacity-60 text-[var(--accent)]" />
          <span>Hosted by {event.club}</span>
        </div>

        {/* Description */}
        <p className="mt-3 text-xs sm:text-sm text-neutral-300 line-clamp-3 leading-relaxed font-sans font-light">
          {event.description}
        </p>
      </div>

      {/* Footer Info & Inspection Action */}
      <div className="mt-6 border-t border-white/10 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span className="font-semibold text-white/80">{event.time}</span>
          </div>

          <div className="flex items-center gap-1.5 text-white/60">
            <MapPin className="h-3.5 w-3.5 opacity-60" />
            <span className="truncate max-w-[150px]">{event.venue}</span>
          </div>
        </div>

        {/* Interactive Tactical Dossier Trigger */}
        <div className="mt-4 flex items-center justify-between border-t border-dashed border-white/10 pt-3 font-mono text-[10px] text-white/50 group-hover:text-white transition-colors">
          <span className="tracking-[0.2em] uppercase">
            CLICK TO OPEN ARENA DOSSIER
          </span>
          <span className="flex items-center gap-1 text-[var(--accent)] font-bold group-hover:translate-x-1 transition-transform">
            <span>EXPAND</span>
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </article>
  );
}
