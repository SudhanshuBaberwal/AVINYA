'use client';

import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface ThemeDefinition {
  bg: string;
  fg: string;
  accent: string;
  accent2: string;
  border: string;
  glow: string;
}

const THEMES: Record<string, ThemeDefinition> = {
  default: {
    bg: '#0A0A0C',
    fg: '#F2F2F0',
    accent: '#F5C542',
    accent2: '#E2A925',
    border: 'rgba(255, 255, 255, 0.15)',
    glow: 'rgba(245, 197, 66, 0.25)',
  },
  day1: {
    bg: '#120B07',
    fg: '#F8EFE6',
    accent: '#E07A2E',
    accent2: '#418080',
    border: 'rgba(224, 122, 46, 0.35)',
    glow: 'rgba(224, 122, 46, 0.3)',
  },
  day2: {
    bg: '#090414',
    fg: '#FBF2FF',
    accent: '#FF2E93',
    accent2: '#8A2BE2',
    border: 'rgba(255, 46, 147, 0.35)',
    glow: 'rgba(255, 46, 147, 0.3)',
  },
  day3: {
    bg: '#061214',
    fg: '#FFF8E7',
    accent: '#FFB703',
    accent2: '#E63946',
    border: 'rgba(255, 183, 3, 0.35)',
    glow: 'rgba(255, 183, 3, 0.3)',
  },
  hack2future: {
    bg: '#04060B',
    fg: '#F0F4F8',
    accent: '#38BDF8',
    accent2: '#F5C542',
    border: 'rgba(56, 189, 248, 0.3)',
    glow: 'rgba(56, 189, 248, 0.25)',
  },
};

export default function ThemeBlender() {
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (theme: ThemeDefinition) => {
      gsap.to(root, {
        '--bg': theme.bg,
        '--fg': theme.fg,
        '--accent': theme.accent,
        '--accent-2': theme.accent2,
        '--border-frame': theme.border,
        '--glow-accent': theme.glow,
        duration: 1.0,
        ease: 'power2.out',
      });
    };

    // Watch sections with data-theme attributes
    const sections = document.querySelectorAll<HTMLElement>('[data-theme]');
    const triggers: ScrollTrigger[] = [];

    sections.forEach((section) => {
      const themeName = section.getAttribute('data-theme');
      if (themeName && THEMES[themeName]) {
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => applyTheme(THEMES[themeName]),
          onEnterBack: () => applyTheme(THEMES[themeName]),
        });
        triggers.push(trigger);
      }
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return null;
}
