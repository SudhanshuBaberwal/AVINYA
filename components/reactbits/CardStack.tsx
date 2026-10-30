'use client';

import React, { useState } from 'react';
import { EventItem } from '@/data/events';
import { ChevronLeft, ChevronRight, Sparkles, Clock, MapPin } from 'lucide-react';

interface CardStackProps {
  events: EventItem[];
}

export default function CardStack({ events }: CardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto py-6">
      {/* Cards Stack */}
      <div className="relative h-[280px] w-full">
        {events.map((event, i) => {
          const offset = (i - currentIndex + events.length) % events.length;
          // Only render top 3 cards in stack
          if (offset > 2 && offset < events.length - 1) return null;

          const isTop = offset === 0;
          const translateY = offset * 12;
          const scale = 1 - offset * 0.05;
          const opacity = 1 - offset * 0.25;

          return (
            <div
              key={event.id}
              className={`editorial-frame absolute inset-0 p-5 rounded-lg flex flex-col justify-between transition-all duration-300 ${
                isTop
                  ? 'z-20 border-[var(--accent)] bg-[#0E0E14] shadow-2xl'
                  : 'z-10 bg-[#0A0A0C]/80 pointer-events-none'
              }`}
              style={{
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity: opacity,
              }}
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] text-[var(--accent)] mb-2">
                  <span className="font-bold">DAY 0{event.day} // {event.category}</span>
                  <Sparkles className="h-3 w-3" />
                </div>
                <h4 className="font-mono text-lg font-bold text-white">
                  {event.name}
                </h4>
                <p className="font-serif text-xs italic text-[var(--accent)] mt-0.5">
                  {event.club}
                </p>
                <p className="mt-3 text-xs text-neutral-300 line-clamp-3 leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 font-mono text-[10px] text-neutral-400 flex justify-between">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-[var(--accent)]" />
                  {event.time}
                </span>
                <span className="flex items-center gap-1 text-white/70">
                  <MapPin className="h-3 w-3" />
                  {event.venue}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stack Controls: Arrows and Dots */}
      <div className="mt-8 flex items-center justify-between w-full px-4">
        <button
          onClick={prev}
          aria-label="Previous card"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Dot Pagination */}
        <div className="flex items-center gap-1.5">
          {events.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx
                  ? 'w-6 bg-[var(--accent)]'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label="Next card"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
