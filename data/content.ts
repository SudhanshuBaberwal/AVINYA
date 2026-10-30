export interface IslandInfo {
  dayNumber: 1 | 2 | 3;
  slug: string;
  name: string;
  subheading: string;
  date: string;
  fullDate: string;
  theme: string;
  image: string;
  palette: {
    bg: string;
    fg: string;
    accent: string;
    accent2: string;
    border: string;
  };
  quote: string;
  description: string;
  coordinates: string;
}

export const FEST_METADATA = {
  name: "AVINYA",
  edition: "2027",
  title: "AVINYA 2027 — Techno-Cultural Fest",
  tagline: "The Marble & Halftone Voyage",
  subtitle: "Techno-Cultural Fest of Indian Institute of Information Technology Dharwad",
  dates: "12, 13 & 14 MARCH 2027",
  shortDates: "12–14 MAR '27",
  venue: {
    institution: "Indian Institute of Information Technology Dharwad",
    shortName: "IIIT Dharwad",
    address: "Ittigatti Road, Near Sattur Colony, Dharwad, Karnataka 580009",
    mapUrl: "https://maps.google.com/?q=Indian+Institute+of+Information+Technology+Dharwad",
    coordinates: "15.3929° N, 75.0248° E",
    elevation: "720m ASL",
  },
  stats: [
    { label: "Islands to Sail", value: "03", unit: "Days" },
    { label: "Competitions", value: "24+", unit: "Arenas" },
    { label: "National Hackathon", value: "₹2.5L+", unit: "Prizes" },
    { label: "Footfall Expected", value: "5,000+", unit: "Voyagers" },
  ],
  contacts: {
    email: "avinya@iiitdwd.ac.in",
    studentConvener: "+91 98765 43210 (Student Lead)",
    techLead: "+91 91234 56789 (Tech Secretary)",
  },
  socials: {
    instagram: "https://instagram.com/avinya_iiitdwd",
    linkedin: "https://linkedin.com/school/iiit-dharwad",
    twitter: "https://twitter.com/iiitdwd",
    youtube: "https://youtube.com/@iiitdharwad",
    github: "https://github.com/iiitdwd",
  },
};

export const ISLANDS: IslandInfo[] = [
  {
    dayNumber: 1,
    slug: "the-last-outpost",
    name: "THE LAST OUTPOST",
    subheading: "Where the sands test the resilient",
    date: "12 MARCH 2027",
    fullDate: "FRIDAY, 12 MARCH 2027",
    theme: "Dune Desert & Ancient Ruins",
    image: "/images/day1.jpg",
    palette: {
      bg: "#120B07",
      fg: "#F8EFE6",
      accent: "#E07A2E",
      accent2: "#418080",
      border: "rgba(224, 122, 46, 0.3)",
    },
    quote: "A monolithic citadel standing tall against the swirling dunes of time.",
    description: "Your vessel touches the arid banks of The Last Outpost. Under the twin suns, algorithmic gladiators battle in Code Royale, market titans risk all in Monopoly, and the dusk erupts with the inaugural cultural lights.",
    coordinates: "LAT 15°23'34\" N · LON 75°01'29\" E",
  },
  {
    dayNumber: 2,
    slug: "the-pandemonium",
    name: "THE PANDEMONIUM",
    subheading: "The neon pulse of the electric archipelago",
    date: "13 MARCH 2027",
    fullDate: "SATURDAY, 13 MARCH 2027",
    theme: "Synthwave Cyberpunk Metropolis",
    image: "/images/day2.jpg",
    palette: {
      bg: "#090414",
      fg: "#FBF2FF",
      accent: "#FF2E93",
      accent2: "#8A2BE2",
      border: "rgba(255, 46, 147, 0.3)",
    },
    quote: "Skyscrapers dripping in magenta rain, where quantum circuits hum to heavy rock.",
    description: "Night falls as the ship glides into a high-voltage neon soundscape. Quantum gates are wired in Yukti 2.0, autonomous agents awaken in Build with Gemma, and the main stage erupts with the Battle of the Bands.",
    coordinates: "LAT 15°24'11\" N · LON 75°02'04\" E",
  },
  {
    dayNumber: 3,
    slug: "the-carnival-island",
    name: "THE CARNIVAL ISLAND",
    subheading: "The grand masquerade beneath the paper stars",
    date: "14 MARCH 2027",
    fullDate: "SUNDAY, 14 MARCH 2027",
    theme: "Venetian Lanterns & Night Revelry",
    image: "/images/day3.jpg",
    palette: {
      bg: "#061214",
      fg: "#FFF8E7",
      accent: "#FFB703",
      accent2: "#E63946",
      border: "rgba(255, 183, 3, 0.3)",
    },
    quote: "Ten thousand lanterns drifting into the deep night sky as the voyagers celebrate triumph.",
    description: "The culmination of the voyage. Kernel Panic challenges Linux masters by morning, haute couture lights up the runway by twilight, and an open-air EDM spectacle rings out until the final anchor drops.",
    coordinates: "LAT 15°24'55\" N · LON 75°02'50\" E",
  },
];

export const HACK2FUTURE_CONTENT = {
  name: "HACK2FUTURE",
  badge: "NATIONAL FLAGSHIP 36-HR HACKATHON",
  theme: "DEEP SPACE // APOLLO MISSION PROTOCOL",
  officialSite: "https://hack2future.iiitdwd.ac.in/",
  prizePool: "₹2,50,000+",
  cashPrizes: "₹1,50,000 Direct Cash + ₹1,00,000 Incubation & Cloud Grants",
  dates: "12–13 MARCH 2027",
  duration: "36 Continuous Hours",
  mode: "Offline at IIIT Dharwad Campus",
  tagline: "Break free from planetary orbit. Build the software of tomorrow.",
  targetAudience: "Open to all engineering & polytechnic undergraduates across India",
  tracks: [
    {
      id: "ai-agents",
      title: "Agentic AI & Cognition",
      tag: "TRACK 01",
      description: "Autonomous reasoning agents, multi-agent swarms, LLM tool execution, and local neuro-symbolic reasoning.",
    },
    {
      id: "web3-trust",
      title: "Decentralized Systems & Cryptography",
      tag: "TRACK 02",
      description: "Zero-knowledge proofs, resilient consensus, verifiable compute, and sovereign decentralized identities.",
    },
    {
      id: "fintech",
      title: "FinTech & Algorithmic Markets",
      tag: "TRACK 03",
      description: "High-frequency trade execution, automated fraud detection, UPI infrastructure innovations, and algorithmic micro-credit.",
    },
    {
      id: "biotech",
      title: "Healthcare & Precision Omics",
      tag: "TRACK 04",
      description: "AI-driven diagnostics, clinical trial automation, accessible tele-medicine, and bioinformatics pipelines.",
    },
    {
      id: "open-space",
      title: "Open Innovation & Deep Tech",
      tag: "TRACK 05",
      description: "Satellite telemetry, edge IoT computing, sustainable energy grids, and unconstrained moonshots.",
    },
  ],
  timeline: [
    { phase: "T-40 DAYS", title: "Flight Deck Registration Opens", date: "Feb 01, 2027", status: "Completed" },
    { phase: "T-10 DAYS", title: "Idea Phase Shortlisting & Confirmation", date: "Mar 02, 2027", status: "Active" },
    { phase: "T-00:00", title: "Liftoff: 36-Hour Hacking Sequence Begins", date: "Mar 12, 10:00 AM", status: "Upcoming" },
    { phase: "T+24:00", title: "Mid-Mission Review & Mentor Checkpoint", date: "Mar 13, 10:00 AM", status: "Upcoming" },
    { phase: "T+36:00", title: "Final Code Freeze & Orbital Pitches", date: "Mar 13, 10:00 PM", status: "Upcoming" },
    { phase: "MISSION SUCCESS", title: "Grand Awards at Avinya Main Arena", date: "Mar 14, 07:30 PM", status: "Upcoming" },
  ],
  missionStats: [
    { label: "PRIZE VAULT", value: "₹2.5L+", desc: "Cash & Perks" },
    { label: "MISSION CLOCK", value: "36 HRS", desc: "Non-stop code" },
    { label: "FLIGHT CREWS", value: "75+", desc: "Teams on site" },
    { label: "MENTORS & JUDGES", value: "15+", desc: "FAANG & Startups" },
  ],
};
