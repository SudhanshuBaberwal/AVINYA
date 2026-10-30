'use client';

import React, { useRef, useState, useEffect } from 'react';
import { EventItem } from '@/data/events';
import { ChevronLeft, ChevronRight, Sparkles, Clock, MapPin } from 'lucide-react';

interface CircularGalleryProps {
  events: EventItem[];
  radius?: number;
}

export default function CircularGallery({
  events,
  radius = 520,
}: CircularGalleryProps) {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const count = Math.max(events.length, 1);
  const angleStep = 360 / count;

  const rawIndex = Math.round(((-rotation % 360) + 360) / angleStep) % count;
  const activeIndex = (rawIndex + count) % count;
  const activeEvent = events[activeIndex] || events[0];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX;
    setRotation((prev) => prev + delta * 0.25);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => setIsDragging(false);

  const next = () => setRotation((prev) => prev - angleStep);
  const prev = () => setRotation((prev) => prev + angleStep);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[480px] w-full flex-col items-center justify-center overflow-hidden py-6 select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 3D Perspective Scene */}
      <div
        className="relative h-[320px] w-[260px] cursor-grab active:cursor-grabbing"
        style={{ perspective: 1200 }}
      >
        <div
          className="relative h-full w-full transition-transform duration-300 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateZ(-${radius}px) rotateY(${rotation}deg)`,
          }}
        >
          {events.map((event, i) => {
            const angle = i * angleStep;
            const isCurrent = i === activeIndex;

            return (
              <div
                key={event.id}
                className={`absolute inset-0 rounded-lg border p-5 transition-all duration-300 backdrop-blur-xl ${
                  isCurrent
                    ? 'border-[var(--accent)] bg-[#0E0E14]/90 shadow-[0_0_30px_var(--glow-accent)] scale-105'
                    : 'border-white/15 bg-[#0A0A0C]/75 opacity-60'
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between font-mono text-[9px] text-[var(--accent)] mb-2 uppercase">
                      <span>FEATURED // DAY 0{event.day}</span>
                      <Sparkles className="h-3 w-3" />
                    </div>

                    <h4 className="font-mono text-base font-bold text-white line-clamp-2">
                      {event.name}
                    </h4>

                    <p className="font-serif text-xs italic text-neutral-300 mt-1">
                      {event.club}
                    </p>

                    <p className="mt-3 text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 font-mono text-[10px] text-neutral-400 flex justify-between">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-[var(--accent)]" />
                      {event.time.split('–')[0]}
                    </span>
                    <span className="flex items-center gap-1 text-white/60">
                      <MapPin className="h-3 w-3" />
                      {event.venue.split('/')[0]}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Event Name Badge Below */}
      <div className="mt-6 flex flex-col items-center text-center">
        <p className="font-mono text-xs tracking-[0.25em] text-[var(--accent)] uppercase">
          // SPOTLIGHT ARENA {activeIndex + 1} OF {events.length}
        </p>
        <p className="mt-1 font-mono text-lg font-black uppercase text-white">
          {activeEvent?.name}
        </p>
        <p className="font-serif text-xs italic text-neutral-400">
          Organized by {activeEvent?.club}
        </p>
      </div>

      {/* Navigation Arrows */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={prev}
          aria-label="Previous featured event"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="font-mono text-[10px] tracking-widest text-white/40">
          DRAG TO ROTATE
        </span>

        <button
          onClick={next}
          aria-label="Next featured event"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
