import type { Metadata } from 'next';
import { Space_Grotesk, Cormorant_Garamond, JetBrains_Mono, Inter } from 'next/font/google';
import './globals.css';
import { SmoothScrollProvider } from '@/lib/lenis';
import Grain from '@/components/Grain';
import Cursor from '@/components/Cursor';
import Preloader from '@/components/Preloader';
import ThemeBlender from '@/components/ThemeBlender';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AVINYA 2027 — The Marble & Halftone Voyage | IIIT Dharwad',
  description:
    'Experience Avinya 2027, the flagship techno-cultural festival of IIIT Dharwad. 12, 13 & 14 March 2027. Three mythical islands, 24+ events, and Hack2Future national hackathon.',
  keywords: [
    'Avinya 2027',
    'IIIT Dharwad',
    'Techno-Cultural Fest',
    'Hack2Future',
    'Hackathon',
    'College Fest Karnataka',
    'Dharwad Hackathon',
  ],
  authors: [{ name: 'IIIT Dharwad Fest Committee' }],
  openGraph: {
    title: 'AVINYA 2027 — The Marble & Halftone Voyage',
    description: '12, 13 & 14 March 2027. Set sail across the three islands of Avinya at IIIT Dharwad.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Avinya 2027',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AVINYA 2027 — IIIT Dharwad Techno-Cultural Fest',
    description: '12–14 March 2027. The Marble & Halftone Voyage.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${cormorant.variable} ${jetbrainsMono.variable} ${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-[100svh] bg-[var(--bg)] text-[var(--fg)] selection:bg-[var(--accent)] selection:text-black">
        <SmoothScrollProvider>
          <Preloader />
          <Grain />
          <Cursor />
          <ThemeBlender />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
