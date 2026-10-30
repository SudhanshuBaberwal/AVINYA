'use client';

import React, { useMemo } from 'react';
import FlexCarousel from './FlexCarousel';
import { FEST_EVENTS, EventItem } from '@/data/events';

/* -------------------------------------------------------------------------- */
/* Poster generator: every event gets its own artwork, themed by its island.  */
/* No extra image assets needed. Day 1 = dunes, Day 2 = neon grid, Day 3 =    */
/* floating lanterns.                                                         */
/* -------------------------------------------------------------------------- */

const ART: Record<1 | 2 | 3, { accent: string; bgTop: string; bgBottom: string; label: string }> = {
  1: { accent: '#E07A2E', bgTop: '#2a1406', bgBottom: '#0d0603', label: 'The Last Outpost' },
  2: { accent: '#FF2E93', bgTop: '#2a0720', bgBottom: '#07030f', label: 'The Pandemonium' },
  3: { accent: '#FFB703', bgTop: '#1d1604', bgBottom: '#05060d', label: 'The Carnival Island' },
};

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Greedy word-wrap into at most `maxLines` lines
function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1].replace(/.{0,2}$/, '…');
    return kept;
  }
  return lines;
}

// Tiny deterministic hash so each event's art is stable between renders
function seed(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

function motif(day: 1 | 2 | 3, rnd: () => number, accent: string): string {
  if (day === 1) {
    // layered dunes + low sun
    const dune = (y: number, amp: number, op: number) => {
      const p = rnd() * 6;
      let d = `M0 1000 L0 ${y}`;
      for (let x = 0; x <= 800; x += 40) d += ` L${x} ${y + Math.sin(x / 120 + p) * amp}`;
      return `${d} L800 1000 Z" fill="${accent}" fill-opacity="${op}`;
    };
    return `
      <circle cx="${200 + rnd() * 400}" cy="360" r="120" fill="${accent}" fill-opacity="0.35"/>
      <path d="${dune(560, 36, 0.18)}"/>
      <path d="${dune(640, 44, 0.28)}"/>
      <path d="${dune(740, 52, 0.45)}"/>`;
  }
  if (day === 2) {
    // synthwave sun + perspective grid
    let g = '';
    for (let i = -8; i <= 8; i++) g += `<line x1="${400 + i * 20}" y1="600" x2="${400 + i * 150}" y2="1000" stroke="${accent}" stroke-opacity="0.55"/>`;
    for (let i = 0; i < 7; i++) {
      const y = 600 + Math.pow(i / 6, 2) * 400;
      g += `<line x1="0" y1="${y}" x2="800" y2="${y}" stroke="${accent}" stroke-opacity="0.5"/>`;
    }
    return `
      <circle cx="400" cy="470" r="150" fill="${accent}" fill-opacity="0.85"/>
      <g fill="#07030f">${[0, 1, 2, 3, 4].map((i) => `<rect x="240" y="${470 + i * 22}" width="320" height="${3 + i * 2}"/>`).join('')}</g>
      <rect x="0" y="600" width="800" height="400" fill="#07030f" fill-opacity="0.65"/>
      ${g}`;
  }
  // day 3: lanterns over a lagoon
  let l = '';
  for (let i = 0; i < 14; i++) {
    const x = rnd() * 760 + 20;
    const y = 120 + rnd() * 520;
    const r = 8 + rnd() * 20;
    l += `<circle cx="${x}" cy="${y}" r="${r * 3}" fill="${accent}" fill-opacity="0.08"/>
          <circle cx="${x}" cy="${y}" r="${r}" fill="${accent}" fill-opacity="${0.5 + rnd() * 0.4}"/>
          <circle cx="${x}" cy="${y + 640 - y * 0.2 + 120}" r="${r * 0.8}" fill="${accent}" fill-opacity="0.12"/>`;
  }
  return `${l}<rect x="0" y="780" width="800" height="1" fill="${accent}" fill-opacity="0.5"/>`;
}

export function posterFor(ev: EventItem): string {
  const day = ev.day as 1 | 2 | 3;
  const a = ART[day];
  const rnd = seed(ev.id);
  const titleLines = wrap(ev.name, 16, 3);
  const titleSvg = titleLines
    .map((t, i) => `<tspan x="48" dy="${i === 0 ? 0 : 84}">${esc(t)}</tspan>`)
    .join('');

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${a.bgTop}"/><stop offset="1" stop-color="${a.bgBottom}"/>
    </linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.85"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#bg)"/>
  ${motif(day, rnd, a.accent)}
  <rect y="520" width="800" height="480" fill="url(#fade)"/>
  <rect x="24" y="24" width="752" height="952" fill="none" stroke="${a.accent}" stroke-opacity="0.55" stroke-width="2"/>
  <text x="48" y="92" font-family="ui-monospace, Menlo, monospace" font-size="22" fill="${a.accent}" letter-spacing="3">DAY 0${day}  ${esc(ev.category.toUpperCase())}</text>
  ${ev.highlight ? `<text x="752" y="92" text-anchor="end" font-family="ui-monospace, Menlo, monospace" font-size="22" fill="#fff" fill-opacity="0.8">FLAGSHIP</text>` : ''}
  <text x="48" y="700" font-family="ui-monospace, Menlo, monospace" font-weight="900" font-size="72" fill="#fff">${titleSvg}</text>
  <text x="48" y="920" font-family="Georgia, serif" font-style="italic" font-size="28" fill="#fff" fill-opacity="0.75">${esc(ev.club)}</text>
  <text x="752" y="920" text-anchor="end" font-family="ui-monospace, Menlo, monospace" font-size="24" fill="${a.accent}">${esc(ev.time)}</text>
</svg>`.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

interface Props {
  selectedDay: 1 | 2 | 3 | 'all';
  onInspect: (ev: EventItem) => void;
}

export default function EventsMarquee({ selectedDay, onInspect }: Props) {
  const events = useMemo(
    () =>
      selectedDay === 'all'
        ? FEST_EVENTS.filter((e) => e.highlight)
        : FEST_EVENTS.filter((e) => e.day === selectedDay),
    [selectedDay]
  );

  const items = useMemo(
    () =>
      events.map((ev) => ({
        src: posterFor(ev),
        alt: `${ev.name}, ${ev.category}, day ${ev.day}`,
        title: ev.name,
        subtitle: `${ev.time} · ${ev.venue}`,
      })),
    [events]
  );

  const accent = selectedDay === 'all' ? '#ffffff' : ART[selectedDay].accent;

  return (
    <div className="relative">
      {/* island-coloured glow behind the lens, changes with the selected harbor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-72 -translate-y-1/2 blur-3xl transition-colors duration-700"
        style={{ background: `radial-gradient(ellipse at center, ${accent}33, transparent 70%)` }}
      />

      <div style={{ width: '100%', height: '560px', position: 'relative' }}>
        <FlexCarousel
          key={`flex-${selectedDay}`}
          items={items}
          preset="liquid"
          intro="rise"
          cardHeight={0.5}
          gap={12}
          squeeze={0.2}
          focusOnClick
          captions
          fit="natural"
          radius={0}
          lensWidth={0.74}
          lensHeight={1.18}
          tilt={62}
          roundness={1}
          bend={0.34}
          reach={0.38}
          curl="twist"
          dispersion={0.45}
          liquid={0}
          followCursor={false}
          autoplay={false}
          interval={4}
          captureWheel={false}
          onCardClick={(item, idx) => {
            const ev = events[idx];
            if (ev) onInspect(ev);
          }}
        />
      </div>

      {/* Inspect rail: opens the dossier modal. Works with any FlexCarousel API. */}
      <div className="relative mt-4 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]" role="list" aria-label="Open event dossier">
        {events.map((ev) => (
          <button
            key={ev.id}
            role="listitem"
            type="button"
            onClick={() => onInspect(ev)}
            className="flex-shrink-0 rounded-sm border border-white/15 bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] text-neutral-300 transition-colors hover:border-white/50 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: accent }}
          >
            {ev.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* INTEGRATION in Events.tsx                                                  */
/*                                                                            */
/* 1. Remove:  import CardSwap, { Card } from './CardSwap';                   */
/*    Add:     import EventsMarquee from './EventsMarquee';                   */
/*                                                                            */
/* 2. Replace the whole "Right Column: ReactBits CardSwap Component" div      */
/*    (the one with min-h-[480px]) with:                                      */
/*                                                                            */
/*    <div className="lg:col-span-7 w-full">                                  */
/*      <EventsMarquee selectedDay={selectedDay} onInspect={setActiveModalEvent} /> */
/*    </div>                                                                  */
/*                                                                            */
/* 3. Change the left column to lg:col-span-4 and this one to lg:col-span-8   */
/*    so the lens has room to bend.                                           */
/*                                                                            */
/* 4. Delete the now-unused `islandMarqueeEvents` memo and `Card` usage.      */
/* -------------------------------------------------------------------------- */