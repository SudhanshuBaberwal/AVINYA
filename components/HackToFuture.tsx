'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { HACK2FUTURE_CONTENT, FEST_METADATA } from '@/data/content';
import { Terminal, ExternalLink, Rocket, Award, Shield, Cpu, Clock, Layers } from 'lucide-react';

// Lazy-load starfield canvas with SSR disabled
const Starfield = dynamic(() => import('./reactbits/Starfield'), {
  ssr: false,
});

export default function HackToFuture() {
  const helmetRef = useRef<HTMLDivElement>(null);
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
              5 SECTORS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {HACK2FUTURE_CONTENT.tracks.map((track) => (
              <div
                key={track.id}
                className="editorial-frame p-4 sm:p-5 flex flex-col justify-between border-sky-400/20 hover:border-sky-400 group"
              >
                <div>
                  <div className="font-mono text-[9px] text-[#F5C542] tracking-widest uppercase mb-2">
                    {track.tag}
                  </div>
                  <h4 className="font-mono text-sm sm:text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                    {track.title}
                  </h4>
                  <p className="mt-2 text-xs text-neutral-300 leading-relaxed">
                    {track.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 font-mono text-[9px] text-sky-400/70 flex items-center justify-between">
                  <span>ORBIT READY</span>
                  <span>// 0{track.tag.slice(-1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Launch Sequence Timeline */}
        <div className="border border-sky-400/20 bg-sky-950/10 p-6 sm:p-8 backdrop-blur-md rounded-sm">
          <div className="mb-6 flex items-center justify-between border-b border-sky-400/20 pb-3">
            <h3 className="font-mono text-lg sm:text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#F5C542]" />
              <span>LAUNCH SEQUENCE // MISSION TIMELINE</span>
            </h3>
            <span className="font-mono text-xs text-sky-400">STATUS: GREEN // GO FOR LAUNCH</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {HACK2FUTURE_CONTENT.timeline.map((item, idx) => (
              <div
                key={idx}
                className="border border-white/10 bg-black/40 p-3 sm:p-4 rounded font-mono text-xs"
              >
                <div className="flex items-center justify-between text-[10px] text-sky-400 mb-1">
                  <span className="font-bold">{item.phase}</span>
                  <span className="text-white/50">{item.date}</span>
                </div>
                <div className="text-sm font-semibold text-white mt-1">
                  {item.title}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[10px]">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      item.status === 'Completed'
                        ? 'bg-neutral-500'
                        : item.status === 'Active'
                        ? 'bg-[#F5C542] animate-pulse'
                        : 'bg-sky-400'
                    }`}
                  />
                  <span className="text-neutral-400">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
