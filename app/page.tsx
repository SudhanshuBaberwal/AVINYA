import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Manifesto from '@/components/Manifesto';
import Voyage from '@/components/Voyage';
import HackToFuture from '@/components/HackToFuture';
import Events from '@/components/Events';
import Glimpses from '@/components/Glimpses';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col bg-[var(--bg)] text-[var(--fg)] selection:bg-[var(--accent)] selection:text-black">
      {/* Floating Pill Navigation */}
      <Nav />

      {/* Act 0: Hero & Set Sail */}
      <Hero />

      {/* Act I: Manifesto & Three Pillars */}
      <Manifesto />

      {/* Act II: The Voyage Across the Three Day Islands */}
      <Voyage />

      {/* Act III: Hack2Future Deep Space Flagship Hackathon */}
      <HackToFuture />

      {/* Act IV: Festival Schedule & Event Arenas */}
      <Events />

      {/* Act V: Iridescence Glimpses Archive */}
      <Glimpses />

      {/* Act VI: Final Embarkation CTA with Reaching Hands */}
      <FinalCTA />

      {/* Festival Footer & Colophon */}
      <Footer />
    </main>
  );
}
