'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

interface StatueSlicesProps {
  className?: string;
}

export default function StatueSlices({ className = '' }: StatueSlicesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const slice1Ref = useRef<HTMLDivElement>(null);
  const slice2Ref = useRef<HTMLDivElement>(null);
  const slice3Ref = useRef<HTMLDivElement>(null);
  const glitchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Pointer parallax on desktop
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const normX = (e.clientX - centerX) / (window.innerWidth / 2);
      const normY = (e.clientY - centerY) / (window.innerHeight / 2);

      if (slice1Ref.current) {
        slice1Ref.current.style.transform = `translate3d(${-normX * 18}px, ${-normY * 12}px, 0)`;
      }
      if (slice2Ref.current) {
        slice2Ref.current.style.transform = `translate3d(${normX * 24}px, ${normY * 4}px, 0)`;
      }
      if (slice3Ref.current) {
        slice3Ref.current.style.transform = `translate3d(${-normX * 12}px, ${normY * 16}px, 0)`;
      }
      if (glitchBarRef.current) {
        glitchBarRef.current.style.transform = `translate3d(${normX * 30}px, 0, 0) scaleX(${1 + Math.abs(normX) * 0.2})`;
      }
    };

    // Scroll parallax: slices separate vertically as user scrolls
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const factor = Math.min(scrollY / 600, 1);

      if (slice1Ref.current) {
        slice1Ref.current.style.marginTop = `${-factor * 35}px`;
      }
      if (slice3Ref.current) {
        slice3Ref.current.style.marginTop = `${factor * 35}px`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto w-[280px] sm:w-[360px] md:w-[440px] aspect-[3/4] select-none ${className}`}
    >
      {/* 1px Editorial Frame Container */}
      <div className="absolute -inset-3 sm:-inset-5 border border-white/15 pointer-events-none rounded-sm">
        {/* Technical Corner Brackets */}
        <div className="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-[var(--accent)]" />
        <div className="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-[var(--accent)]" />
        <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-[var(--accent)]" />
        <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-[var(--accent)]" />

        {/* Tiny Mono Editorial Captions */}
        <div className="absolute top-1.5 left-2 font-mono text-[8px] sm:text-[9px] tracking-widest text-white/50 uppercase">
          FIG. 00 // APOLLO PROTOCOL
        </div>
        <div className="absolute bottom-1.5 right-2 font-mono text-[8px] sm:text-[9px] tracking-widest text-[var(--accent)]">
          IIIT.DWD // 2027
        </div>
      </div>

      {/* Background Halftone Silhouette Shadow */}
      <div className="absolute inset-0 halftone-dense opacity-20 text-[var(--accent)] pointer-events-none" />

      {/* Reference Image 5: Yellow Angular Geometric Shards & Botanical Foliage Accent */}
      <div className="absolute -inset-8 pointer-events-none overflow-hidden z-0">
        {/* Diagonal Yellow Graphic Blade */}
        <div
          className="absolute top-[20%] -left-8 w-52 h-4 bg-[#F5C542] opacity-85 mix-blend-screen shadow-[0_0_18px_#F5C542]"
          style={{ transform: 'rotate(-38deg)', transformOrigin: 'left center' }}
        />
        <div
          className="absolute top-[34%] -left-12 w-40 h-2 bg-[#F5C542] opacity-70 mix-blend-screen"
          style={{ transform: 'rotate(-38deg)' }}
        />
        <div
          className="absolute bottom-[22%] -right-8 w-48 h-3.5 bg-[#F5C542] opacity-75 mix-blend-screen shadow-[0_0_15px_#F5C542]"
          style={{ transform: 'rotate(-38deg)' }}
        />
        {/* Geometric Corner Chevron Marker */}
        <div
          className="absolute top-[12%] right-2 font-mono text-xl font-black text-[#F5C542] opacity-80"
          style={{ transform: 'rotate(22deg)' }}
        >
          ▲
        </div>

        {/* Botanical Foliage Vector Silhouette */}
        <svg
          viewBox="0 0 200 200"
          className="absolute -top-4 -right-4 w-36 h-36 opacity-25 text-[#F5C542] mix-blend-screen"
          fill="currentColor"
        >
          <path d="M100 20 C120 50, 150 70, 180 80 C150 90, 120 110, 100 140 C80 110, 50 90, 20 80 C50 70, 80 50, 100 20 Z" />
          <path d="M140 40 C150 60, 170 70, 190 75 C170 80, 150 90, 140 110 C130 90, 110 80, 90 75 C110 70, 130 60, 140 40 Z" opacity="0.6" />
        </svg>
      </div>

      {/* The 3 Slices */}
      <div className="relative h-full w-full overflow-visible z-10">
        {/* Slice 1: Crown & Forehead */}
        <div
          ref={slice1Ref}
          className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
          style={{ clipPath: 'inset(0 0 66% 0)' }}
        >
          <Image
            src="/images/statue.png"
            alt="Avinya Marble Bust - Hair and Crown"
            fill
            priority
            sizes="(max-width: 768px) 320px, 440px"
            className="object-contain filter grayscale contrast-125 brightness-95"
          />
        </div>

        {/* Yellow Glitch Bar Across the Eyes (Reference Image 5) */}
        <div
          ref={glitchBarRef}
          className="absolute top-[34%] -left-[10%] -right-[10%] h-7 sm:h-9 bg-[#F5C542] z-20 mix-blend-difference opacity-90 shadow-[0_0_20px_#F5C542] transition-transform duration-150 ease-out pointer-events-none flex items-center justify-between px-4 overflow-hidden"
          style={{ transform: 'skewX(-15deg)' }}
        >
          <span className="font-mono text-[8px] font-black tracking-[0.3em] text-black">
            AVINYA 12-14 MAR 2027
          </span>
          <span className="font-mono text-[8px] font-bold text-black hidden sm:inline">
            // IIIT DHARWAD
          </span>
        </div>

        {/* Slice 2: Eyes & Nose + Nested Skull Motif from Reference Image 3 */}
        <div
          ref={slice2Ref}
          className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform z-10"
          style={{ clipPath: 'inset(34% 0 34% 0)' }}
        >
          <Image
            src="/images/statue.png"
            alt="Avinya Marble Bust - Eyes and Nose"
            fill
            priority
            sizes="(max-width: 768px) 320px, 440px"
            className="object-contain filter grayscale contrast-130 brightness-105"
          />

          {/* Stylized Skull Hollows from Reference Image 3 */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 mix-blend-luminosity pointer-events-none">
            <svg
              viewBox="0 0 100 100"
              className="w-40 h-40 text-neutral-300 filter drop-shadow-[0_0_10px_rgba(0,0,0,0.9)]"
              fill="currentColor"
            >
              <ellipse cx="36" cy="46" rx="9" ry="12" fill="#0A0A0C" />
              <ellipse cx="64" cy="46" rx="9" ry="12" fill="#0A0A0C" />
              <polygon points="50,56 46,68 54,68" fill="#0A0A0C" />
              <path
                d="M32 72 Q50 68 68 72 Q64 82 50 82 Q36 82 32 72 Z"
                fill="#0A0A0C"
              />
            </svg>
          </div>
        </div>

        {/* Slice 3: Lips, Chin, & Pedestal */}
        <div
          ref={slice3Ref}
          className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
          style={{ clipPath: 'inset(66% 0 0 0)' }}
        >
          <Image
            src="/images/statue.png"
            alt="Avinya Marble Bust - Lips and Drapery"
            fill
            priority
            sizes="(max-width: 768px) 320px, 440px"
            className="object-contain filter grayscale contrast-125 brightness-90"
          />
        </div>
      </div>
    </div>
  );
}
