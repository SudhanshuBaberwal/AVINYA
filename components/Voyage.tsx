'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ISLANDS } from '@/data/content';
import Island from './Island';
import Boat from './Boat';
import { gsap } from '@/lib/gsap';

export default function Voyage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const boatRef = useRef<HTMLDivElement>(null);
  const [activeIslandIndex, setActiveIslandIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const activeIdxRef = useRef(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile || prefersReducedMotion) return;

    const container = containerRef.current;
    const path = pathRef.current;
    const boat = boatRef.current;
    if (!container || !path || !boat) return;

    const pathLength = path.getTotalLength();

    // Pre-calculate 250 sampled points along the curve once to eliminate CPU-heavy getPointAtLength calls during scroll
    const SAMPLES = 250;
    const pointsTable = Array.from({ length: SAMPLES }, (_, i) => {
      const t = i / (SAMPLES - 1);
      const pt = path.getPointAtLength(t * pathLength);
      const nextPt = path.getPointAtLength(Math.min(pathLength, (t + 0.005) * pathLength));
      const angle = (Math.atan2(nextPt.y - pt.y, nextPt.x - pt.x) * 180) / Math.PI;
      return { x: pt.x, y: pt.y, angle };
    });

    // GSAP ScrollTrigger timeline pinning the Voyage container
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=300%',
          scrub: 0.25,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;

            // Instant lookup from precomputed points (0ms overhead)
            const idx = Math.min(SAMPLES - 1, Math.max(0, Math.round(p * (SAMPLES - 1))));
            const s = pointsTable[idx];

            // Move boat along the curve with GPU acceleration
            gsap.set(boat, {
              x: s.x,
              y: s.y,
              rotation: s.angle,
              transformOrigin: '50% 50%',
              force3D: true,
            });

            // Smooth cross-fade between the 3 island layers (only update state when changed!)
            const nextIdx = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
            if (activeIdxRef.current !== nextIdx) {
              activeIdxRef.current = nextIdx;
              setActiveIslandIndex(nextIdx);
            }
          },
        },
      });

      // Animate the path stroke drawing
      tl.fromTo(
        path,
        { strokeDashoffset: pathLength, strokeDasharray: pathLength },
        { strokeDashoffset: 0, ease: 'none' }
      );
    }, container);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section id="voyage" className="relative w-full overflow-hidden bg-[#0A0A0C]">
      {/* Voyage Section Header / Transition Marker */}
      <div className="relative z-20 flex flex-col items-center justify-center border-b border-white/10 bg-[#0A0A0C] py-8 text-center px-4">
        <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-[var(--accent)] uppercase rounded-full">
          <span>// ACT I : THE VOYAGE</span>
        </div>
        <h2 className="mt-2 font-mono text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
          THE THREE ISLANDS OF AVINYA
        </h2>
        <p className="mt-1 font-serif text-sm sm:text-base italic text-neutral-400">
          Scroll to navigate your vessel through the days of the festival
        </p>
      </div>

      {/* DESKTOP PINNED VOYAGE SCENERY */}
      {!isMobile ? (
        <div
          ref={containerRef}
          className="relative h-[100svh] w-full overflow-hidden"
        >
          {/* Layered Island Slides with GPU Accelerated Crossfade */}
          <div className="absolute inset-0">
            {ISLANDS.map((island, index) => {
              const isActive = activeIslandIndex === index;
              return (
                <div
                  key={island.slug}
                  className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                    isActive ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
                  }`}
                  style={{
                    willChange: 'opacity',
                  }}
                >
                  <Island island={island} isActive={isActive} />
                </div>
              );
            })}
          </div>

          {/* SVG Sea Route Canvas Overlay */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            <svg
              className="h-full w-full"
              viewBox="0 0 1440 900"
              fill="none"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Halftone shadow route */}
              <path
                d="M 120 780 C 400 780, 480 320, 720 450 C 960 580, 1080 200, 1340 300"
                stroke="rgba(0,0,0,0.6)"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
              {/* Glowing Route Line */}
              <path
                ref={pathRef}
                d="M 120 780 C 400 780, 480 320, 720 450 C 960 580, 1080 200, 1340 300"
                stroke="var(--accent)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="8 8"
                fill="none"
                style={{
                  filter: 'drop-shadow(0 0 8px var(--accent))',
                }}
              />
              {/* Island Coordinate Waypoints */}
              <circle cx="120" cy="780" r="6" fill="#F5C542" />
              <circle cx="720" cy="450" r="6" fill="#FF2E93" />
              <circle cx="1340" cy="300" r="6" fill="#FFB703" />
            </svg>

            {/* Sailing Boat traveling along the curve */}
            <div
              ref={boatRef}
              className="absolute top-0 left-0 -ml-8 -mt-6"
              style={{ willChange: 'transform' }}
            >
              <Boat
                size={70}
                lanternColor={ISLANDS[activeIslandIndex]?.palette.accent || '#F5C542'}
              />
            </div>
          </div>

          {/* Bottom HUD Progress Meter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 rounded-full border border-white/20 bg-black/60 px-5 py-2 backdrop-blur-md font-mono text-xs">
            {ISLANDS.map((island, idx) => (
              <button
                key={island.slug}
                onClick={() => setActiveIslandIndex(idx)}
                className={`flex items-center gap-1.5 transition-all ${
                  activeIslandIndex === idx
                    ? 'text-[var(--accent)] font-bold scale-105'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    activeIslandIndex === idx ? 'bg-[var(--accent)] animate-ping' : 'bg-white/30'
                  }`}
                />
                <span>DAY 0{island.dayNumber}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* MOBILE VERTICAL STACKED ISLANDS */
        <div className="relative flex flex-col w-full">
          {/* Vertical Wavy Guide Line down left side */}
          <div className="absolute top-0 bottom-0 left-4 sm:left-8 w-[2px] bg-gradient-to-b from-[#F5C542] via-[#FF2E93] to-[#FFB703] opacity-40 pointer-events-none" />

          {ISLANDS.map((island) => (
            <div
              key={island.slug}
              className="relative w-full border-b border-white/10"
            >
              <Island island={island} isActive={true} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
