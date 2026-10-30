'use client';

import React from 'react';

interface VectorTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'span';
  className?: string;
  subtext?: string;
  accent?: string;
  size?: 'hero' | 'large' | 'medium';
}

export default function VectorText({
  text,
  as: Component = 'h1',
  className = '',
  subtext,
  accent = 'var(--accent)',
  size = 'hero',
}: VectorTextProps) {
  const sizeClasses = {
    hero: 'text-[clamp(3.8rem,14vw,11.5rem)] leading-[0.88] tracking-[-0.04em] font-black',
    large: 'text-[clamp(2.4rem,8vw,6.5rem)] leading-[0.95] tracking-[-0.03em] font-extrabold',
    medium: 'text-[clamp(1.8rem,5vw,4rem)] leading-[1.0] tracking-[-0.02em] font-bold',
  }[size];

  return (
    <div className={`relative inline-block select-none ${className}`}>
      {/* Top Vector Technical Crosshair Marks */}
      <div className="flex items-center justify-between pb-1 font-mono text-[9px] sm:text-[10px] tracking-[0.3em] text-white/40 uppercase">
        <span className="flex items-center gap-1.5">
          <span className="text-[var(--accent)]">+</span>
          <span>VECTOR.GLYPH // REF. 027</span>
        </span>
        <span className="font-mono text-[var(--accent)] tracking-widest hidden sm:inline">
          [ 15°23&apos;N // 75°01&apos;E ]
        </span>
      </div>

      <div className="relative">
        {/* Chromatic / Glow Offset Shadow Layer */}
        <span
          aria-hidden="true"
          className={`absolute inset-0 translate-x-[3px] translate-y-[2px] opacity-30 blur-[2px] text-[var(--accent)] ${sizeClasses}`}
        >
          {text}
        </span>

        {/* Wireframe Outline Vector Stroke Layer */}
        <span
          aria-hidden="true"
          className={`absolute inset-0 translate-x-[-1px] translate-y-[-1px] text-transparent ${sizeClasses}`}
          style={{
            WebkitTextStroke: '1px rgba(255, 255, 255, 0.45)',
          }}
        >
          {text}
        </span>

        {/* Foreground Solid Display Glyph */}
        <Component
          className={`relative text-[var(--fg)] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] ${sizeClasses}`}
        >
          {text}
        </Component>
      </div>

      {subtext && (
        <div className="mt-2 flex items-center justify-between border-t border-white/15 pt-1.5 font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[var(--accent)] uppercase">
          <span>{subtext}</span>
          <span className="text-white/40 tracking-normal text-[9px]">IIIT DHARWAD</span>
        </div>
      )}
    </div>
  );
}
