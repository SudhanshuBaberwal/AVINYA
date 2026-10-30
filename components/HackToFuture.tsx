'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { HACK2FUTURE_CONTENT, FEST_METADATA } from '@/data/content';
import {
  Terminal,
  ExternalLink,
  Rocket,
  Award,
  Shield,
  Cpu,
  Clock,
  Layers,
  ChevronLeft,
  ChevronRight,
  Calendar,
  LayoutGrid,
  Rotate3d,
} from 'lucide-react';
import CircularCarousel, { CircularCarouselRef } from './CircularCarousel';
import FlexCarousel from './FlexCarousel';

// Lazy-load starfield canvas with SSR disabled
const Starfield = dynamic(() => import('./reactbits/Starfield'), {
  ssr: false,
});

const TRACK_CAROUSEL_ITEMS = [
  {
    src: '/images/day1.jpg',
    alt: 'Agentic AI & Cognition',
    title: 'Agentic AI & Cognition',
    subtitle: 'Autonomous reasoning swarms, LLM tool execution & neuro-symbolic reasoning',
    tag: 'TRACK 01',
  },
  {
    src: '/images/day2.jpg',
    alt: 'Decentralized Systems & Cryptography',
    title: 'Decentralized Systems & Cryptography',
    subtitle: 'Zero-knowledge proofs, resilient consensus & sovereign digital identities',
    tag: 'TRACK 02',
  },
  {
    src: '/images/day3.jpg',
    alt: 'FinTech & Algorithmic Markets',
    title: 'FinTech & Algorithmic Markets',
    subtitle: 'High-frequency trade execution, automated fraud detection & UPI rails',
    tag: 'TRACK 03',
  },
  {
    src: '/images/glimpses/1.jpg',
    alt: 'Healthcare & Precision Omics',
    title: 'Healthcare & Precision Omics',
    subtitle: 'AI diagnostics, clinical trial automation & bioinformatics pipelines',
    tag: 'TRACK 04',
  },
  {
    src: '/images/glimpses/2.jpg',
    alt: 'Open Innovation & Deep Tech',
    title: 'Open Innovation & Deep Tech',
    subtitle: 'Satellite telemetry, edge IoT computing & unconstrained moonshots',
    tag: 'TRACK 05',
  },
];

const TIMELINE_CAROUSEL_ITEMS = [
  {
    src: '/images/day1.jpg',
    alt: 'Phase 01: Flight Deck Registration',
    phase: 'T-40 DAYS',
    title: 'Flight Deck Registration Opens',
    date: '01 FEB 2027 · 10:00 AM IST',
    status: 'Completed',
    tag: 'STAGE 01',
    subtitle: 'Nationwide developer onboarding & team registry initialization.',
    desc: 'Colleges & engineering universities across India register teams of 2–4 members. Problem statements are surveyed and credentials verified.',
  },
  {
    src: '/images/day2.jpg',
    alt: 'Phase 02: Idea Screening',
    phase: 'T-10 DAYS',
    title: 'Idea Phase Shortlisting & Confirmation',
    date: '02 MAR 2027 · 18:00 PM IST',
    status: 'Active',
    tag: 'STAGE 02',
    subtitle: 'Technical abstract review, track assignment & invite validation.',
    desc: 'Top 75 flight crews selected by jury panels based on novelty, technical depth, and scalability for on-site hackathon.',
  },
  {
    src: '/images/astronaut.png',
    alt: 'Phase 03: Liftoff',
    phase: 'T-00:00',
    title: 'Liftoff: 36-Hour Hackathon Commences',
    date: '12 MAR 2027 · 10:00 AM IST',
    status: 'Upcoming',
    tag: 'STAGE 03',
    subtitle: 'Opening keynote, API sandbox unlocking & continuous hacking begins.',
    desc: 'Apollo class hackathon kicks off live at IIIT Dharwad campus with uninterrupted high-speed fiber, hardware labs, and compute grants.',
  },
  {
    src: '/images/day3.jpg',
    alt: 'Phase 04: Mid-Mission Review',
    phase: 'T+24:00',
    title: 'Mid-Mission Review & Mentor Checkpoint',
    date: '13 MAR 2027 · 10:00 AM IST',
    status: 'Upcoming',
    tag: 'STAGE 04',
    subtitle: 'Code verification, architecture review & 1-on-1 industry mentorship.',
    desc: 'Engineering leaders from Google, Amazon & top deep-tech startups critique architectures, performance benchmarks, and deployment feasibility.',
  },
  {
    src: '/images/glimpses/3.jpg',
    alt: 'Phase 05: Code Freeze',
    phase: 'T+36:00',
    title: 'Final Code Freeze & Orbital Pitches',
    date: '13 MAR 2027 · 10:00 PM IST',
    status: 'Upcoming',
    tag: 'STAGE 05',
    subtitle: 'Repository push lock, live prototype demos & jury deliberations.',
    desc: 'All commits locked on GitHub. Teams deliver 5-minute rapid-fire live demos in front of the grand jury in the main auditorium.',
  },
  {
    src: '/images/glimpses/4.jpg',
    alt: 'Phase 06: Grand Awards',
    phase: 'MISSION SUCCESS',
    title: 'Grand Awards at Avinya Main Arena',
    date: '14 MAR 2027 · 19:30 PM IST',
    status: 'Upcoming',
    tag: 'STAGE 06',
    subtitle: '₹2,50,000+ prize vault distributions, incubation offers & valedictory.',
    desc: 'The ultimate celebration during Day 3 of Avinya. Trophies, cash rewards, venture investor meetings, and incubation onboarding.',
  },
];

export default function HackToFuture() {
  const helmetRef = useRef<HTMLDivElement>(null);
  const timelineCarouselRef = useRef<CircularCarouselRef>(null);
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(1);
  const [timelineViewMode, setTimelineViewMode] = useState<'3d' | 'grid'>('3d');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Live T-minus countdown to Hack2Future start (March 12, 2027)
  useEffect(() => {
    const targetDate = new Date('2027-03-12T10:00:00+05:30').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3D Parallax tilt on astronaut helmet
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!helmetRef.current) return;
      const rect = helmetRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const normX = (e.clientX - centerX) / (window.innerWidth / 2);
      const normY = (e.clientY - centerY) / (window.innerHeight / 2);

      helmetRef.current.style.transform = `perspective(800px) rotateY(${normX * 18}deg) rotateX(${-normY * 14}deg) translateY(${Math.sin(Date.now() / 1000) * 8}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      id="hack2future"
      data-theme="hack2future"
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#04060B] py-20 sm:py-28 px-4 sm:px-8 border-b border-white/10"
    >
      {/* SEA-TO-SPACE TRANSITION: Water line rises, fading to cosmic starfield */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#0A0A0C] via-[#050B14] to-transparent pointer-events-none z-10" />

      {/* Starfield Galaxy Particle Layer */}
      <div className="absolute inset-0 z-0">
        <Starfield starCount={160} speed={0.4} />
      </div>

      {/* Halftone Cosmic Matrix Texture */}
      <div className="absolute inset-0 halftone-dense opacity-15 pointer-events-none text-sky-400 z-0" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Mission Control Top Bar HUD */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border border-sky-400/20 bg-sky-950/20 px-4 py-3 backdrop-blur-md rounded-sm font-mono text-[11px] text-sky-300">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-ping" />
            <span className="font-bold tracking-widest text-white uppercase">
              // ORBITAL MISSION PROTOCOL
            </span>
            <span className="text-sky-400/40 hidden sm:inline">|</span>
            <span className="text-sky-300/80 hidden sm:inline">{HACK2FUTURE_CONTENT.badge}</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-white/60">COORDINATES:</span>
            <span className="text-[#F5C542]">{FEST_METADATA.venue.coordinates}</span>
          </div>
        </div>

        {/* Hero Composition: Floating Marble Helmet & Mission Briefing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          {/* Left Column: Mission Control Countdown & Description */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 border border-white/15 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-[#F5C542] uppercase mb-4">
              <Rocket className="h-3.5 w-3.5" />
              <span>36-HOUR APOLLO CLASS HACKATHON</span>
            </div>

            <h2 className="font-mono text-4xl sm:text-6xl font-black uppercase tracking-[-0.03em] text-white">
              HACK<span className="text-sky-400">2</span>FUTURE
            </h2>

            <p className="mt-3 font-serif text-xl sm:text-2xl italic text-sky-100 max-w-xl">
              &ldquo;{HACK2FUTURE_CONTENT.tagline}&rdquo;
            </p>

            <p className="mt-4 text-sm sm:text-base text-neutral-300 max-w-xl leading-relaxed">
              The flagship national-level hackathon of IIIT Dharwad, occurring live during Avinya 2027.
              Step into the astronaut helmet, harness autonomous AI agents, quantum primitives,
              and build unconstrained tech breakthroughs across 36 non-stop hours.
            </p>

            {/* T-MINUS LIVE COUNTDOWN HUD */}
            <div className="mt-8 border border-sky-400/30 bg-black/60 p-4 sm:p-5 backdrop-blur-md rounded-sm">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 font-mono text-[10px] text-sky-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  <span>T-MINUS COUNTDOWN TO LIFTOFF</span>
                </span>
                <span className="text-white/40">12 MAR 2027 // 10:00 AM IST</span>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center font-mono">
                <div className="bg-sky-950/40 border border-sky-400/20 p-2 sm:p-3 rounded">
                  <span className="block text-2xl sm:text-4xl font-black text-white">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] sm:text-[10px] tracking-widest text-sky-300/70 uppercase">
                    DAYS
                  </span>
                </div>
                <div className="bg-sky-950/40 border border-sky-400/20 p-2 sm:p-3 rounded">
                  <span className="block text-2xl sm:text-4xl font-black text-white">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] sm:text-[10px] tracking-widest text-sky-300/70 uppercase">
                    HOURS
                  </span>
                </div>
                <div className="bg-sky-950/40 border border-sky-400/20 p-2 sm:p-3 rounded">
                  <span className="block text-2xl sm:text-4xl font-black text-white">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] sm:text-[10px] tracking-widest text-sky-300/70 uppercase">
                    MINUTES
                  </span>
                </div>
                <div className="bg-sky-950/40 border border-sky-400/20 p-2 sm:p-3 rounded">
                  <span className="block text-2xl sm:text-4xl font-black text-[#F5C542]">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] sm:text-[10px] tracking-widest text-sky-300/70 uppercase">
                    SECONDS
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs: Register and Mission Site Link */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={HACK2FUTURE_CONTENT.officialSite}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 rounded-full bg-sky-400 text-black px-6 py-3 font-mono text-xs font-black tracking-widest uppercase hover:bg-sky-300 transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)]"
              >
                <span>REGISTER FOR HACK2FUTURE</span>
                <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href={HACK2FUTURE_CONTENT.officialSite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-950/20 hover:bg-sky-900/30 text-sky-200 px-5 py-3 font-mono text-xs font-bold tracking-wider uppercase transition-colors"
              >
                <Terminal className="h-3.5 w-3.5 text-sky-400" />
                <span>VISIT MISSION SITE</span>
              </a>
            </div>
          </div>

          {/* Right Column: Floating Marble Astronaut Helmet with Glitch Shards */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              ref={helmetRef}
              className="relative w-[280px] sm:w-[340px] md:w-[380px] aspect-square transition-transform duration-200 ease-out will-change-transform select-none"
            >
              {/* Thin 1px Orbital Frame */}
              <div className="absolute -inset-4 border border-sky-400/20 rounded-full animate-spin [animation-duration:45s] pointer-events-none" />
              <div className="absolute -inset-8 border border-sky-400/10 rounded-full pointer-events-none" />

              {/* Yellow Glitch Shard Accent Bars */}
              <div
                className="absolute top-[28%] -left-6 z-20 h-5 w-24 bg-[#F5C542] mix-blend-screen opacity-85 shadow-[0_0_15px_#F5C542] animate-glitch-bar pointer-events-none"
                style={{ transform: 'skewX(-20deg)' }}
              />
              <div
                className="absolute bottom-[30%] -right-4 z-20 h-4 w-20 bg-sky-400 mix-blend-screen opacity-85 shadow-[0_0_15px_#38BDF8] pointer-events-none"
                style={{ transform: 'skewX(20deg)' }}
              />

              {/* Astronaut Bust Image */}
              <div className="relative h-full w-full rounded-2xl overflow-hidden border border-white/15 bg-black/40 backdrop-blur-sm">
                <Image
                  src="/images/astronaut.png"
                  alt="Hack2Future Classical Marble Astronaut Bust"
                  fill
                  sizes="(max-width: 768px) 300px, 380px"
                  className="object-cover object-center filter contrast-125 brightness-105"
                />
                {/* Halftone Mesh Gradient */}
                <div className="absolute inset-0 halftone-bg opacity-20 pointer-events-none text-sky-300" />
                
                {/* Monogram Badge */}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center font-mono text-[9px] text-sky-300 bg-black/60 px-3 py-1 border border-sky-400/30">
                  <span>FIG. H2F // APOLLO STATUE</span>
                  <span className="text-[#F5C542]">IIIT DWD</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Stats Row */}
        <div className="mb-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {HACK2FUTURE_CONTENT.missionStats.map((stat, i) => (
            <div
              key={i}
              className="editorial-frame p-4 sm:p-5 border-sky-400/20 bg-sky-950/15"
            >
              <div className="font-mono text-[10px] text-sky-300/70 tracking-widest uppercase">
                {stat.label}
              </div>
              <div className="mt-1 font-mono text-2xl sm:text-3xl font-black text-white">
                {stat.value}
              </div>
              <div className="mt-1 font-serif text-xs italic text-neutral-400">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>

        {/* 5 Hackathon Tracks */}
        <div className="mb-14">
          <div className="mb-6 flex items-center justify-between border-b border-sky-400/20 pb-3">
            <h3 className="font-mono text-xl sm:text-2xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-sky-400" />
              <span>MISSION TRACKS & CHALLENGES</span>
            </h3>
            <span className="font-mono text-xs text-sky-300/60 uppercase">
              5 SECTORS · DRAG & DRIFT
            </span>
          </div>

          <div style={{ width: '100%', height: '560px', position: 'relative' }}>
            <FlexCarousel
              items={TRACK_CAROUSEL_ITEMS}
              preset="liquid"
              intro="rise"
              cardHeight={0.5}
              gap={12}
              squeeze={0.2}
              focusOnClick
              captions
              fit="natural"
              radius={0}
              lensWidth={0.74}
              lensHeight={1.18}
              tilt={62}
              roundness={1}
              bend={0.34}
              reach={0.38}
              curl="twist"
              dispersion={0.45}
              liquid={0}
              followCursor={false}
              autoplay={false}
              interval={4}
              captureWheel
            />
          </div>
        </div>

        {/* Launch Sequence Timeline */}
        <div className="border border-sky-400/20 bg-sky-950/15 p-4 sm:p-8 backdrop-blur-md rounded-sm">
          {/* Timeline Header HUD */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-sky-400/20 pb-4">
            <div>
              <div className="font-mono text-[10px] text-[#F5C542] tracking-widest uppercase mb-1 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-[#F5C542]" />
                <span>FLIGHT TIMELINE // MISSION PROTOCOL</span>
              </div>
              <h3 className="font-mono text-xl sm:text-2xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                <span>LAUNCH SEQUENCE // MISSION TIMELINE</span>
              </h3>
            </div>

            {/* View Mode Toggle & Next/Prev Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-black/60 border border-sky-400/30 rounded-xs p-1 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setTimelineViewMode('3d')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xs transition-colors ${
                    timelineViewMode === '3d'
                      ? 'bg-sky-400 text-black font-bold'
                      : 'text-sky-300 hover:text-white'
                  }`}
                >
                  <Rotate3d className="h-3.5 w-3.5" />
                  <span>3D ORBIT</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTimelineViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xs transition-colors ${
                    timelineViewMode === 'grid'
                      ? 'bg-sky-400 text-black font-bold'
                      : 'text-sky-300 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>CHRONO MATRIX</span>
                </button>
              </div>

              {/* Prev / Next Orbit Chevrons */}
              {timelineViewMode === '3d' && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => timelineCarouselRef.current?.prev()}
                    aria-label="Previous Phase"
                    className="h-8 w-8 flex items-center justify-center rounded-xs border border-sky-400/40 bg-sky-950/40 text-sky-300 hover:bg-sky-400 hover:text-black transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => timelineCarouselRef.current?.next()}
                    aria-label="Next Phase"
                    className="h-8 w-8 flex items-center justify-center rounded-xs border border-sky-400/40 bg-sky-950/40 text-sky-300 hover:bg-sky-400 hover:text-black transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Timeline Step Track (Scrubber) */}
          <div className="mb-6 overflow-x-auto pb-2 scrollbar-thin">
            <div className="flex items-center justify-between min-w-[620px] relative px-4 py-3 border border-sky-400/20 bg-black/40 rounded-sm">
              {/* Connecting Progress Track Line */}
              <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-[2px] bg-sky-950 pointer-events-none z-0">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 via-[#F5C542] to-sky-400 transition-all duration-500"
                  style={{
                    width: `${(activeTimelineIndex / (TIMELINE_CAROUSEL_ITEMS.length - 1)) * 100}%`,
                  }}
                />
              </div>

              {TIMELINE_CAROUSEL_ITEMS.map((item, idx) => {
                const isSelected = activeTimelineIndex === idx;
                const isCompleted = item.status === 'Completed';
                const isActive = item.status === 'Active';

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveTimelineIndex(idx);
                      timelineCarouselRef.current?.focusIndex(idx);
                    }}
                    className={`relative z-10 flex flex-col items-center group transition-transform ${
                      isSelected ? 'scale-105' : 'hover:scale-102'
                    }`}
                  >
                    {/* Node Dot */}
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center font-mono text-[10px] font-bold transition-all shadow-md ${
                        isSelected
                          ? 'bg-[#F5C542] text-black ring-4 ring-[#F5C542]/30'
                          : isActive
                          ? 'bg-amber-500 text-black ring-2 ring-amber-400 animate-pulse'
                          : isCompleted
                          ? 'bg-sky-500 text-black'
                          : 'bg-black border border-sky-400/50 text-sky-300'
                      }`}
                    >
                      {isCompleted ? '✓' : `0${idx + 1}`}
                    </div>

                    {/* Stage Label */}
                    <span
                      className={`mt-2 font-mono text-[10px] tracking-wider uppercase transition-colors whitespace-nowrap ${
                        isSelected
                          ? 'text-[#F5C542] font-black'
                          : 'text-neutral-400 group-hover:text-sky-300'
                      }`}
                    >
                      {item.phase}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* VIEW MODE 1: 3D CYLINDER CAROUSEL */}
          {timelineViewMode === '3d' ? (
            <div>
              <div style={{ width: '100%', height: '560px', position: 'relative' }}>
                <CircularCarousel
                  ref={timelineCarouselRef}
                  items={TIMELINE_CAROUSEL_ITEMS}
                  preset="cylinder"
                  intro="rise"
                  cardWidth={260}
                  aspectRatio={0.78}
                  speed={14}
                  captions={false}
                  gap={25}
                  tilt={-5}
                  curve={1}
                  perspective={2500}
                  autoplay="drift"
                  interval={3}
                  direction="left"
                  momentum={0.6}
                  snap
                  pauseOnHover
                  focusOnClick
                  draggable
                  parallax={0.3}
                  stretch={0.5}
                  fadeColor="#000000"
                  depthFade={0.55}
                  innerShade={0.6}
                  cornerRadius={12}
                  onChange={(idx) => setActiveTimelineIndex(idx)}
                />
              </div>

              {/* Active Milestone Briefing HUD Panel */}
              <div className="mt-4 border border-sky-400/30 bg-black/70 p-4 sm:p-5 rounded font-mono backdrop-blur-md">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2 mb-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="h-2 w-2 rounded-full bg-[#F5C542] animate-ping" />
                    <span className="text-[#F5C542] font-bold">
                      // STAGE [0{activeTimelineIndex + 1}/0{TIMELINE_CAROUSEL_ITEMS.length}] · {TIMELINE_CAROUSEL_ITEMS[activeTimelineIndex].phase}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-sky-300">
                    <Calendar className="h-3 w-3 text-sky-400" />
                    <span>{TIMELINE_CAROUSEL_ITEMS[activeTimelineIndex].date}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-8">
                    <h4 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                      {TIMELINE_CAROUSEL_ITEMS[activeTimelineIndex].title}
                    </h4>
                    <p className="mt-1 font-sans text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {TIMELINE_CAROUSEL_ITEMS[activeTimelineIndex].desc}
                    </p>
                  </div>

                  <div className="md:col-span-4 flex md:justify-end items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-[10px] uppercase font-bold tracking-widest ${
                        TIMELINE_CAROUSEL_ITEMS[activeTimelineIndex].status === 'Completed'
                          ? 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                          : TIMELINE_CAROUSEL_ITEMS[activeTimelineIndex].status === 'Active'
                          ? 'bg-amber-950 text-[#F5C542] border border-[#F5C542] shadow-[0_0_15px_rgba(245,197,66,0.3)]'
                          : 'bg-sky-950 text-sky-400 border border-sky-400/50'
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      <span>{TIMELINE_CAROUSEL_ITEMS[activeTimelineIndex].status}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* VIEW MODE 2: CHRONO MATRIX (Structured Linear Grid) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TIMELINE_CAROUSEL_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className={`editorial-frame p-4 sm:p-5 flex flex-col justify-between transition-all ${
                    item.status === 'Active'
                      ? 'border-[#F5C542] bg-amber-950/20 shadow-[0_0_20px_rgba(245,197,66,0.15)]'
                      : 'border-sky-400/20 bg-black/50 hover:border-sky-400/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                      <span className="text-[#F5C542] font-bold">{item.tag}</span>
                      <span className="text-white/50">{item.date}</span>
                    </div>

                    <div className="font-mono text-xs text-sky-400 tracking-wider uppercase mb-1">
                      {item.phase}
                    </div>

                    <h4 className="font-mono text-sm sm:text-base font-bold text-white mb-2">
                      {item.title}
                    </h4>

                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[10px]">
                    <span className="text-white/40">// STATUS</span>
                    <span
                      className={`inline-flex items-center gap-1.5 font-bold ${
                        item.status === 'Completed'
                          ? 'text-neutral-400'
                          : item.status === 'Active'
                          ? 'text-[#F5C542]'
                          : 'text-sky-400'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          item.status === 'Completed'
                            ? 'bg-neutral-500'
                            : item.status === 'Active'
                            ? 'bg-[#F5C542] animate-ping'
                            : 'bg-sky-400'
                        }`}
                      />
                      <span>{item.status}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
