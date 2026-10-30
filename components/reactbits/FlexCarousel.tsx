'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './FlexCarousel.css';

export interface FlexCarouselItem {
  src: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  tag?: string;
  [key: string]: any;
}

export interface FlexCarouselProps {
  items: FlexCarouselItem[];
  preset?: 'liquid' | 'straight' | 'tilt' | string;
  intro?: 'rise' | 'fade' | 'none' | string;
  cardHeight?: number;
  gap?: number;
  squeeze?: number;
  focusOnClick?: boolean;
  captions?: boolean;
  fit?: 'natural' | 'cover' | 'contain' | string;
  radius?: number;
  lensWidth?: number;
  lensHeight?: number;
  tilt?: number;
  roundness?: number;
  bend?: number;
  reach?: number;
  curl?: 'twist' | 'arc' | string;
  dispersion?: number;
  liquid?: number;
  followCursor?: boolean;
  autoplay?: boolean;
  interval?: number;
  captureWheel?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onCardClick?: (item: FlexCarouselItem, index: number) => void;
}

const FALLBACK_POSTER =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0a0f1d"/>
          <stop offset="50%" stop-color="#0d1b2a"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
      </defs>
      <rect width="600" height="800" fill="url(#bg)"/>
      <circle cx="300" cy="380" r="140" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.3"/>
      <circle cx="300" cy="380" r="180" fill="none" stroke="#818cf8" stroke-width="1" stroke-dasharray="8 6" stroke-opacity="0.25"/>
      <path d="M150 560 L300 240 L450 560 Z" fill="none" stroke="#38bdf8" stroke-width="2" stroke-opacity="0.4"/>
      <text x="300" y="660" text-anchor="middle" font-family="monospace" font-size="20" fill="#38bdf8" letter-spacing="4">AVINYA MISSION</text>
    </svg>`
  );

export default function FlexCarousel({
  items = [],
  preset = 'liquid',
  intro = 'rise',
  cardHeight = 0.5,
  gap = 12,
  squeeze = 0.2,
  focusOnClick = true,
  captions = true,
  fit = 'natural',
  radius = 0,
  lensWidth = 0.74,
  lensHeight = 1.18,
  tilt = 62,
  roundness = 1,
  bend = 0.34,
  reach = 0.38,
  curl = 'twist',
  dispersion = 0.45,
  liquid = 0,
  followCursor = false,
  autoplay = false,
  interval = 4,
  captureWheel = false,
  className = '',
  style = {},
  onCardClick,
}: FlexCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 800, height: 560 });
  const [scrollX, setScrollX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [introProgress, setIntroProgress] = useState(intro === 'none' ? 1 : 0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const rawCount = Math.max(items.length, 1);

  // Measure container dimensions
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setContainerDimensions({
          width: clientWidth || 800,
          height: clientHeight || 560,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Intro animation
  useEffect(() => {
    if (intro === 'none') {
      setIntroProgress(1);
      return;
    }
    let start = performance.now();
    let raf: number;
    const animate = (now: number) => {
      const elapsed = (now - start) / 750;
      const t = Math.min(1, elapsed);
      // easeOutCubic
      const progress = 1 - Math.pow(1 - t, 3);
      setIntroProgress(progress);
      if (t < 1) {
        raf = requestAnimationFrame(animate);
      }
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [intro]);

  // Card dimensions
  const computedCardHeight = useMemo(() => {
    if (cardHeight <= 1) {
      return containerDimensions.height * cardHeight;
    }
    return cardHeight;
  }, [cardHeight, containerDimensions.height]);

  const computedCardWidth = useMemo(() => {
    if (fit === 'natural') {
      return computedCardHeight * 0.72; // ~3:4 aspect ratio
    }
    return computedCardHeight * 0.75;
  }, [computedCardHeight, fit]);

  const cardPitch = computedCardWidth + gap;
  const singleCycleWidth = rawCount * cardPitch;

  // Triplicate items for infinite seamless scroll
  const REPEAT_SETS = 5;
  const totalCards = rawCount * REPEAT_SETS;
  const centerSetIndex = Math.floor(REPEAT_SETS / 2);

  // Drag physics refs
  const dragRef = useRef({
    startX: 0,
    startScrollX: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    raf: 0,
    isPointerDown: false,
    hasMoved: false,
  });

  // Autoplay timer
  useEffect(() => {
    if (!autoplay || isDragging) return;
    const timer = setInterval(() => {
      setScrollX((prev) => prev + cardPitch);
    }, Math.max(1000, interval * 1000));
    return () => clearInterval(timer);
  }, [autoplay, interval, isDragging, cardPitch]);

  // Continuous loop wrapping
  const normalizedScrollX = useMemo(() => {
    if (singleCycleWidth <= 0) return 0;
    const mod = scrollX % singleCycleWidth;
    return mod < 0 ? mod + singleCycleWidth : mod;
  }, [scrollX, singleCycleWidth]);

  // Wheel handling
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!captureWheel) return;
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      setScrollX((prev) => prev + delta * 0.85);
    },
    [captureWheel]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !captureWheel) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel, captureWheel]);

  // Pointer drag handling
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const d = dragRef.current;
    cancelAnimationFrame(d.raf);
    d.isPointerDown = true;
    d.hasMoved = false;
    d.startX = e.clientX;
    d.startScrollX = scrollX;
    d.lastX = e.clientX;
    d.lastTime = performance.now();
    d.velocity = 0;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (followCursor && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      setCursorPos({ x: nx, y: ny });
    }

    const d = dragRef.current;
    if (!d.isPointerDown) return;

    const currentX = e.clientX;
    const dx = currentX - d.startX;
    if (Math.abs(dx) > 4) {
      d.hasMoved = true;
    }

    const now = performance.now();
    const dt = Math.max(1, now - d.lastTime);
    d.velocity = (currentX - d.lastX) / dt;
    d.lastX = currentX;
    d.lastTime = now;

    setScrollX(d.startScrollX - dx);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d.isPointerDown) return;
    d.isPointerDown = false;
    setIsDragging(false);

    // Apply inertia
    let vel = d.velocity * 16; // velocity per frame
    const friction = 0.93;
    const step = () => {
      if (Math.abs(vel) > 0.25) {
        setScrollX((prev) => prev - vel);
        vel *= friction;
        d.raf = requestAnimationFrame(step);
      }
    };
    d.raf = requestAnimationFrame(step);
  };

  // Focus click
  const handleCardClick = (item: FlexCarouselItem, index: number, cardCenterX: number) => {
    if (dragRef.current.hasMoved) return;

    if (focusOnClick) {
      const containerCenterX = containerDimensions.width / 2;
      const diff = cardCenterX - containerCenterX;
      // Animate smoothly to center
      let start = scrollX;
      let target = scrollX + diff;
      let startTime = performance.now();
      const duration = 400;

      const animateSnap = (now: number) => {
        const p = Math.min(1, (now - startTime) / duration);
        const ease = 1 - Math.pow(1 - p, 3);
        setScrollX(start + (target - start) * ease);
        if (p < 1) requestAnimationFrame(animateSnap);
      };
      requestAnimationFrame(animateSnap);
    }

    onCardClick?.(item, index % rawCount);
  };

  // Half lens radius in pixels
  const halfLensWidth = Math.max(100, (containerDimensions.width * lensWidth) / 2);
  const containerCenter = containerDimensions.width / 2;

  // Render cards
  const renderedCards = useMemo(() => {
    const cards = [];
    const baseOffset = containerCenter - normalizedScrollX - centerSetIndex * singleCycleWidth;

    for (let i = 0; i < totalCards; i++) {
      const rawIndex = i % rawCount;
      const item = items[rawIndex];
      if (!item) continue;

      const cardLeft = baseOffset + i * cardPitch;
      const cardCenter = cardLeft + computedCardWidth / 2;
      const distFromCenter = cardCenter - containerCenter;

      // Cull cards far outside view
      if (
        cardCenter < -computedCardWidth * 2 ||
        cardCenter > containerDimensions.width + computedCardWidth * 2
      ) {
        continue;
      }

      // Normalized distance in lens space (-1 to +1 is inside the lens)
      const normDist = distFromCenter / halfLensWidth;
      const absNorm = Math.abs(normDist);

      let scale = 1;
      let rotateY = 0;
      let rotateZ = 0;
      let translateZ = 0;
      let opacity = 1;

      if (absNorm <= 1) {
        // Inside liquid lens
        const focal = Math.cos((normDist * Math.PI) / 2);
        scale = 1 + focal * 0.08;
        rotateY = normDist * (tilt * 0.15) * (1 - focal);
        rotateZ = normDist * (bend * 4) * (1 - focal);
        translateZ = focal * 35;
        opacity = 1;
      } else {
        // Outside liquid lens: bend, twist & curl
        const excess = absNorm - 1;
        const sign = Math.sign(normDist);
        rotateY = sign * Math.min(tilt, 15 + excess * (tilt * 0.65));
        rotateZ = sign * Math.min(20, excess * (bend * 25));
        scale = Math.max(0.65, 1 - excess * squeeze);
        translateZ = -Math.min(220, excess * reach * 260);
        opacity = Math.max(0.2, 1 - excess * 0.35);
      }

      // Parallax / follow cursor
      if (followCursor) {
        rotateY += cursorPos.x * 12;
      }

      // Intro rise
      const riseOffset = (1 - introProgress) * 70;
      const finalOpacity = opacity * introProgress;

      const transform = `translate3d(${cardLeft}px, calc(-50% + ${riseOffset}px), ${translateZ}px) rotateY(${rotateY.toFixed(2)}deg) rotateZ(${rotateZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`;

      cards.push(
        <div
          key={`flex-card-${i}`}
          className="flex-carousel__card-wrapper"
          style={{
            left: 0,
            width: `${computedCardWidth}px`,
            height: `${computedCardHeight}px`,
            transform,
            opacity: finalOpacity,
            zIndex: Math.round(100 - absNorm * 10),
          }}
          onClick={() => handleCardClick(item, rawIndex, cardCenter)}
        >
          <div
            className="flex-carousel__card"
            style={{
              borderRadius: `${radius}px`,
            }}
          >
            {/* Corner Crosshairs */}
            <div className="flex-carousel__crosshair-tl" />
            <div className="flex-carousel__crosshair-br" />

            {/* Poster Image with graceful fallback */}
            <img
              src={item.src}
              alt={item.alt || item.title || 'Mission Track'}
              className="flex-carousel__image"
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== FALLBACK_POSTER) {
                  target.src = FALLBACK_POSTER;
                }
              }}
            />

            {/* Specular Liquid Reflection */}
            <div className="flex-carousel__specular" />

            {/* Captions HUD */}
            {captions && (item.title || item.subtitle || item.tag) && (
              <div className="flex-carousel__caption">
                {item.tag && <span className="flex-carousel__caption-tag">{item.tag}</span>}
                {item.title && <span className="flex-carousel__caption-title">{item.title}</span>}
                {item.subtitle && (
                  <span className="flex-carousel__caption-subtitle">{item.subtitle}</span>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return cards;
  }, [
    items,
    rawCount,
    totalCards,
    centerSetIndex,
    singleCycleWidth,
    containerCenter,
    normalizedScrollX,
    cardPitch,
    computedCardWidth,
    computedCardHeight,
    containerDimensions.width,
    halfLensWidth,
    tilt,
    bend,
    squeeze,
    reach,
    followCursor,
    cursorPos,
    introProgress,
    radius,
    captions,
  ]);

  return (
    <div
      ref={containerRef}
      className={`flex-carousel ${className}`.trim()}
      style={style}
      role="region"
      aria-label="Liquid Lens Carousel"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Liquid Lens Vignette Overlay */}
      <div className="flex-carousel__lens-overlay" />

      {/* Optical Lens Rim Ring */}
      <div
        className="flex-carousel__lens-rim"
        style={{
          width: `${containerDimensions.width * lensWidth}px`,
          height: `${containerDimensions.height * Math.min(1.2, lensHeight)}px`,
        }}
      />

      {/* 3D Track Stage */}
      <div className="flex-carousel__stage">{renderedCards}</div>
    </div>
  );
}
