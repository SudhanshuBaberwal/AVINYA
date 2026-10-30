'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FEST_EVENTS, CATEGORIES, EventCategory, EventItem } from '@/data/events';
import EventCard from './EventCard';
import CircularGallery from './reactbits/CircularGallery';
import CardStack from './reactbits/CardStack';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Filter, Calendar, X, Clock, MapPin, Users, ArrowUpRight, Check } from 'lucide-react';

export default function Events() {
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [activeModalEvent, setActiveModalEvent] = useState<EventItem | null>(null);
  const [modalRegistered, setModalRegistered] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Listen for custom deep link event from Island components
  useEffect(() => {
    const handleSelectDay = (e: Event) => {
      const customEvent = e as CustomEvent<{ day: 1 | 2 | 3 }>;
      if (customEvent.detail?.day) {
        setSelectedDay(customEvent.detail.day);
      }
    };

    window.addEventListener('avinya:select-day', handleSelectDay);
    return () => window.removeEventListener('avinya:select-day', handleSelectDay);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalEvent(null);
      }
    };
    if (activeModalEvent) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [activeModalEvent]);

  // Filter events by day, category, and search query
  const filteredEvents = useMemo(() => {
    return FEST_EVENTS.filter((event) => {
      const matchesDay = selectedDay === 'all' || event.day === selectedDay;
      const matchesCategory =
        selectedCategory === 'All' || event.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.club.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDay && matchesCategory && matchesSearch;
    });
  }, [selectedDay, selectedCategory, searchQuery]);

  // Highlighted/Featured events for gallery
  const featuredEvents = useMemo(() => {
    return FEST_EVENTS.filter((e) => e.highlight);
  }, []);

  return (
    <section
      id="events"
      className="relative min-h-[100svh] w-full bg-[#0A0A0C] py-20 sm:py-28 px-4 sm:px-8 border-b border-white/10"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-[var(--accent)] uppercase rounded-full mb-3">
            <Calendar className="h-3 w-3" />
            <span>FESTIVAL SCHEDULE // 24+ ARENAS</span>
          </div>

          <h2 className="font-mono text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            COMPETITIONS & SHOWCASES
          </h2>

          <p className="mt-3 font-serif text-base sm:text-xl italic text-neutral-400 max-w-2xl">
            From quantum circuits and agentic AI hacks to rock battles and theatrical street drama.
          </p>
        </div>

        {/* FEATURED EVENTS SPOTLIGHT: Circular Gallery (Desktop) / CardStack (Mobile) */}
        <div className="mb-16 border border-white/15 bg-white/[0.02] p-6 rounded-sm">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
            <h3 className="font-mono text-sm sm:text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--accent)]" />
              <span>HEADLINE ARENA HIGHLIGHTS</span>
            </h3>
            <span className="font-mono text-[10px] text-[var(--accent)] uppercase">
              {featuredEvents.length} KEY SHOWDOWNS
            </span>
          </div>

          {!isMobile ? (
            <CircularGallery events={featuredEvents} radius={500} />
          ) : (
            <CardStack events={featuredEvents} />
          )}
        </div>

        {/* FILTER BAR: Day Tabs, Category Chips, and Search */}
        <div className="mb-10 flex flex-col gap-6">
          {/* Day Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-white/15 pb-6">
            <button
              onClick={() => setSelectedDay('all')}
              className={`rounded-full px-5 py-2 font-mono text-xs font-bold tracking-wider uppercase transition-all ${
                selectedDay === 'all'
                  ? 'bg-[var(--accent)] text-black shadow-[0_0_15px_var(--glow-accent)]'
                  : 'bg-white/5 text-neutral-400 hover:text-white border border-white/15'
              }`}
            >
              ALL THREE DAYS
            </button>

            <button
              onClick={() => setSelectedDay(1)}
              className={`rounded-full px-5 py-2 font-mono text-xs font-bold tracking-wider uppercase transition-all ${
                selectedDay === 1
                  ? 'bg-[#E07A2E] text-black shadow-[0_0_15px_rgba(224,122,46,0.5)]'
                  : 'bg-white/5 text-neutral-400 hover:text-white border border-white/15'
              }`}
            >
              DAY 01 · 12 MAR (OUTPOST)
            </button>

            <button
              onClick={() => setSelectedDay(2)}
              className={`rounded-full px-5 py-2 font-mono text-xs font-bold tracking-wider uppercase transition-all ${
                selectedDay === 2
                  ? 'bg-[#FF2E93] text-black shadow-[0_0_15px_rgba(255,46,147,0.5)]'
                  : 'bg-white/5 text-neutral-400 hover:text-white border border-white/15'
              }`}
            >
              DAY 02 · 13 MAR (PANDEMONIUM)
            </button>

            <button
              onClick={() => setSelectedDay(3)}
              className={`rounded-full px-5 py-2 font-mono text-xs font-bold tracking-wider uppercase transition-all ${
                selectedDay === 3
                  ? 'bg-[#FFB703] text-black shadow-[0_0_15px_rgba(255,183,3,0.5)]'
                  : 'bg-white/5 text-neutral-400 hover:text-white border border-white/15'
              }`}
            >
              DAY 03 · 14 MAR (CARNIVAL)
            </button>
          </div>

          {/* Category Chips & Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Chips */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-all ${
                    selectedCategory === cat
                      ? 'bg-white text-black font-bold'
                      : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search event, club, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-white/15 bg-black/50 py-1.5 pl-9 pr-4 font-mono text-xs text-white placeholder-neutral-500 focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Active Filter Summary */}
        <div className="mb-6 flex items-center justify-between font-mono text-xs text-neutral-400 border-b border-white/10 pb-3">
          <span>
            SHOWING <strong className="text-white">{filteredEvents.length}</strong> EVENTS
          </span>
          <span className="text-[10px] text-white/50 uppercase">
            CLICK CARD TO REGISTER INTEREST
          </span>
        </div>

        {/* EVENTS GRID WITH ANIMATION */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <EventCard
                  event={event}
                  onCardClick={(e) => {
                    setActiveModalEvent(e);
                    setModalRegistered(false);
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredEvents.length === 0 && (
          <div className="editorial-frame p-12 text-center my-8">
            <p className="font-mono text-base text-neutral-400">
              No events found matching your filter criteria.
            </p>
            <button
              onClick={() => {
                setSelectedDay('all');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 rounded-full bg-[var(--accent)] text-black px-4 py-2 font-mono text-xs font-bold uppercase"
            >
              RESET ALL FILTERS
            </button>
          </div>
        )}
      </div>

      {/* EVENT DOSSIER DETAIL MODAL */}
      <AnimatePresence>
        {activeModalEvent && (
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-in fade-in duration-200"
            onClick={() => setActiveModalEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="editorial-frame relative w-full max-w-xl p-6 sm:p-8 bg-[#0E0E14] border border-[var(--accent)] shadow-[0_0_40px_var(--glow-accent)] rounded-lg text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalEvent(null)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--accent)] tracking-widest uppercase mb-1">
                  <span>DAY 0{activeModalEvent.day} // {activeModalEvent.category}</span>
                  {activeModalEvent.highlight && (
                    <span className="flex items-center gap-1 text-[#F5C542] border border-[#F5C542]/30 px-2 py-0.5 rounded bg-[#F5C542]/10">
                      <Sparkles className="h-3 w-3" />
                      HEADLINE ARENA
                    </span>
                  )}
                </div>
                <h3 className="font-mono text-2xl sm:text-3xl font-black text-white">
                  {activeModalEvent.name}
                </h3>
                <div className="mt-1 flex items-center gap-2 font-serif text-sm italic text-[var(--accent)]">
                  <Users className="h-3.5 w-3.5 opacity-80" />
                  <span>Organized by {activeModalEvent.club}</span>
                </div>
              </div>

              {/* Event Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-5 font-mono text-xs">
                <div className="border border-white/10 bg-white/5 p-3 rounded">
                  <span className="flex items-center gap-1.5 text-neutral-400 text-[10px] uppercase mb-1">
                    <Clock className="h-3 w-3 text-[var(--accent)]" />
                    TIME & SCHEDULE
                  </span>
                  <span className="text-white font-semibold">{activeModalEvent.time}</span>
                </div>

                <div className="border border-white/10 bg-white/5 p-3 rounded">
                  <span className="flex items-center gap-1.5 text-neutral-400 text-[10px] uppercase mb-1">
                    <MapPin className="h-3 w-3 text-[var(--accent)]" />
                    VENUE LOCATION
                  </span>
                  <span className="text-white font-semibold">{activeModalEvent.venue}</span>
                </div>
              </div>

              {/* Full Description & Rules */}
              <div className="mb-6">
                <h4 className="font-mono text-[11px] text-white/60 uppercase tracking-wider mb-2">
                  ARENA BRIEFING
                </h4>
                <p className="text-sm text-neutral-200 leading-relaxed font-sans">
                  {activeModalEvent.description}
                </p>
                {activeModalEvent.tagline && (
                  <p className="mt-3 font-serif italic text-xs text-[var(--accent)]">
                    &ldquo;{activeModalEvent.tagline}&rdquo;
                  </p>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => setModalRegistered(true)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-full py-3 px-6 font-mono text-xs font-bold tracking-wider uppercase transition-all w-full ${
                    modalRegistered
                      ? 'border border-emerald-500 bg-emerald-950/40 text-emerald-300'
                      : 'bg-[var(--accent)] text-black hover:bg-yellow-400 shadow-[0_0_15px_var(--glow-accent)]'
                  }`}
                >
                  {modalRegistered ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>ARENA INTEREST LOGGED</span>
                    </>
                  ) : (
                    <>
                      <span>REGISTER INTEREST FOR THIS ARENA</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => setActiveModalEvent(null)}
                  className="rounded-full border border-white/20 bg-white/5 px-5 py-3 font-mono text-xs text-white hover:bg-white/10 transition-colors w-full sm:w-auto"
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
