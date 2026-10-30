'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import './OptionWheel.css';

export interface OptionWheelProps {
  items: string[];
  defaultSelected?: number;
  selectedIndex?: number;
  textColor?: string;
  activeColor?: string;
  side?: 'left' | 'right';
  fontSize?: number; // in rem
  spacing?: number;
  curve?: number;
  tilt?: number;
  blur?: number;
  fade?: number;
  smoothing?: number;
  inset?: number;
  loop?: boolean;
  draggable?: boolean;
  soundUrl?: string;
  soundVolume?: number;
  onChange?: (index: number, item: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function OptionWheel({
  items = [],
  defaultSelected = 0,
  selectedIndex,
  textColor = '#a6a6a6',
  activeColor = '#ffffff',
  side = 'left',
  fontSize = 3,
  spacing = 1.4,
  curve = 1,
  tilt = 6,
  blur = 2,
  fade = 0.25,
  smoothing = 200,
  inset = 80,
  loop = false,
  draggable = true,
  soundUrl = '',
  soundVolume = 0.5,
  onChange,
  className = '',
  style = {},
}: OptionWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const count = items.length;

  // Clamped target index
  const initialIndex = Math.max(0, Math.min(count - 1, selectedIndex ?? defaultSelected));
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [floatingIndex, setFloatingIndex] = useState(initialIndex);
  const [isInteracting, setIsInteracting] = useState(false);

  // Audio click context
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (soundUrl) {
      try {
        const audio = new Audio(soundUrl);
        audio.volume = Math.max(0, Math.min(1, soundVolume));
        audioElementRef.current = audio;
      } catch {
        // audio element fallback
      }
    }
  }, [soundUrl, soundVolume]);

  const playClickSound = useCallback(() => {
    if (!soundUrl) return;

    // Try HTMLAudioElement
    if (audioElementRef.current) {
      try {
        audioElementRef.current.currentTime = 0;
        audioElementRef.current.play().catch(() => {
          // If browser blocks audio or sound file missing, synthesize a soft click
          playSyntheticTick();
        });
        return;
      } catch {
        // fallback to synth
      }
    }

    playSyntheticTick();
  }, [soundUrl]);

  const playSyntheticTick = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.025);

      gain.gain.setValueAtTime(soundVolume * 0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.025);
    } catch {
      // Audio context error ignored safely
    }
  }, [soundVolume]);

  // Sync external controlled selectedIndex
  useEffect(() => {
    if (selectedIndex !== undefined && selectedIndex >= 0 && selectedIndex < count) {
      if (selectedIndex !== currentIndex) {
        setCurrentIndex(selectedIndex);
        animateTo(selectedIndex);
      }
    }
  }, [selectedIndex, count]);

  // Physics animation state
  const animRef = useRef({
    current: initialIndex,
    target: initialIndex,
    raf: 0,
    startTime: 0,
    startPos: initialIndex,
    isAnimating: false,
  });

  const animateTo = useCallback(
    (targetIdx: number) => {
      const a = animRef.current;
      cancelAnimationFrame(a.raf);
      a.startPos = a.current;
      a.target = targetIdx;
      a.startTime = performance.now();
      a.isAnimating = true;

      const duration = Math.max(80, smoothing);

      const step = (now: number) => {
        const elapsed = now - a.startTime;
        const progress = Math.min(1, elapsed / duration);
        // easeOutQuart
        const ease = 1 - Math.pow(1 - progress, 4);
        const val = a.startPos + (a.target - a.startPos) * ease;
        a.current = val;
        setFloatingIndex(val);

        if (progress < 1) {
          a.raf = requestAnimationFrame(step);
        } else {
          a.current = a.target;
          setFloatingIndex(a.target);
          a.isAnimating = false;
        }
      };

      a.raf = requestAnimationFrame(step);
    },
    [smoothing]
  );

  const setIndexWithNotify = useCallback(
    (newIdx: number) => {
      if (count === 0) return;
      let clamped = newIdx;
      if (loop) {
        clamped = (newIdx % count + count) % count;
      } else {
        clamped = Math.max(0, Math.min(count - 1, newIdx));
      }

      if (clamped !== currentIndex) {
        setCurrentIndex(clamped);
        playClickSound();
        onChange?.(clamped, items[clamped]);
      }
      animateTo(clamped);
    },
    [count, loop, currentIndex, items, onChange, playClickSound, animateTo]
  );

  // Native non-passive wheel handling to stop BOTH window scroll & Lenis smooth scroll
  const lastWheelTimeRef = useRef(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const now = performance.now();
      if (now - lastWheelTimeRef.current < 65) return;
      lastWheelTimeRef.current = now;

      const dir = e.deltaY > 0 ? 1 : -1;
      const target = Math.round(animRef.current.current) + dir;
      setIndexWithNotify(target);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, [setIndexWithNotify]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      setIndexWithNotify(currentIndex + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setIndexWithNotify(currentIndex - 1);
    }
  };

  // Pointer Dragging
  const dragRef = useRef({
    startY: 0,
    startIndex: 0,
    isDown: false,
    hasMoved: false,
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable || e.button !== 0) return;
    const d = dragRef.current;
    d.isDown = true;
    d.hasMoved = false;
    d.startY = e.clientY;
    d.startIndex = animRef.current.current;
    setIsInteracting(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d.isDown) return;

    const dy = e.clientY - d.startY;
    if (Math.abs(dy) > 4) d.hasMoved = true;

    // 1 item = itemStepPx
    const itemStepPx = fontSize * 16 * spacing * 0.9;
    const deltaIndex = -dy / itemStepPx;
    let target = d.startIndex + deltaIndex;

    if (!loop) {
      target = Math.max(-0.4, Math.min(count - 0.6, target));
    }

    animRef.current.current = target;
    setFloatingIndex(target);

    // Dynamic index snap check for sound
    const rounded = Math.round(target);
    const clampedRounded = loop ? (rounded % count + count) % count : Math.max(0, Math.min(count - 1, rounded));
    if (clampedRounded !== currentIndex && Math.abs(target - rounded) < 0.2) {
      setCurrentIndex(clampedRounded);
      playClickSound();
      onChange?.(clampedRounded, items[clampedRounded]);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d.isDown) return;
    d.isDown = false;
    setIsInteracting(false);

    const nearest = Math.round(animRef.current.current);
    setIndexWithNotify(nearest);
  };

  // Item step size
  const itemHeight = fontSize * 16 * spacing;

  return (
    <div
      ref={containerRef}
      data-lenis-prevent="true"
      data-lenis-prevent-wheel="true"
      className={`option-wheel-container ${className}`.trim()}
      style={{
        ...style,
        fontSize: `${fontSize}rem`,
      }}
      tabIndex={0}
      role="listbox"
      aria-label="Options wheel"
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Reticle / Active Arrow indicator */}
      <div className={`option-wheel-reticle option-wheel-reticle--${side}`}>
        <div className="option-wheel-reticle-arrow" />
        <div className="option-wheel-reticle-line" />
      </div>

      {/* Top and Bottom Fading Vignettes */}
      <div className="option-wheel-fade-top" />
      <div className="option-wheel-fade-bottom" />

      {/* 3D Wheel Stage */}
      <div
        className="option-wheel-stage"
        style={{
          justifyContent: side === 'left' ? 'flex-start' : 'flex-end',
        }}
      >
        {items.map((item, index) => {
          const offset = index - floatingIndex;
          const absOffset = Math.abs(offset);

          // Arc geometry
          const angleDeg = offset * 18 * curve;
          const angleRad = (angleDeg * Math.PI) / 180;

          // Horizontal displacement (arc curved inward or outward)
          const archX = (1 - Math.cos(angleRad)) * (inset * 1.5 * curve);
          const x = side === 'left' ? inset + archX : -inset - archX;

          // Vertical displacement along cylinder
          const y = Math.sin(angleRad) * (itemHeight * 3.5) + offset * itemHeight * 0.45;

          // 3D rotations
          const rotateX = -Math.sin(angleRad) * (tilt * 5.5);
          const rotateY = (side === 'left' ? 1 : -1) * Math.sin(angleRad) * (tilt * 2);

          // Scaling, blurring and opacity
          const scale = Math.max(0.65, 1 - absOffset * 0.09);
          const itemOpacity = Math.max(fade, 1 - absOffset * (1 - fade) * 0.45);
          const itemBlur = Math.min(blur, absOffset * 0.85);

          // Smooth color blend toward activeColor as it nears center
          const isFocal = absOffset < 0.5;
          const color = isFocal ? activeColor : textColor;

          const transform = `translate3d(${x}px, calc(-50% + ${y}px), 0) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;

          return (
            <div
              key={`${item}-${index}`}
              role="option"
              aria-selected={index === currentIndex}
              className="option-wheel-item"
              style={{
                left: side === 'left' ? 0 : 'auto',
                right: side === 'right' ? 0 : 'auto',
                transform,
                opacity: itemOpacity,
                filter: itemBlur > 0.1 ? `blur(${itemBlur.toFixed(2)}px)` : 'none',
                color,
                zIndex: Math.round(100 - absOffset * 10),
                transformOrigin: side === 'left' ? 'left center' : 'right center',
              }}
              onClick={() => {
                if (!dragRef.current.hasMoved) {
                  setIndexWithNotify(index);
                }
              }}
            >
              <span>{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
