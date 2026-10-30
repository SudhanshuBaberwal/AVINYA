'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { FEST_METADATA } from '@/data/content';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const MANIFESTO_TEXT = 
  "Avinya is the convergence of antiquity and the avant-garde. For three days, the campus of IIIT Dharwad transforms into an open sea of imagination. Voyagers chart their course across three distinct islands: weathering the desert dunes of The Last Outpost, navigating the cybernetic fury of The Pandemonium, and celebrating beneath the lantern-lit skies of The Carnival. Here, algorithms meet artistry, and every coder, artist, and dreamer becomes an explorer.";

export default function Manifesto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const textEl = textContainerRef.current;
    if (!container || !textEl) return;

    // Word by word scroll scrubbed opacity reveal
    const words = textEl.querySelectorAll<HTMLSpanElement>('.manifesto-word');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: textEl,
            start: 'top 75%',
            end: 'bottom 40%',
            scrub: true,
          },
        }
      );

      if (statsRef.current) {
        gsap.from(statsRef.current.children, {
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
          },
        });
      }
    }, container);

    return () => ctx.revert();
  }, []);

  const words = MANIFESTO_TEXT.split(' ');

  return (
    <section
      id="manifesto"
      ref={containerRef}
      className="relative min-h-[90svh] w-full bg-[#0A0A0C] py-20 sm:py-28 px-4 sm:px-8 border-b border-white/10 overflow-hidden"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Top Tag */}
        <div className="mb-8 flex items-center justify-between border-b border-white/15 pb-4 font-mono text-[10px] sm:text-xs text-white/50 tracking-[0.25em] uppercase">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            <span>FIG. 01 // MANIFESTO & ORIGIN</span>
          </div>
          <span className="text-[var(--accent)]">IIIT DHARWAD // EST. 2015</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Main Manifesto Word-by-Word Scroll Scrub Text */}
          <div className="lg:col-span-8">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
              // THE ARCHIPELAGO CALLS
            </p>

            <p
              ref={textContainerRef}
              className="font-serif text-2xl sm:text-4xl lg:text-[2.6rem] leading-[1.35] text-white selection:bg-[var(--accent)] selection:text-black font-normal"
            >
              {words.map((word, i) => (
                <span
                  key={i}
                  className="manifesto-word inline-block mr-[0.28em] transition-opacity duration-75 will-change-opacity"
                >
                  {word}
                </span>
              ))}
            </p>
          </div>

          {/* Halftone Classical Statue Bust Side Card */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="editorial-frame relative w-64 sm:w-72 aspect-[3/4] p-4 flex flex-col justify-between">
              <div className="font-mono text-[9px] text-white/50 flex justify-between">
                <span>SCULPTURE // NO. 04</span>
                <span className="text-[var(--accent)]">MARBLE BUST</span>
              </div>

              <div className="relative my-auto h-48 w-full overflow-hidden rounded">
                <Image
                  src="/images/statue.png"
                  alt="Marble bust detail"
                  fill
                  sizes="260px"
                  className="object-cover filter grayscale contrast-125 brightness-90"
                />
                <div className="absolute inset-0 halftone-dense opacity-25 text-[var(--accent)] pointer-events-none" />
              </div>

              <div className="border-t border-white/10 pt-2 font-mono text-[10px] text-neutral-400">
                <span className="block text-white font-bold">12 · 13 · 14 MARCH</span>
                <span className="text-[9px] text-white/50">DHARWAD, KARNATAKA</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Stat Frames in 1px Frames */}
        <div
          ref={statsRef}
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {FEST_METADATA.stats.map((stat, idx) => (
            <div
              key={idx}
              className="editorial-frame p-6 hover:border-[var(--accent)] transition-all duration-300"
            >
              <div className="font-mono text-[10px] text-white/50 tracking-widest uppercase mb-1">
                INDEX 0{idx + 1} // {stat.unit}
              </div>
              <div className="font-mono text-3xl sm:text-4xl font-black text-white">
                {stat.value}
              </div>
              <div className="mt-1 font-serif text-sm italic text-[var(--accent)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
