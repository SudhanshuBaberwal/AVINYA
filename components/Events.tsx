'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FEST_EVENTS, CATEGORIES, EventCategory, EventItem } from '@/data/events';
import CardSwap, { Card } from './CardSwap';
import OptionWheel from './OptionWheel';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  X,
  Clock,
  MapPin,
  ArrowUpRight,
  Star,
  Compass,
  Bookmark,
  Printer,
  CheckCircle2,
  SlidersHorizontal,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';

interface IslandMeta {
  day: 1 | 2 | 3;
  name: string;
  subname: string;
  theme: string;
  date: string;
  coord: string;
  accent: string;
  glow: string;
  badgeBg: string;
  envLog: string;
  flagshipIds: string[];
}

const ISLAND_METAS: Record<1 | 2 | 3, IslandMeta> = {
  1: {
    day: 1,
    name: 'THE LAST OUTPOST',
    subname: 'ISLAND 01 // DUNE DESERT ARCHIPELAGO',
    theme: 'Desert Monoliths · Arrakis Sandstorms · Monochromatic Amber',
    date: 'FRIDAY, 12 MARCH 2027',
    coord: 'LAT 15°23\'42"N · LON 75°00\'18"E',
    accent: '#E07A2E',
    glow: 'rgba(224, 122, 46, 0.35)',
    badgeBg: 'bg-[#E07A2E]/15 text-[#E07A2E] border-[#E07A2E]/40',
    envLog: 'PRESSURE: 1014 hPa · WINDS: 28 KT NE · SAND DRIFT ELEVATED',
    flagshipIds: ['code-royale', 'monopoly', 'ai-arcade'],
  },
  2: {
    day: 2,
    name: 'THE PANDEMONIUM',
    subname: 'ISLAND 02 // SYNTHWAVE CYBERPUNK MEGAPOLIS',
    theme: 'Neon Horizons · Quantum Grids · Magenta Acid Rains',
    date: 'SATURDAY, 13 MARCH 2027',
    coord: 'LAT 15°24\'02"N · LON 75°00\'55"E',
    accent: '#FF2E93',
    glow: 'rgba(255, 46, 147, 0.35)',
    badgeBg: 'bg-[#FF2E93]/15 text-[#FF2E93] border-[#FF2E93]/40',
    envLog: 'PRECIPITATION: ACID MIST · GRID LOAD: 98.4% · HIGH FREQUENCY',
    flagshipIds: ['yukti-2', 'build-with-gemma', 'mega-rush-2', 'battle-of-bands'],
  },
  3: {
    day: 3,
    name: 'THE CARNIVAL ISLAND',
    subname: 'ISLAND 03 // MIDNIGHT LAGOON REVELRY',
    theme: 'Floating Lanterns · Ferris Reflections · Venetian Midnight Gold',
    date: 'SUNDAY, 14 MARCH 2027',
    coord: 'LAT 15°24\'30"N · LON 75°01\'12"E',
    accent: '#FFB703',
    glow: 'rgba(255, 183, 3, 0.35)',
    badgeBg: 'bg-[#FFB703]/15 text-[#FFB703] border-[#FFB703]/40',
    envLog: 'TIDES: HIGH SLACK · WATER CALM · LANTERN LUMEN 850 LM',
    flagshipIds: ['kernel-panic', 'fashion-show', 'dj-night'],
  },
};

export default function Events() {
  const [selectedDay, setSelectedDay] = useState<1 | 2 | 3 | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [activeModalEvent, setActiveModalEvent] = useState<EventItem | null>(null);
  const [manifestModalOpen, setManifestModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activePhaseSlot, setActivePhaseSlot] = useState<'Morning' | 'Afternoon' | 'Twilight & Night'>('Morning');
  const [wheelSelectedIndex, setWheelSelectedIndex] = useState(0);
  const [ledgerViewMode, setLedgerViewMode] = useState<'wheel' | 'matrix'>('wheel');

  // Load saved bookmarks from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('avinya_bookmarked_arenas');
      if (saved) {
        setBookmarkedIds(JSON.parse(saved));
      }
    } catch {
      // safe fallback
    }
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  }, []);

  // Side effects (localStorage + toast) now live outside the state updater,
  // so React StrictMode doesn't fire them twice.
  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const isAlreadySaved = bookmarkedIds.includes(id);
    const updated = isAlreadySaved
      ? bookmarkedIds.filter((item) => item !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(updated);
    try {
      localStorage.setItem('avinya_bookmarked_arenas', JSON.stringify(updated));
    } catch {
      // safe fallback
    }
    showToast(isAlreadySaved ? 'Removed from your voyage manifest' : 'Starred to your voyage manifest');
  };

  // Deep-linking from Island components or external events
  useEffect(() => {
    const handleSelectDay = (e: Event) => {
      const customEvent = e as CustomEvent<{ day: 1 | 2 | 3 }>;
      if (customEvent.detail?.day) {
        setSelectedDay(customEvent.detail.day);
        setShowSavedOnly(false);
      }
    };

    window.addEventListener('avinya:select-day', handleSelectDay);
    return () => window.removeEventListener('avinya:select-day', handleSelectDay);
  }, []);

  // Keyboard navigation for modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalEvent(null);
        setManifestModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered event list
  const filteredEvents = useMemo(() => {
    return FEST_EVENTS.filter((event) => {
      const q = searchQuery.toLowerCase();
      const matchesDay = selectedDay === 'all' || event.day === selectedDay;
      const matchesCategory =
        selectedCategory === 'All' || event.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        event.name.toLowerCase().includes(q) ||
        event.club.toLowerCase().includes(q) ||
        event.description.toLowerCase().includes(q) ||
        (event.format && event.format.toLowerCase().includes(q)) ||
        event.venue.toLowerCase().includes(q);
      const matchesSaved = !showSavedOnly || bookmarkedIds.includes(event.id);

      return matchesDay && matchesCategory && matchesSearch && matchesSaved;
    });
  }, [selectedDay, selectedCategory, searchQuery, showSavedOnly, bookmarkedIds]);

  // Marquee events for the 3D CardSwap stack
  const islandMarqueeEvents = useMemo(() => {
    if (selectedDay === 'all') {
      return FEST_EVENTS.filter((e) => e.highlight);
    }
    const dayMatches = FEST_EVENTS.filter((e) => e.day === selectedDay);
    const dayHighlights = dayMatches.filter((e) => e.highlight);
    return dayHighlights.length > 0 ? dayHighlights : dayMatches.slice(0, 5);
  }, [selectedDay]);

  // Group events by diurnal phases: Morning, Afternoon, Night
  const allPhaseSlots = useMemo(() => {
    const slots: {
      slot: 'Morning' | 'Afternoon' | 'Twilight & Night';
      phaseNum: '01' | '02' | '03';
      title: string;
      shortTitle: string;
      range: string;
      events: EventItem[];
    }[] = [
      {
        slot: 'Morning',
        phaseNum: '01',
        title: 'PHASE I // MORNING INCURSIONS',
        shortTitle: 'PHASE 01 // MORNING',
        range: '09:00 AM — 01:00 PM',
        events: [],
      },
      {
        slot: 'Afternoon',
        phaseNum: '02',
        title: 'PHASE II // AFTERNOON SHOWDOWNS',
        shortTitle: 'PHASE 02 // AFTERNOON',
        range: '02:00 PM — 06:00 PM',
        events: [],
      },
      {
        slot: 'Twilight & Night',
        phaseNum: '03',
        title: 'PHASE III // TWILIGHT & NIGHT REVELRY',
        shortTitle: 'PHASE 03 // NIGHT',
        range: '06:00 PM — 11:00 PM',
        events: [],
      },
    ];

    filteredEvents.forEach((ev) => {
      const targetSlot = ev.timeSlot || 'Afternoon';
      const slotObj = slots.find((s) => s.slot === targetSlot) || slots[1];
      slotObj.events.push(ev);
    });

    return slots;
  }, [filteredEvents]);

  // Phase slots with at least 1 event for the matrix table view
  const phaseSlots = useMemo(() => {
    return allPhaseSlots.filter((s) => s.events.length > 0);
  }, [allPhaseSlots]);

  // Currently selected phase slot
  const currentActivePhaseSlot = useMemo(() => {
    return (
      allPhaseSlots.find((s) => s.slot === activePhaseSlot) ||
      allPhaseSlots[0]
    );
  }, [allPhaseSlots, activePhaseSlot]);

  // OptionWheel item labels
  const wheelEventTitles = useMemo(() => {
    return currentActivePhaseSlot.events.map((ev) => ev.name);
  }, [currentActivePhaseSlot]);

  // Current active wheel event preview
  const activeWheelEvent = useMemo(() => {
    if (currentActivePhaseSlot.events.length === 0) return null;
    const clampedIndex = Math.max(
      0,
      Math.min(currentActivePhaseSlot.events.length - 1, wheelSelectedIndex)
    );
    return currentActivePhaseSlot.events[clampedIndex] || null;
  }, [currentActivePhaseSlot, wheelSelectedIndex]);

  // Current active island metadata for contextual styling
  const currentIslandMeta = typeof selectedDay === 'number' ? ISLAND_METAS[selectedDay] : null;

  // Saved manifest items for the Manifest modal
  const savedManifestEvents = useMemo(() => {
    return FEST_EVENTS.filter((e) => bookmarkedIds.includes(e.id));
  }, [bookmarkedIds]);

  return (
    <section
      id="events"
      className="relative min-h-[100svh] w-full bg-[#0A0A0C] py-20 sm:py-28 px-4 sm:px-8 border-b border-white/10 overflow-x-clip"
    >
      {/* Background Subtle Halftone Map Grid */}
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none text-white" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[var(--accent)]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Floating Tactical Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 border border-white/20 bg-black/90 px-4 py-2 rounded-full font-mono text-xs text-white shadow-2xl backdrop-blur-md"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ==================================================================== */}
        {/* SECTION 1: EDITORIAL HEADER & MANIFEST HUD */}
        {/* ==================================================================== */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-[var(--accent)] uppercase rounded-full mb-3">
              <Compass className="h-3.5 w-3.5" />
              <span>THE FESTIVAL CHRONICLES // 24 EXPEDITIONS</span>
            </div>

            <h2 className="font-mono text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none">
              THE ARCHIPELAGO ROSTER
            </h2>

            <p className="mt-3 font-serif text-base sm:text-lg italic text-neutral-300">
              Sail into the arena schedule of Avinya 2027. Navigate through the three day-islands to explore every algorithmic trial, hardware hackathon, and midnight revelry.
            </p>
          </div>

          {/* Quick HUD Bar: Saved Itinerary Counter & Action */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setManifestModalOpen(true)}
              className="flex items-center gap-2.5 border border-[var(--accent)]/50 bg-[var(--accent)]/10 px-4 py-2.5 font-mono text-xs font-bold text-white hover:bg-[var(--accent)] hover:text-black transition-all rounded-sm shadow-[0_0_20px_rgba(245,197,66,0.15)] group"
            >
              <Star className="h-4 w-4 text-[var(--accent)] group-hover:text-black transition-colors" fill="currentColor" />
              <span>VIEW MY MANIFEST</span>
              <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] group-hover:bg-black/20">
                {bookmarkedIds.length} SAVED
              </span>
            </button>
          </div>
        </header>

        {/* ==================================================================== */}
        {/* SECTION 2: ARCHIPELAGO HARBOR DOCK SELECTOR (The Three Islands) */}
        {/* ==================================================================== */}
        <div className="mb-10">
          <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/50">
            <span>SELECT DESTINATION HARBOR</span>
            <span>VOYAGE LOG: 12–14 MARCH 2027</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Harbor Tab: All Days */}
            <button
              type="button"
              onClick={() => {
                setSelectedDay('all');
                setShowSavedOnly(false);
              }}
              className={`relative text-left p-4 sm:p-5 border transition-all duration-300 rounded-sm overflow-hidden flex flex-col justify-between ${
                selectedDay === 'all' && !showSavedOnly
                  ? 'border-white bg-white/10 text-white shadow-[0_0_25px_rgba(255,255,255,0.15)] ring-1 ring-white/30'
                  : 'border-white/15 bg-white/[0.02] text-neutral-400 hover:text-white hover:border-white/30'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="font-bold tracking-widest uppercase text-white/70">HARBOR 00 // FULL FLEET</span>
                <span className="text-white/40">24 ARENAS</span>
              </div>
              <div className="mt-3">
                <span className="font-mono text-base sm:text-lg font-black text-white uppercase block leading-snug">
                  ALL THREE ISLANDS
                </span>
                <span className="font-mono text-[11px] text-white/50 block mt-1">
                  12 · 13 · 14 MARCH 2027
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 font-mono text-[10px] text-white/40 flex items-center justify-between">
                <span>COMPLETE EXPEDITION</span>
                <span className="text-white/80">3 DAYS</span>
              </div>
            </button>

            {/* Harbor Tab: Island 1 - The Last Outpost */}
            <button
              type="button"
              onClick={() => {
                setSelectedDay(1);
                setShowSavedOnly(false);
              }}
              className={`relative text-left p-4 sm:p-5 border transition-all duration-300 rounded-sm overflow-hidden flex flex-col justify-between ${
                selectedDay === 1 && !showSavedOnly
                  ? 'border-[#E07A2E] bg-[#E07A2E]/15 text-white shadow-[0_0_25px_rgba(224,122,46,0.3)] ring-1 ring-[#E07A2E]'
                  : 'border-white/15 bg-white/[0.02] text-neutral-400 hover:text-white hover:border-[#E07A2E]/50'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="font-bold tracking-widest uppercase text-[#E07A2E]">DAY 01 // DUNE DESERT</span>
                <span className="text-[#E07A2E]">9 ARENAS</span>
              </div>
              <div className="mt-3">
                <span className="font-mono text-base sm:text-lg font-black text-white uppercase block leading-snug">
                  THE LAST OUTPOST
                </span>
                <span className="font-mono text-[11px] text-[#E07A2E]/80 block mt-1">
                  FRI, 12 MARCH 2027
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 font-mono text-[10px] text-neutral-400 flex items-center justify-between">
                <span>DUNE SCI-FI DESERT</span>
                <span className="text-[#E07A2E] font-bold">DOCK HERE →</span>
              </div>
            </button>

            {/* Harbor Tab: Island 2 - The Pandemonium */}
            <button
              type="button"
              onClick={() => {
                setSelectedDay(2);
                setShowSavedOnly(false);
              }}
              className={`relative text-left p-4 sm:p-5 border transition-all duration-300 rounded-sm overflow-hidden flex flex-col justify-between ${
                selectedDay === 2 && !showSavedOnly
                  ? 'border-[#FF2E93] bg-[#FF2E93]/15 text-white shadow-[0_0_25px_rgba(255,46,147,0.3)] ring-1 ring-[#FF2E93]'
                  : 'border-white/15 bg-white/[0.02] text-neutral-400 hover:text-white hover:border-[#FF2E93]/50'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="font-bold tracking-widest uppercase text-[#FF2E93]">DAY 02 // SYNTHWAVE</span>
                <span className="text-[#FF2E93]">9 ARENAS</span>
              </div>
              <div className="mt-3">
                <span className="font-mono text-base sm:text-lg font-black text-white uppercase block leading-snug">
                  THE PANDEMONIUM
                </span>
                <span className="font-mono text-[11px] text-[#FF2E93]/80 block mt-1">
                  SAT, 13 MARCH 2027
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 font-mono text-[10px] text-neutral-400 flex items-center justify-between">
                <span>CYBERPUNK NEON SPIRES</span>
                <span className="text-[#FF2E93] font-bold">DOCK HERE →</span>
              </div>
            </button>

            {/* Harbor Tab: Island 3 - The Carnival Island */}
            <button
              type="button"
              onClick={() => {
                setSelectedDay(3);
                setShowSavedOnly(false);
              }}
              className={`relative text-left p-4 sm:p-5 border transition-all duration-300 rounded-sm overflow-hidden flex flex-col justify-between ${
                selectedDay === 3 && !showSavedOnly
                  ? 'border-[#FFB703] bg-[#FFB703]/15 text-white shadow-[0_0_25px_rgba(255,183,3,0.3)] ring-1 ring-[#FFB703]'
                  : 'border-white/15 bg-white/[0.02] text-neutral-400 hover:text-white hover:border-[#FFB703]/50'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="font-bold tracking-widest uppercase text-[#FFB703]">DAY 03 // CARNIVAL</span>
                <span className="text-[#FFB703]">6 ARENAS</span>
              </div>
              <div className="mt-3">
                <span className="font-mono text-base sm:text-lg font-black text-white uppercase block leading-snug">
                  THE CARNIVAL ISLAND
                </span>
                <span className="font-mono text-[11px] text-[#FFB703]/80 block mt-1">
                  SUN, 14 MARCH 2027
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 font-mono text-[10px] text-neutral-400 flex items-center justify-between">
                <span>NIGHT LAGOON REVELRY</span>
                <span className="text-[#FFB703] font-bold">DOCK HERE →</span>
              </div>
            </button>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SECTION 3: MARQUEE ARENAS (3D CARD SWAP SHOWDOWN) */}
        {/* ==================================================================== */}
        <div className="mb-14 border border-white/15 bg-white/[0.02] p-5 sm:p-8 rounded-sm relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 mb-6 gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--accent)]" />
              <h3 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                MARQUEE ARENAS // 3D CARD SHOWDOWN
              </h3>
            </div>
            <div className="font-mono text-[10px] text-white/50 tracking-widest uppercase">
              DRAG / SWIPE · CLICK CARDS TO ADVANCE · VIEW DOSSIER
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Descriptive Editorial Context */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-[var(--accent)] tracking-widest uppercase rounded-sm mb-3 w-fit">
                <span>INTERACTIVE CARD SWAP</span>
              </div>

              <h4 className="font-mono text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-tight">
                {currentIslandMeta
                  ? `${currentIslandMeta.name}`
                  : 'FESTIVAL MARQUEE PROTOCOLS'}
              </h4>

              <p className="mt-3 font-serif text-sm sm:text-base italic text-neutral-300 leading-relaxed">
                {currentIslandMeta
                  ? currentIslandMeta.theme
                  : 'Drag through the headline showdowns charted across the three islands of Avinya 2027.'}
              </p>

              {currentIslandMeta && (
                <p className="mt-3 font-mono text-[10px] tracking-wider text-white/40">
                  {currentIslandMeta.envLog}
                </p>
              )}

              <div className="mt-6 flex flex-col gap-2 font-mono text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E07A2E]" />
                  <span>DAY 01: Code Royale & Monopoly Stock Simulation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF2E93]" />
                  <span>DAY 02: Yukti 2.0 Quantum Hackathon & Agentic Gemma</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFB703]" />
                  <span>DAY 03: Kernel Panic Linux Fest & Haute Couture Runway</span>
                </div>
              </div>

              {/* Quick Jump Rail */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-2">
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest block w-full mb-1">
                  QUICK DOSSIER ACCESS:
                </span>
                {islandMarqueeEvents.slice(0, 4).map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => setActiveModalEvent(ev)}
                    className="rounded-sm border border-white/15 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-neutral-300 transition-colors hover:border-white/50 hover:text-white"
                  >
                    {ev.name} →
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: ReactBits CardSwap Component */}
            <div className="lg:col-span-7 w-full flex items-center justify-center min-h-[440px] relative">
              <CardSwap
                key={`swap-${selectedDay}`}
                width={420}
                height={320}
                cardDistance={46}
                verticalDistance={36}
                depth={80}
                skewAmount={4}
                delay={4000}
                autoplay={true}
                pauseOnHover={true}
                draggable={true}
                cardRadius={16}
                onCardClick={(idx) => {
                  const ev = islandMarqueeEvents[idx];
                  if (ev) setActiveModalEvent(ev);
                }}
              >
                {islandMarqueeEvents.map((ev) => {
                  const dayColor =
                    ev.day === 1 ? '#E07A2E' : ev.day === 2 ? '#FF2E93' : '#FFB703';
                  const isSaved = bookmarkedIds.includes(ev.id);
                  return (
                    <Card key={ev.id} className="cursor-pointer">
                      <div
                        className="relative h-full w-full p-6 flex flex-col justify-between select-none overflow-hidden"
                        style={{
                          background: 'linear-gradient(145deg, #161722 0%, #0c0d14 100%)',
                        }}
                      >
                        {/* Halftone / scanline subtle accent */}
                        <div
                          className="pointer-events-none absolute inset-0 opacity-10"
                          style={{
                            backgroundImage: `radial-gradient(${dayColor} 1px, transparent 1px)`,
                            backgroundSize: '16px 16px',
                          }}
                        />

                        {/* Top corner crosshair accents */}
                        <div
                          className="absolute top-2 left-2 w-2 h-2 border-t border-l opacity-60"
                          style={{ borderColor: dayColor }}
                        />
                        <div
                          className="absolute top-2 right-2 w-2 h-2 border-t border-r opacity-60"
                          style={{ borderColor: dayColor }}
                        />
                        <div
                          className="absolute bottom-2 left-2 w-2 h-2 border-b border-l opacity-60"
                          style={{ borderColor: dayColor }}
                        />
                        <div
                          className="absolute bottom-2 right-2 w-2 h-2 border-b border-r opacity-60"
                          style={{ borderColor: dayColor }}
                        />

                        {/* Card Header */}
                        <div className="relative z-10 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-sm font-bold border"
                              style={{
                                color: dayColor,
                                borderColor: `${dayColor}44`,
                                backgroundColor: `${dayColor}15`,
                              }}
                            >
                              DAY 0{ev.day} // {ev.category}
                            </span>
                            {ev.highlight && (
                              <span className="font-mono text-[9px] tracking-wider uppercase px-1.5 py-0.5 rounded-sm border border-white/20 bg-white/5 text-white/90">
                                MARQUEE
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(ev.id, e);
                            }}
                            className={`p-1.5 rounded-full border transition-all ${
                              isSaved
                                ? 'bg-yellow-400/20 border-yellow-400/60 text-yellow-300'
                                : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white hover:border-white/30'
                            }`}
                            title={isSaved ? 'Bookmarked' : 'Add to manifest'}
                          >
                            <Star
                              className="h-3.5 w-3.5"
                              fill={isSaved ? 'currentColor' : 'none'}
                            />
                          </button>
                        </div>

                        {/* Card Center Content */}
                        <div className="relative z-10 my-auto py-2">
                          <h4 className="font-mono text-xl sm:text-2xl font-black uppercase text-white tracking-tight leading-snug line-clamp-2">
                            {ev.name}
                          </h4>
                          {ev.tagline && (
                            <p className="mt-1 font-serif italic text-xs sm:text-sm text-neutral-300 line-clamp-1">
                              "{ev.tagline}"
                            </p>
                          )}
                          <p className="mt-2 text-xs text-neutral-400 line-clamp-2 leading-relaxed font-sans">
                            {ev.description}
                          </p>
                        </div>

                        {/* Card Footer HUD */}
                        <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                          <div className="flex flex-col gap-0.5 text-neutral-400 text-[11px]">
                            <span className="flex items-center gap-1.5 text-white/90">
                              <Clock className="h-3 w-3" style={{ color: dayColor }} />
                              {ev.time}
                            </span>
                            <span className="flex items-center gap-1.5 text-neutral-400">
                              <MapPin className="h-3 w-3 text-neutral-500" />
                              {ev.venue}
                            </span>
                          </div>

                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveModalEvent(ev);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase px-2.5 py-1.5 rounded border border-white/20 bg-white/[0.06] text-white hover:bg-white/15 transition-colors cursor-pointer"
                          >
                            <span>DOSSIER</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </CardSwap>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SECTION 4: REFINED FILTER & SEARCH CONSOLE */}
        {/* ==================================================================== */}
        <div className="mb-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-y border-white/10 py-5">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest mr-2 hidden sm:inline">
              DISCIPLINE:
            </span>
            {CATEGORIES.map((cat) => {
              const count =
                cat === 'All'
                  ? FEST_EVENTS.length
                  : FEST_EVENTS.filter((e) => e.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-sm px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-all border ${
                    selectedCategory === cat
                      ? 'border-white bg-white text-black font-bold'
                      : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white hover:border-white/30'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="ml-1 opacity-60 text-[9px]">({count})</span>
                </button>
              );
            })}

            {/* Saved Manifest Filter Toggle */}
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`rounded-sm px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-all border flex items-center gap-1.5 ${
                showSavedOnly
                  ? 'border-[var(--accent)] bg-[var(--accent)] text-black font-bold'
                  : 'border-white/15 bg-white/5 text-neutral-400 hover:text-white'
              }`}
            >
              <Bookmark className="h-3 w-3" fill={showSavedOnly ? 'currentColor' : 'none'} />
              <span>SAVED ({bookmarkedIds.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search arena, club, venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-sm border border-white/20 bg-black/60 py-1.5 pl-9 pr-7 font-mono text-xs text-white placeholder-neutral-500 focus:border-[var(--accent)] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs font-mono"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SECTION 5: THE EXPEDITION LEDGER (OPTION WHEEL & SWISS MATRIX) */}
        {/* ==================================================================== */}
        <div className="mb-14">
          {/* STICKY EXPEDITION PHASE CONTROLS BAR (PHASE 1, 2, 3 + VIEW TOGGLE) */}
          <div className="sticky top-16 sm:top-20 z-30 bg-[#0A0A0C]/95 backdrop-blur-xl pt-2 pb-3 -mx-2 sm:-mx-4 px-2 sm:px-4 border-y border-white/10 mb-6 shadow-2xl">
            {/* Section 5 Header with View Mode Switcher */}
            <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-2.5 mb-3 gap-3">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                <h3 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-white">
                  EXPEDITION SCHEDULE // DIURNAL PHASES (I, II & III)
                </h3>
              </div>

              {/* View Mode Switcher (OptionWheel HUD vs Swiss Table) */}
              <div className="flex items-center gap-1.5 border border-white/15 bg-white/[0.03] p-1 rounded-sm">
                <button
                  type="button"
                  onClick={() => setLedgerViewMode('wheel')}
                  className={`flex items-center gap-1.5 px-3 py-1 font-mono text-[10px] font-bold uppercase rounded-sm transition-all ${
                    ledgerViewMode === 'wheel'
                      ? 'bg-[var(--accent)] text-black'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <SlidersHorizontal className="h-3 w-3" />
                  <span>OPTION WHEEL HUD</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLedgerViewMode('matrix')}
                  className={`flex items-center gap-1.5 px-3 py-1 font-mono text-[10px] font-bold uppercase rounded-sm transition-all ${
                    ledgerViewMode === 'matrix'
                      ? 'bg-[var(--accent)] text-black'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Layers className="h-3 w-3" />
                  <span>MATRIX LIST</span>
                </button>
              </div>
            </div>

            {/* Diurnal Phase Selector Tabs (Phase 1, Phase 2, Phase 3) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {allPhaseSlots.map((phase) => {
                const isActive = activePhaseSlot === phase.slot;
                return (
                  <button
                    key={phase.slot}
                    type="button"
                    onClick={() => {
                      setActivePhaseSlot(phase.slot);
                      setWheelSelectedIndex(0);
                    }}
                    className={`text-left p-3 sm:p-3.5 rounded-sm border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                      isActive
                        ? 'border-[var(--accent)] bg-[var(--accent)]/[0.08] shadow-[0_0_25px_rgba(56,189,248,0.15)]'
                        : 'border-white/15 bg-[#0C0D12] hover:border-white/30 hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* Top indicator strip */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`font-mono text-[10px] font-bold uppercase tracking-widest ${
                          isActive ? 'text-[var(--accent)]' : 'text-neutral-400'
                        }`}
                      >
                        {phase.shortTitle}
                      </span>
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 rounded-sm font-bold ${
                          isActive
                            ? 'bg-[var(--accent)] text-black'
                            : 'bg-white/10 text-neutral-400'
                        }`}
                      >
                        {phase.events.length} ARENAS
                      </span>
                    </div>

                    {/* Range & Title */}
                    <div>
                      <h4 className="font-mono text-xs sm:text-sm font-bold text-white uppercase tracking-tight">
                        {phase.title.split('//')[1]?.trim() || phase.title}
                      </h4>
                      <span className="font-mono text-[10px] sm:text-[11px] text-neutral-400 block mt-0.5">
                        {phase.range}
                      </span>
                    </div>

                    {/* Active accent underline */}
                    {isActive && (
                      <motion.div
                        layoutId="activePhaseIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* VIEW MODE 1: OPTION WHEEL HUD + REAL-TIME CARD DETAIL PREVIEW */}
          {ledgerViewMode === 'wheel' ? (
            <div className="border border-white/15 bg-[#0C0D12] p-5 sm:p-8 rounded-sm shadow-2xl relative overflow-hidden">
              {/* Technical Crosshairs */}
              <div className="absolute top-0 left-0 h-3 w-3 border-t border-l border-white/40" />
              <div className="absolute top-0 right-0 h-3 w-3 border-t border-r border-white/40" />
              <div className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-white/40" />
              <div className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-white/40" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* LEFT COLUMN: OPTION WHEEL */}
                <div className="lg:col-span-6 flex flex-col justify-center">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5 text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                      <span>{currentActivePhaseSlot.title}</span>
                    </span>
                    <span>
                      {wheelEventTitles.length > 0
                        ? `INDEX ${String(wheelSelectedIndex + 1).padStart(2, '0')} / ${String(
                            wheelEventTitles.length
                          ).padStart(2, '0')}`
                        : 'EMPTY'}
                    </span>
                  </div>

                  {/* OptionWheel Component */}
                  <div
                    data-lenis-prevent="true"
                    data-lenis-prevent-wheel="true"
                    className="relative w-full h-[460px] bg-black/40 border border-white/10 rounded-sm overflow-hidden flex flex-col justify-center"
                  >
                    <OptionWheel
                      key={`wheel-${activePhaseSlot}-${selectedDay}-${selectedCategory}`}
                      items={
                        wheelEventTitles.length > 0
                          ? wheelEventTitles
                          : ['NO ARENAS IN SLOT']
                      }
                      defaultSelected={0}
                      selectedIndex={wheelSelectedIndex}
                      textColor="#a6a6a6"
                      activeColor="#ffffff"
                      side="left"
                      fontSize={2.1}
                      spacing={1.4}
                      curve={1}
                      tilt={6}
                      blur={2}
                      fade={0.25}
                      smoothing={200}
                      inset={60}
                      loop={false}
                      draggable
                      soundUrl="/assets/sounds/click-soft.mp3"
                      soundVolume={0.5}
                      onChange={(index) => {
                        setWheelSelectedIndex(index);
                      }}
                    />
                  </div>

                  {/* Wheel Navigation Controls HUD */}
                  <div className="mt-4 flex items-center justify-between font-mono text-[10px] text-neutral-400 px-1">
                    <span className="tracking-wider">
                      ↕ DRAG · MOUSE WHEEL · ARROW KEYS TO SPIN
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={wheelSelectedIndex <= 0}
                        onClick={() =>
                          setWheelSelectedIndex((prev) => Math.max(0, prev - 1))
                        }
                        className="px-2.5 py-1 border border-white/15 bg-white/5 rounded text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                      >
                        ↑ PREV
                      </button>
                      <button
                        type="button"
                        disabled={
                          wheelSelectedIndex >= wheelEventTitles.length - 1
                        }
                        onClick={() =>
                          setWheelSelectedIndex((prev) =>
                            Math.min(wheelEventTitles.length - 1, prev + 1))
                        }
                        className="px-2.5 py-1 border border-white/15 bg-white/5 rounded text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                      >
                        {`NEXT ${String(wheelSelectedIndex + 2).padStart(2, '0')} `}
                      </button>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: REAL-TIME CARD DETAIL PREVIEW */}
                <div className="lg:col-span-6 w-full flex flex-col justify-center min-h-[460px]">
                  <AnimatePresence mode="wait">
                    {activeWheelEvent ? (
                      <motion.div
                        key={activeWheelEvent.id}
                        initial={{ opacity: 0, y: 14, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -14, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="relative rounded-sm border p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-2xl"
                        style={{
                          backgroundColor: '#0E1017',
                          borderColor: `${ISLAND_METAS[activeWheelEvent.day].accent}44`,
                          boxShadow: `0 20px 50px -15px rgba(0,0,0,0.9), 0 0 30px ${ISLAND_METAS[activeWheelEvent.day].glow}`,
                        }}
                      >
                        {/* Background Halftone & Corner Accents */}
                        <div
                          className="pointer-events-none absolute inset-0 opacity-10"
                          style={{
                            backgroundImage: `radial-gradient(${
                              ISLAND_METAS[activeWheelEvent.day].accent
                            } 1px, transparent 1px)`,
                            backgroundSize: '16px 16px',
                          }}
                        />

                        {/* Top Metadata Row */}
                        <div className="relative z-10 flex items-center justify-between gap-3 mb-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider border"
                              style={{
                                color: ISLAND_METAS[activeWheelEvent.day].accent,
                                borderColor: `${ISLAND_METAS[activeWheelEvent.day].accent}55`,
                                backgroundColor: `${ISLAND_METAS[activeWheelEvent.day].accent}15`,
                              }}
                            >
                              DAY 0{activeWheelEvent.day} // {ISLAND_METAS[activeWheelEvent.day].name}
                            </span>
                            <span className="font-mono text-[10px] text-white/50 border border-white/10 px-2 py-0.5 rounded-sm uppercase">
                              {activeWheelEvent.category}
                            </span>
                            {activeWheelEvent.highlight && (
                              <span className="font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm bg-[var(--accent)] text-black">
                                FLAGSHIP
                              </span>
                            )}
                          </div>

                          {/* Bookmark Star Button */}
                          <button
                            type="button"
                            onClick={(e) => toggleBookmark(activeWheelEvent.id, e)}
                            className={`p-2 rounded-sm border transition-all ${
                              bookmarkedIds.includes(activeWheelEvent.id)
                                ? 'border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--accent)]'
                                : 'border-white/10 bg-white/5 text-white/40 hover:text-white hover:border-white/30'
                            }`}
                            title={
                              bookmarkedIds.includes(activeWheelEvent.id)
                                ? 'Bookmarked in voyage manifest'
                                : 'Save to manifest'
                            }
                          >
                            <Star
                              className="h-4 w-4"
                              fill={
                                bookmarkedIds.includes(activeWheelEvent.id)
                                  ? 'currentColor'
                                  : 'none'
                              }
                            />
                          </button>
                        </div>

                        {/* Event Title & Subtitle */}
                        <div className="relative z-10 mb-4">
                          <h4 className="font-mono text-2xl sm:text-3xl font-black uppercase text-white tracking-tight leading-tight">
                            {activeWheelEvent.name}
                          </h4>
                          {activeWheelEvent.tagline && (
                            <p
                              className="mt-1 font-serif italic text-xs sm:text-sm leading-snug"
                              style={{
                                color: ISLAND_METAS[activeWheelEvent.day].accent,
                              }}
                            >
                              "{activeWheelEvent.tagline}"
                            </p>
                          )}
                          <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans font-light">
                            {activeWheelEvent.description}
                          </p>
                        </div>

                        {/* Telemetry HUD Grid */}
                        <div className="relative z-10 pt-4 border-t border-white/10 grid grid-cols-2 gap-3 font-mono text-[11px] mb-6">
                          <div className="flex items-center gap-2 text-white/90">
                            <Clock
                              className="h-3.5 w-3.5"
                              style={{
                                color: ISLAND_METAS[activeWheelEvent.day].accent,
                              }}
                            />
                            <span>{activeWheelEvent.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-neutral-300">
                            <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                            <span className="truncate">{activeWheelEvent.venue}</span>
                          </div>
                          <div className="flex items-center gap-2 text-neutral-400 col-span-2">
                            <span className="text-white/40">HOST SOCIETY:</span>
                            <span className="text-white/80 font-serif italic">
                              {activeWheelEvent.club}
                            </span>
                          </div>
                          {activeWheelEvent.format && (
                            <div className="flex items-center gap-2 text-neutral-400 col-span-2">
                              <span className="text-white/40">ARENA FORMAT:</span>
                              <span className="text-[var(--accent)] font-mono">
                                {activeWheelEvent.format}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Interactive CTAs */}
                        <div className="relative z-10 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setActiveModalEvent(activeWheelEvent)}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm font-mono text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-colors shadow-lg cursor-pointer"
                          >
                            <span>OPEN ARENA DOSSIER</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => toggleBookmark(activeWheelEvent.id, e)}
                            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-sm font-mono text-xs text-neutral-300 border border-white/20 bg-white/5 hover:border-white/40 hover:text-white transition-colors"
                          >
                            <Bookmark
                              className="h-3.5 w-3.5"
                              fill={
                                bookmarkedIds.includes(activeWheelEvent.id)
                                  ? 'currentColor'
                                  : 'none'
                              }
                            />
                            <span className="hidden sm:inline">
                              {bookmarkedIds.includes(activeWheelEvent.id)
                                ? 'SAVED'
                                : 'SAVE'}
                            </span>
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="h-[460px] border border-dashed border-white/15 bg-white/[0.02] p-8 text-center flex flex-col items-center justify-center rounded-sm">
                        <Info className="h-8 w-8 text-white/30 mb-3" />
                        <h4 className="font-mono text-sm uppercase font-bold text-white mb-1">
                          NO ARENAS IN THIS DIURNAL PHASE
                        </h4>
                        <p className="font-mono text-xs text-neutral-400 max-w-sm">
                          Try switching to another diurnal phase or resetting your discipline filters.
                        </p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ) : (
            /* VIEW MODE 2: SWISS TIMETABLE MATRIX ROWS */
            <div className="space-y-12">
              {phaseSlots.map((phase) => (
                <div
                  key={phase.slot}
                  className="border border-white/15 bg-[#0C0D12] p-5 sm:p-7 rounded-sm shadow-xl"
                >
                  {/* Phase Header */}
                  <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 mb-4 gap-2 font-mono">
                    <div className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white">
                        {phase.title}
                      </h3>
                      <span className="text-white/40 text-[10px] hidden sm:inline">
                        [{phase.range}]
                      </span>
                    </div>
                    <div className="text-[10px] text-white/50 tracking-wider">
                      {phase.events.length} ARENAS SCHEDULED
                    </div>
                  </div>

                  {/* Events Row List */}
                  <div className="divide-y divide-white/10">
                    {phase.events.map((ev) => {
                      const meta = ISLAND_METAS[ev.day];
                      const isSaved = bookmarkedIds.includes(ev.id);

                      return (
                        <article
                          key={ev.id}
                          onClick={() => setActiveModalEvent(ev)}
                          className="group flex flex-col lg:flex-row lg:items-center justify-between py-5 px-3 hover:bg-white/[0.04] transition-all duration-200 cursor-pointer gap-4 rounded-sm"
                        >
                          {/* Left: Day & Time Column */}
                          <div className="flex items-center gap-4 lg:w-64 flex-shrink-0">
                            <span
                              className="font-mono text-[10px] font-bold px-2 py-1 rounded-sm border uppercase"
                              style={{
                                color: meta.accent,
                                backgroundColor: `${meta.accent}15`,
                                borderColor: `${meta.accent}40`,
                              }}
                            >
                              DAY 0{ev.day} · {meta.name.split(' ')[0]}
                            </span>
                            <div className="font-mono text-xs text-white/90 font-semibold flex items-center gap-1.5">
                              <Clock className="h-3 w-3 text-white/40" />
                              <span>{ev.time}</span>
                            </div>
                          </div>

                          {/* Center: Event Name, Format Badge & Host Club */}
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <h4 className="font-mono text-lg sm:text-xl font-bold text-white group-hover:text-[var(--accent)] transition-colors leading-snug">
                                {ev.name}
                              </h4>
                              {ev.highlight && (
                                <span
                                  className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider"
                                  style={{
                                    color: meta.accent,
                                    backgroundColor: `${meta.accent}20`,
                                  }}
                                >
                                  FLAGSHIP
                                </span>
                              )}
                              {ev.format && (
                                <span className="font-mono text-[10px] text-white/70 bg-white/5 border border-white/10 px-2 py-0.5 rounded-sm">
                                  {ev.format}
                                </span>
                              )}
                            </div>

                            <div className="mt-1.5 flex flex-wrap items-center gap-2.5 font-mono text-[11px] text-neutral-400">
                              <span className="font-serif italic text-white/70">By {ev.club}</span>
                              <span className="text-white/20">|</span>
                              <span className="text-white/50 uppercase tracking-wider">{ev.category}</span>
                              <span className="text-white/20">|</span>
                              <span className="text-xs text-neutral-400 line-clamp-1 max-w-md font-sans font-light">
                                {ev.description}
                              </span>
                            </div>
                          </div>

                          {/* Right: Venue & Tactical Actions */}
                          <div className="flex items-center justify-between lg:justify-end gap-5 lg:w-72 flex-shrink-0">
                            <div className="flex items-center gap-1.5 font-mono text-[11px] text-white/70">
                              <MapPin className="h-3.5 w-3.5 text-white/40" />
                              <span className="truncate max-w-[140px]">{ev.venue}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Star / Bookmark Button */}
                              <button
                                type="button"
                                onClick={(e) => toggleBookmark(ev.id, e)}
                                aria-label={isSaved ? 'Remove from manifest' : 'Save to manifest'}
                                className={`p-2 rounded-sm border transition-all ${
                                  isSaved
                                    ? 'border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--accent)]'
                                    : 'border-white/10 bg-white/5 text-white/40 hover:text-white hover:border-white/30'
                                }`}
                              >
                                <Star className="h-3.5 w-3.5" fill={isSaved ? 'currentColor' : 'none'} />
                              </button>

                              {/* Inspect Dossier Button */}
                              <span className="inline-flex items-center gap-1 border border-white/20 bg-white/5 px-2.5 py-1.5 font-mono text-[10px] font-bold text-white group-hover:bg-white group-hover:text-black transition-all rounded-sm">
                                <span>DOSSIER</span>
                                <ArrowUpRight className="h-3 w-3" />
                              </span>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="border border-white/15 bg-white/[0.02] p-12 text-center my-10 rounded-sm">
            <p className="font-mono text-sm text-neutral-400 uppercase tracking-widest">
              No festival arenas match your current expedition filters.
            </p>
            <button
              onClick={() => {
                setSelectedDay('all');
                setSelectedCategory('All');
                setSearchQuery('');
                setShowSavedOnly(false);
              }}
              className="mt-5 rounded-full bg-[var(--accent)] text-black px-6 py-2.5 font-mono text-xs font-bold tracking-wider uppercase hover:bg-yellow-400 transition-colors"
            >
              RESET ALL SELECTIONS
            </button>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* MODAL 1: CLASSIFIED ARENA MISSION DOSSIER */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {activeModalEvent && (
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 animate-in fade-in duration-200"
            onClick={() => setActiveModalEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="editorial-frame relative w-full max-w-2xl p-6 sm:p-9 bg-[#0E0E14] border border-white/20 shadow-2xl rounded-sm text-left max-h-[92vh] overflow-y-auto"
            >
              {/* Corner Brackets */}
              <div className="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-[var(--accent)]" />
              <div className="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-[var(--accent)]" />
              <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-[var(--accent)]" />
              <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-[var(--accent)]" />

              {/* Close Button */}
              <button
                onClick={() => setActiveModalEvent(null)}
                className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Close dossier"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Header Dossier Metadata */}
              <div className="border-b border-white/15 pb-4 mb-5">
                <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-[var(--accent)] tracking-widest uppercase mb-2">
                  <span>EXPEDITION DOSSIER // DAY 0{activeModalEvent.day}</span>
                  <span className="text-white/30">|</span>
                  <span>{activeModalEvent.category.toUpperCase()} DISCIPLINE</span>
                  {activeModalEvent.highlight && (
                    <>
                      <span className="text-white/30">|</span>
                      <span className="text-[#F5C542] font-bold">MARQUEE COMPETITION</span>
                    </>
                  )}
                </div>

                <h3 className="font-mono text-2xl sm:text-4xl font-black text-white leading-tight">
                  {activeModalEvent.name}
                </h3>

                {activeModalEvent.format && (
                  <div className="mt-2 inline-flex items-center gap-1.5 border border-white/20 bg-white/5 px-2.5 py-0.5 font-mono text-xs text-neutral-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    <span>FORMAT: {activeModalEvent.format.toUpperCase()}</span>
                  </div>
                )}
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs mb-6">
                <div className="border border-white/10 bg-white/[0.02] p-3 rounded-sm">
                  <span className="text-[10px] text-white/40 block uppercase">SCHEDULE</span>
                  <strong className="text-white mt-1 block">{activeModalEvent.time}</strong>
                </div>

                <div className="border border-white/10 bg-white/[0.02] p-3 rounded-sm">
                  <span className="text-[10px] text-white/40 block uppercase">LOCATION</span>
                  <strong className="text-white mt-1 block truncate">{activeModalEvent.venue}</strong>
                </div>

                <div className="border border-white/10 bg-white/[0.02] p-3 rounded-sm col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-white/40 block uppercase">ORGANIZER</span>
                  <strong className="text-white mt-1 block truncate">{activeModalEvent.club}</strong>
                </div>
              </div>

              {/* Event Description */}
              <div className="mb-6 space-y-2">
                <h4 className="font-mono text-xs uppercase tracking-wider text-white/60">
                  // ARENA BRIEFING & DIRECTIVES
                </h4>
                <p className="font-sans text-sm text-neutral-300 leading-relaxed font-light">
                  {activeModalEvent.description}
                </p>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-white/15">
                <button
                  type="button"
                  onClick={() => toggleBookmark(activeModalEvent.id)}
                  className={`flex items-center justify-center gap-2 px-5 py-2.5 font-mono text-xs font-bold tracking-wider uppercase rounded-sm border transition-all ${
                    bookmarkedIds.includes(activeModalEvent.id)
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-black'
                      : 'border-white/20 bg-white/5 text-white hover:border-white'
                  }`}
                >
                  <Star className="h-4 w-4" fill={bookmarkedIds.includes(activeModalEvent.id) ? 'currentColor' : 'none'} />
                  <span>
                    {bookmarkedIds.includes(activeModalEvent.id)
                      ? 'SAVED TO MANIFEST'
                      : 'SAVE TO MY MANIFEST'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModalEvent(null)}
                  className="px-5 py-2.5 font-mono text-xs text-white/60 hover:text-white transition-colors"
                >
                  DISMISS DOSSIER
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* MODAL 2: "MY EXPEDITION MANIFEST" (SAVED ITINERARY SUMMARY) */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {manifestModalOpen && (
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 animate-in fade-in duration-200"
            onClick={() => setManifestModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="editorial-frame relative w-full max-w-3xl p-6 sm:p-9 bg-[#0E0E14] border border-[var(--accent)] shadow-2xl rounded-sm text-left max-h-[92vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setManifestModalOpen(false)}
                className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Close manifest"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="border-b border-white/15 pb-4 mb-6">
                <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--accent)] tracking-widest uppercase mb-1">
                  <Star className="h-3.5 w-3.5" fill="currentColor" />
                  <span>PERSONAL EXPEDITION MANIFEST</span>
                </div>
                <h3 className="font-mono text-2xl sm:text-3xl font-black text-white">
                  YOUR AVINYA 2027 SCHEDULE
                </h3>
                <p className="mt-1 font-serif text-sm italic text-neutral-300">
                  {savedManifestEvents.length} arenas chartered across IIIT Dharwad campus grounds.
                </p>
              </div>

              {savedManifestEvents.length === 0 ? (
                <div className="py-12 text-center font-mono">
                  <p className="text-sm text-white/50">YOUR MANIFEST IS CURRENTLY EMPTY.</p>
                  <p className="mt-2 text-xs text-white/30">
                    Click the star icon on any arena row in the ledger to bookmark it to your voyage itinerary.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {savedManifestEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-center justify-between border border-white/10 bg-white/[0.02] p-4 rounded-sm"
                    >
                      <div>
                        <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--accent)]">
                          <span>DAY 0{ev.day}</span>
                          <span>·</span>
                          <span>{ev.time}</span>
                          <span>·</span>
                          <span className="text-white/50">{ev.venue}</span>
                        </div>
                        <h4 className="font-mono text-base font-bold text-white mt-1">
                          {ev.name}
                        </h4>
                        <div className="font-serif text-xs italic text-neutral-400 mt-0.5">
                          {ev.club} ({ev.category})
                        </div>
                      </div>

                      <button
                        onClick={() => toggleBookmark(ev.id)}
                        className="font-mono text-xs text-red-400 hover:text-red-300 px-3 py-1"
                      >
                        REMOVE
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                <div className="text-white/50">
                  DATES: 12, 13 & 14 MARCH 2027 // IIIT DHARWAD
                </div>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white hover:text-black transition-colors rounded-sm"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>PRINT / EXPORT ITINERARY</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}