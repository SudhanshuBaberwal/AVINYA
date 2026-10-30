'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Camera, ChevronLeft, ChevronRight } from 'lucide-react';

const GLIMPSES = [
  {
    id: 1,
    image: '/images/glimpses/1.jpg',
    title: 'The Electric Mainstage',
    sub: 'Battle of the Bands // Night Revelry',
    ref: 'IRIDESCENCE 01 / 04',
  },
  {
    id: 2,
    image: '/images/glimpses/2.jpg',
    title: 'Hack2Future Arena',
    sub: '36-Hour National Code Sprint',
    ref: 'IRIDESCENCE 02 / 04',
  },
  {
    id: 3,
    image: '/images/glimpses/3.jpg',
    title: 'Choreographic Fusion',
    sub: 'Dynamight Crew Showdown',
    ref: 'IRIDESCENCE 03 / 04',
  },
  {
    id: 4,
    image: '/images/glimpses/4.jpg',
    title: 'Avant-Garde Runway',
    sub: 'Couture Fashion Exhibition',
    ref: 'IRIDESCENCE 04 / 04',
  },
];

export default function Glimpses() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -340 : 340;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const scrollLeft = scrollContainerRef.current.scrollLeft;
    const cardWidth = 320;
    const newIndex = Math.min(
      GLIMPSES.length - 1,
      Math.max(0, Math.round(scrollLeft / cardWidth))
    );
    setActiveIndex(newIndex);
  };

  return (
    <section
      id="glimpses"
      className="relative min-h-[85svh] w-full bg-[#0A0A0C] py-20 sm:py-28 px-4 sm:px-8 border-b border-white/10 overflow-hidden"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-[var(--accent)] uppercase mb-2">
              <Camera className="h-3 w-3" />
              <span>IRIDESCENCE ARCHIVES</span>
            </div>
            <h2 className="font-mono text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
              GLIMPSES FROM PAST VOYAGES
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              aria-label="Previous glimpse"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-mono text-xs text-white/50">
              {GLIMPSES[activeIndex]?.ref}
            </span>
            <button
              onClick={() => scroll('right')}
              aria-label="Next glimpse"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* CURVED FILM-STRIP GALLERY (Exact Match: Reference Image 4 Iridescence 01/12) */}
        <div className="relative my-6 py-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0E0E14]/80 p-4 sm:p-8">
          {/* Top-Right Reload Icon Button from Reference Image 4 */}
          <div className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/5 border border-white/15 text-white/60">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M21 21v-5h-5" />
            </svg>
          </div>

          {/* S-Wave Ribbon Silhouette from Reference 4 */}
          <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden flex items-center">
            <svg
              className="w-full h-80 text-white/30"
              viewBox="0 0 1200 300"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M 0 150 C 300 150, 400 80, 600 120 C 800 160, 950 60, 1200 90 L 1200 240 C 950 200, 800 270, 600 230 C 400 190, 300 260, 0 260 Z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Left Spiral Fan Motif from Reference 4 */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 hidden md:block z-10">
            <svg width="80" height="160" viewBox="0 0 80 160" fill="none">
              {[...Array(6)].map((_, i) => (
                <path
                  key={i}
                  d={`M 10 80 Q ${25 + i * 7} ${15 + i * 12}, ${55 + i * 3} 80 Q ${25 + i * 7} ${145 - i * 12}, 10 80`}
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1.5"
                  fill="none"
                />
              ))}
            </svg>
          </div>

          {/* Horizontally scrolling cards */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="relative z-10 flex gap-6 overflow-x-auto pb-6 pt-4 scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing"
            style={{
              perspective: 1000,
            }}
          >
            {GLIMPSES.map((item, idx) => {
              const isCenter = activeIndex === idx;
              return (
                <div
                  key={item.id}
                  className="group relative flex-none w-[260px] sm:w-[320px] aspect-[3/4] editorial-frame overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:border-[var(--accent)]"
                  style={{
                    transform: `rotateY(${(idx - activeIndex) * 4}deg)`,
                  }}
                >
                  {/* Image */}
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="320px"
                    className="object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-700 ease-out"
                  />

                  {/* Halftone Mask that resolves on hover */}
                  <div className="absolute inset-0 halftone-bg opacity-30 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none text-white" />

                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Filmstrip Frame Caption */}
                  <div className="absolute bottom-0 inset-x-0 p-5 font-mono">
                    <div className="text-[10px] tracking-widest text-[var(--accent)] uppercase mb-1">
                      {item.ref}
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[var(--accent)] transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-serif text-xs italic text-neutral-300 mt-0.5">
                      {item.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Filmstrip Bottom Badge (Exact typography to Reference 4) */}
          <div className="relative z-10 mt-6 flex flex-col items-center text-center">
            <p className="font-sans text-sm sm:text-base font-semibold tracking-tight text-white">
              Iridescence
            </p>
            <p className="font-mono text-xs text-white/50 tracking-widest mt-0.5">
              01 / 12
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
