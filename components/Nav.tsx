'use client';

import { useEffect, useState } from 'react';
import { useLenis } from '@/lib/lenis';
import { Menu, X, Compass, ArrowUpRight } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Voyage', href: '#voyage' },
  { label: 'Manifesto', href: '#manifesto' },
  { label: 'Hack2Future', href: '#hack2future', highlight: true },
  { label: 'Events', href: '#events' },
  { label: 'Glimpses', href: '#glimpses' },
  { label: 'Contact', href: '#contact' },
];

export default function Nav() {
  const { scrollTo } = useLenis();
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Scroll-spy observer for active section
      const sections = ['hero', 'manifesto', 'voyage', 'hack2future', 'events', 'glimpses', 'contact'];
      const scrollPos = window.scrollY + 250;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    scrollTo(href);
  };

  return (
    <>
      <header
        className={`fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-300 pointer-events-none`}
      >
        <nav
          className={`pointer-events-auto flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border border-[var(--border-frame)] bg-[#0A0A0C]/80 backdrop-blur-xl shadow-2xl transition-all duration-300 ${
            scrolled ? 'scale-95 border-white/25 shadow-black/80' : 'scale-100'
          }`}
          aria-label="Main Navigation"
        >
          {/* Brand Logo / Monogram */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-2 pr-2 sm:pr-3 pl-1 font-mono text-xs font-bold tracking-widest text-[var(--fg)] hover:text-[var(--accent)] transition-colors group"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/40 text-[var(--accent)] group-hover:rotate-45 transition-transform duration-300">
              <Compass className="h-3.5 w-3.5" />
            </span>
            <span className="hidden sm:inline font-black tracking-[-0.02em]">AVINYA</span>
            <span className="hidden md:inline font-mono text-[9px] text-[var(--accent)] px-1 rounded bg-[var(--accent)]/10 border border-[var(--accent)]/30">
              ’27
            </span>
          </a>

          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-all duration-200 rounded-full ${
                    isActive
                      ? 'text-[#0A0A0C] font-semibold bg-[var(--accent)]'
                      : item.highlight
                      ? 'text-[var(--accent)] hover:text-white hover:bg-white/5'
                      : 'text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  {item.highlight && !isActive && (
                    <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                  )}
                </a>
              );
            })}
          </div>

          <div className="h-4 w-[1px] bg-white/10 hidden md:block" />

          {/* Register / CTA Button */}
          <a
            href="#final-cta"
            onClick={(e) => handleNavClick(e, '#final-cta')}
            className="group relative flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-[var(--accent)] text-white hover:text-black px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-wider transition-all duration-300 border border-white/20 hover:border-[var(--accent)] hover:shadow-[0_0_15px_var(--glow-accent)]"
          >
            <span>GET PASS</span>
            <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu Drawer Sheet */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col justify-center bg-[#0A0A0C]/95 backdrop-blur-2xl px-8 text-center md:hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="absolute inset-0 halftone-dense opacity-10 pointer-events-none" />
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-6">
            // VOYAGE MANIFEST
          </p>
          <div className="flex flex-col gap-5">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="font-mono text-xl uppercase tracking-wider text-[var(--fg)] hover:text-[var(--accent)] transition-colors py-1 border-b border-white/10"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#final-cta"
              onClick={(e) => handleNavClick(e, '#final-cta')}
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] text-black py-3 font-mono text-sm font-bold tracking-widest uppercase shadow-[0_0_20px_var(--glow-accent)]"
            >
              <span>BOARD THE SHIP // GET PASS</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
