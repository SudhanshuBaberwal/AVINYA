'use client';

import React, { useEffect, useRef } from 'react';

interface PatternWavesProps {
  className?: string;
  tint?: string;
  dotSize?: number;
  gap?: number;
  speed?: number;
  amplitude?: number;
}

export default function PatternWaves({
  className = '',
  tint,
  dotSize = 1.6,
  gap = 22,
  speed = 0.025,
  amplitude = 18,
}: PatternWavesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let time = 0;
    let mouseX = width / 2;
    let mouseY = height / 2;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Track mouse for gentle wave disturbance
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Pause canvas when scrolled off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    let frameCount = 0;
    let resolvedColor = tint || '#F5C542';

    const updateColor = () => {
      if (tint) {
        resolvedColor = tint;
      } else if (typeof document !== 'undefined') {
        const val = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
        if (val) resolvedColor = val;
      }
    };
    updateColor();

    const render = () => {
      if (!isVisibleRef.current) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += speed;
      frameCount++;
      if (frameCount % 24 === 0) {
        updateColor();
      }

      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / gap) + 2;
      const rows = Math.ceil(height / gap) + 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gap;
          const y = j * gap;

          // Distance from mouse
          const dx = x - mouseX;
          const dy = y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseInfluence = Math.max(0, 1 - dist / 350) * 14;

          // Silk-like mathematical undulation
          const wave1 = Math.sin(i * 0.18 + time) * amplitude;
          const wave2 = Math.cos(j * 0.15 + time * 1.2) * (amplitude * 0.8);
          const wave3 = Math.sin((i + j) * 0.12 - time * 0.8) * (amplitude * 0.5);

          const offsetY = wave1 + wave2 + wave3 - mouseInfluence;

          // Halftone perspective dot size modulation
          const depthRatio = Math.sin((i * 0.15) + (j * 0.1) + time * 0.5);
          const currentRadius = Math.max(0.6, dotSize + depthRatio * 0.9);
          const alpha = Math.max(0.12, Math.min(0.65, 0.28 + depthRatio * 0.25));

          ctx.beginPath();
          ctx.arc(x, y + offsetY, currentRadius, 0, Math.PI * 2);
          ctx.fillStyle = resolvedColor;
          ctx.globalAlpha = alpha;
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      observer.disconnect();
    };
  }, [dotSize, gap, speed, amplitude, tint]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
