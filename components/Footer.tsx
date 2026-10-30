'use client';

import React from 'react';
import { FEST_METADATA } from '@/data/content';
import { useLenis } from '@/lib/lenis';
import {
  MapPin,
  Mail,
  Phone,
  Compass,
  ArrowUp,
  ExternalLink,
} from 'lucide-react';

export default function Footer() {
  const { scrollTo } = useLenis();

  return (
    <footer
      id="contact"
      className="relative w-full bg-[#070709] border-t border-white/15 pt-16 pb-12 px-4 sm:px-8 text-neutral-300 font-mono text-xs"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/40 text-[var(--accent)]">
                <Compass className="h-4 w-4" />
              </span>
              <span className="text-xl font-black tracking-tight text-white">
                AVINYA 2027
              </span>
            </div>

            <p className="font-serif text-sm italic text-neutral-400 max-w-sm leading-relaxed mb-4">
              The flagship techno-cultural festival of IIIT Dharwad. A three-day marble and halftone voyage across art, technology, and celebration.
            </p>

            <div className="font-mono text-[11px] text-[var(--accent)] font-bold">
              12, 13 & 14 MARCH 2027
            </div>
          </div>

          {/* Col 2: Venue & Interactive Google Maps */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span>VENUE & DIRECTIONS</span>
            </h4>

            <p className="text-neutral-400 text-xs leading-relaxed mb-3">
              {FEST_METADATA.venue.institution}
              <br />
              {FEST_METADATA.venue.address}
            </p>

            <div className="text-[10px] text-white/50 mb-3">
              COORDINATES: {FEST_METADATA.venue.coordinates}
            </div>

            <a
              href={FEST_METADATA.venue.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[var(--accent)] hover:underline text-xs"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Col 3: Contact & Channels */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              COMMUNICATION CHANNELS
            </h4>

            <div className="flex flex-col gap-2 text-xs text-neutral-400">
              <a
                href={`mailto:${FEST_METADATA.contacts.email}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-[var(--accent)]" />
                <span>{FEST_METADATA.contacts.email}</span>
              </a>

              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[var(--accent)]" />
                <span>{FEST_METADATA.contacts.studentConvener}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[var(--accent)]" />
                <span>{FEST_METADATA.contacts.techLead}</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href={FEST_METADATA.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href={FEST_METADATA.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href={FEST_METADATA.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={FEST_METADATA.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                </svg>
              </a>
              <a
                href={FEST_METADATA.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 4: Quick Anchor Nav & Return to Top */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
                SECTIONS
              </h4>
              <ul className="flex flex-col gap-1.5 text-xs text-neutral-400">
                <li>
                  <a
                    href="#hero"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo('#hero');
                    }}
                    className="hover:text-[var(--accent)] transition-colors"
                  >
                    // 00 Hero
                  </a>
                </li>
                <li>
                  <a
                    href="#manifesto"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo('#manifesto');
                    }}
                    className="hover:text-[var(--accent)] transition-colors"
                  >
                    // 01 Manifesto
                  </a>
                </li>
                <li>
                  <a
                    href="#voyage"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo('#voyage');
                    }}
                    className="hover:text-[var(--accent)] transition-colors"
                  >
                    // 02 The Voyage
                  </a>
                </li>
                <li>
                  <a
                    href="#hack2future"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo('#hack2future');
                    }}
                    className="hover:text-[var(--accent)] transition-colors"
                  >
                    // 03 Hack2Future
                  </a>
                </li>
                <li>
                  <a
                    href="#events"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo('#events');
                    }}
                    className="hover:text-[var(--accent)] transition-colors"
                  >
                    // 04 Events
                  </a>
                </li>
              </ul>
            </div>

            <button
              onClick={() => scrollTo('#hero')}
              className="mt-6 flex items-center gap-1.5 font-mono text-[11px] text-[var(--accent)] hover:underline"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              <span>RETURN TO MAST</span>
            </button>
          </div>
        </div>

        {/* Official Partners / Sponsors Placeholder Frames */}
        <div className="py-8 border-b border-white/10">
          <div className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase mb-4 text-center">
            OFFICIAL PATRONS & INDUSTRY PARTNERS
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              'GOOGLE CLOUD',
              'IBM QUANTUM',
              'GITHUB EDUCATION',
              'IEEE SECTION',
              'INTEL LABS',
              'DEVPOST',
            ].map((sponsor, i) => (
              <div
                key={i}
                className="editorial-frame p-3 text-center font-mono text-[10px] text-white/50 tracking-wider hover:text-[var(--accent)] transition-colors"
              >
                {sponsor}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
          <div>
            © 2027 AVINYA · IIIT Dharwad. All Rights Reserved.
          </div>
          <div className="text-center sm:text-right font-serif italic text-white/60">
            Crafted with marble, halftone waves & code by IIIT Dharwad voyagers.
          </div>
        </div>
      </div>
    </footer>
  );
}
