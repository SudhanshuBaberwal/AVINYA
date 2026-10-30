'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Ticket, Check, X, Shield, Sparkles } from 'lucide-react';
import { FEST_METADATA } from '@/data/content';

export default function FinalCTA() {
  const [modalOpen, setModalOpen] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [passType, setPassType] = useState('full-fest');
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Magnetic button hover effect
  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const distX = e.clientX - btnCenterX;
      const distY = e.clientY - btnCenterY;
      const dist = Math.sqrt(distX * distX + distY * distY);

      // Trigger within 180px radius
      if (dist < 180) {
        const pull = 0.28;
        btn.style.transform = `translate3d(${distX * pull}px, ${distY * pull}px, 0) scale(1.06)`;
      } else {
        btn.style.transform = 'translate3d(0, 0, 0) scale(1)';
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
        setRegistered(false);
      }
    };
    if (modalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [modalOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      setRegistered(true);
    }
  };

  return (
    <section
      id="final-cta"
      className="relative min-h-[95svh] w-full bg-[#0A0A0C] py-20 sm:py-28 px-4 sm:px-8 border-b border-white/10 flex flex-col justify-center overflow-hidden"
    >
      {/* Halftone Dot Matrix Texture */}
      <div className="absolute inset-0 halftone-dense opacity-10 pointer-events-none text-white" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Frame Label */}
        <div className="mb-4 inline-flex items-center gap-2 border border-white/20 bg-white/5 px-4 py-1.5 font-mono text-[10px] sm:text-xs tracking-[0.25em] text-[var(--accent)] uppercase rounded-full">
          <Ticket className="h-3.5 w-3.5" />
          <span>PASS ISSUANCE // THE FINAL EMBARKATION</span>
        </div>

        <h2 className="font-mono text-3xl sm:text-6xl font-black uppercase text-white tracking-tight">
          CLAIM YOUR PLACE ABOARD
        </h2>

        <p className="mt-3 font-serif text-lg sm:text-2xl italic text-neutral-300 max-w-xl mx-auto">
          &ldquo;Between the reach of antiquity and tomorrow lies your ticket to the voyage.&rdquo;
        </p>

        {/* REACHING HANDS MOTIF WITH TICKET BUTTON SITTING IN THE GAP */}
        <div className="relative my-10 sm:my-14 mx-auto w-full max-w-4xl aspect-[16/9] sm:aspect-[2/1] select-none flex items-center justify-center">
          {/* Background Hands Image */}
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            <Image
              src="/images/reaching-hands.png"
              alt="Two classical marble hands reaching towards each other"
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover object-center filter grayscale contrast-130 brightness-90"
            />
            {/* Halftone Mask Overlay */}
            <div className="absolute inset-0 halftone-bg opacity-30 text-[var(--accent)] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-[#0A0A0C]/70" />
          </div>

          {/* Magnetic Pass Button Sitting in the Gap Between Fingers */}
          <div className="relative z-20 flex flex-col items-center">
            <button
              ref={buttonRef}
              onClick={() => setModalOpen(true)}
              className="group relative flex items-center gap-3 rounded-full bg-[var(--accent)] px-7 sm:px-10 py-4 sm:py-5 font-mono text-xs sm:text-sm font-black tracking-widest text-[#0A0A0C] uppercase shadow-[0_0_35px_rgba(245,197,66,0.6)] hover:shadow-[0_0_55px_rgba(245,197,66,0.9)] transition-all duration-200 cursor-pointer"
            >
              <Ticket className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>GET VOYAGE PASS // REGISTER</span>
              <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>

            <span className="mt-3 font-mono text-[10px] text-white/70 tracking-widest uppercase bg-black/60 px-3 py-1 rounded border border-white/20">
              FREE ADMISSION // 12–14 MARCH 2027
            </span>
          </div>
        </div>

        {/* Quick Institutional Assurance Badges */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-[var(--accent)]" />
            <span>Official IIIT Dharwad Festival Pass</span>
          </span>
          <span className="text-white/20">|</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-[var(--accent)]" />
            <span>Instant Digital Boarding QR Code</span>
          </span>
        </div>
      </div>

      {/* REGISTRATION MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-in fade-in duration-200"
          onClick={() => {
            setModalOpen(false);
            setRegistered(false);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="editorial-frame relative w-full max-w-lg p-6 sm:p-8 bg-[#0E0E14] border border-[var(--accent)] shadow-[0_0_40px_var(--glow-accent)] rounded-lg"
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setModalOpen(false);
                setRegistered(false);
              }}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>

            {!registered ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                <div className="border-b border-white/10 pb-3">
                  <span className="font-mono text-[10px] text-[var(--accent)] tracking-widest uppercase">
                    // BOARDING PERMIT APPLICATION
                  </span>
                  <h3 className="font-mono text-2xl font-black text-white mt-1">
                    AVINYA 2027 PASS
                  </h3>
                  <p className="font-serif text-xs italic text-neutral-400">
                    12, 13 & 14 March 2027 — IIIT Dharwad Campus
                  </p>
                </div>

                <div>
                  <label className="block font-mono text-[11px] text-white/80 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded border border-white/20 bg-black/50 p-2.5 font-mono text-xs text-white focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] text-white/80 uppercase mb-1">
                    Institutional Email / Phone
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@college.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded border border-white/20 bg-black/50 p-2.5 font-mono text-xs text-white focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] text-white/80 uppercase mb-1">
                    Pass Category
                  </label>
                  <select
                    value={passType}
                    onChange={(e) => setPassType(e.target.value)}
                    className="w-full rounded border border-white/20 bg-black/80 p-2.5 font-mono text-xs text-white focus:border-[var(--accent)] focus:outline-none"
                  >
                    <option value="full-fest">Full Fest Voyager Pass (All 3 Days)</option>
                    <option value="hack2future">Hack2Future 36-Hr Hackathon Competitor</option>
                    <option value="technical">Technical Arenas (Code Royale, AI Arcade, Yukti)</option>
                    <option value="cultural">Cultural Arenas (Battle of Bands, Fashion, Dance)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="mt-3 flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] text-black py-3 font-mono text-xs font-black tracking-widest uppercase hover:bg-yellow-400 transition-colors shadow-lg"
                >
                  <Ticket className="h-4 w-4" />
                  <span>CONFIRM REGISTRATION</span>
                </button>
              </form>
            ) : (
              <div className="py-6 text-center font-mono">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400">
                  <Check className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-white uppercase">
                  BOARDING PASS CONFIRMED
                </h3>
                <p className="mt-2 text-xs text-neutral-300 font-serif italic">
                  Welcome aboard, {name}. Your pass confirmation has been logged for {email}.
                </p>
                <div className="mt-6 border border-white/15 bg-black/60 p-4 rounded text-left text-[11px] text-neutral-300">
                  <div className="flex justify-between border-b border-white/10 pb-2 mb-2 font-bold text-[var(--accent)]">
                    <span>PASS ID // AVN-2027-{Math.floor(1000 + Math.random() * 9000)}</span>
                    <span>IIIT DWD</span>
                  </div>
                  <div>Dates: 12, 13 & 14 March 2027</div>
                  <div>Category: {passType.toUpperCase()}</div>
                  <div>Venue: IIIT Dharwad, Karnataka</div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="mt-6 rounded-full border border-white/20 px-6 py-2 text-xs font-bold text-white hover:bg-white/10"
                >
                  CLOSE WINDOW
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
