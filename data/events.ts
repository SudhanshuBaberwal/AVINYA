export interface EventItem {
  id: string;
  name: string;
  club: string;
  category: 'Technical' | 'Cultural' | 'Gaming' | 'Management' | 'Flagship';
  day: 1 | 2 | 3;
  time: string;
  venue: string;
  description: string;
  highlight?: boolean;
  tagline?: string;
  format?: string;
  timeSlot?: 'Morning' | 'Afternoon' | 'Twilight & Night';
}

export const FEST_EVENTS: EventItem[] = [
  // DAY 1 - THE LAST OUTPOST
  {
    id: 'code-royale',
    name: 'Code Royale',
    club: 'Return 0, OS Code, MSA',
    category: 'Technical',
    day: 1,
    time: '10:00 AM – 2:00 PM',
    venue: '260 Seater Audi',
    description: 'A fast-paced 3v3 competitive programming showdown featuring a standard qualification round followed by a relay-style knockout where every accepted submission forces a coder switch.',
    highlight: true,
    tagline: '3v3 relay competitive code arena',
    format: '3v3 Relay Knockout',
    timeSlot: 'Morning'
  },
  {
    id: 'photography-contest',
    name: 'Photography Contest',
    club: 'Iridescence',
    category: 'Cultural',
    day: 1,
    time: '10:00 AM – 12:00 PM',
    venue: 'PI Block (Backside)',
    description: 'Participants capture creative photographs based on a surprise fest theme revealed right at the start. Evaluated on composition, narrative, and artistic vision.',
    highlight: false,
    format: 'Solo Creative',
    timeSlot: 'Morning'
  },
  {
    id: 'ai-arcade',
    name: 'AI Arcade',
    club: 'AccelAIrate, IEEE',
    category: 'Technical',
    day: 1,
    time: '11:00 AM – 5:00 PM',
    venue: '260 Seater Hall',
    description: 'A two-stage competitive AI challenge in teams of two. Stage 1: Visual Reverse-Prompting & Logical Constraint Bypass. Stage 2: Time-bound RAG Treasure Hunt querying curated knowledge vaults.',
    highlight: true,
    tagline: 'Prompt engineering & RAG treasure hunt',
    format: 'Teams of 2 (Prompt + RAG)',
    timeSlot: 'Morning'
  },
  {
    id: 'drama-competition',
    name: 'Drama Competition',
    club: 'Limelight',
    category: 'Cultural',
    day: 1,
    time: '11:00 AM – 1:00 PM',
    venue: '260 Seater',
    description: 'Inter-college theatrical stage performances judged on dramatic intensity, storytelling, stage presence, and voice projection.',
    highlight: false,
    format: 'Inter-College Troupe',
    timeSlot: 'Morning'
  },
  {
    id: 'monopoly',
    name: 'Monopoly: Stock Simulation',
    club: 'Inquizitive, ECell, QFis',
    category: 'Management',
    day: 1,
    time: '2:00 PM – 6:00 PM',
    venue: 'Incubation Hall',
    description: 'Stock-market simulation where 30 teams of 3–4 members compete to grow ₹1,00,000 virtual capital across 8 companies through 12 dynamic market news cycles and quiz rounds.',
    highlight: true,
    tagline: 'High-stakes capital trading simulation',
    format: 'Teams of 3–4 (₹1L Virtual Capital)',
    timeSlot: 'Afternoon'
  },
  {
    id: 'music-competition',
    name: 'Music Competition',
    club: '440 Hz',
    category: 'Cultural',
    day: 1,
    time: '2:00 PM – 5:00 PM',
    venue: '120 Seater',
    description: 'Solo and band acoustic & electric musical showcases across multiple genres evaluated by an esteemed panel of classical and contemporary judges.',
    highlight: false,
    format: 'Solo & Acoustic Band',
    timeSlot: 'Afternoon'
  },
  {
    id: 'just-a-minute',
    name: 'Just A Minute (JAM)',
    club: 'Zeitgeist',
    category: 'Cultural',
    day: 1,
    time: '2:00 PM – 5:00 PM',
    venue: '120 Seater Audi',
    description: 'The legendary fast-paced speaking game where speakers hold the floor on random impromptu topics for 60 seconds without hesitation, repetition, or deviation.',
    highlight: false,
    format: 'Solo Speaking Trial',
    timeSlot: 'Afternoon'
  },
  {
    id: 'treasure-hunt',
    name: 'Campus Treasure Hunt',
    club: 'Zeitgeist',
    category: 'Gaming',
    day: 1,
    time: '3:00 PM – 5:00 PM',
    venue: 'Entire Campus',
    description: 'Cryptic riddles, physical checkpoint trials, and geo-encoded puzzles scattered across the campus grounds leading to the grand secret chest.',
    highlight: false,
    format: 'Campus Squads',
    timeSlot: 'Afternoon'
  },
  {
    id: 'opening-ceremony',
    name: 'Opening Ceremony & Cultural Night',
    club: 'Mosaic',
    category: 'Flagship',
    day: 1,
    time: '6:00 PM – 9:00 PM',
    venue: 'Front Gate E-Block',
    description: 'Official inaugural lamp lighting of Avinya 2027 followed by headline guest performances, student dance troupes, and an electric night launch.',
    highlight: true,
    tagline: 'The grand unveiling of Avinya 2027',
    format: 'Inaugural Showcase',
    timeSlot: 'Twilight & Night'
  },

  // DAY 2 - THE PANDEMONIUM
  {
    id: 'yukti-2',
    name: 'Yukti 2.0: Quantum Hackathon',
    club: 'GND_0, IRIS, QC',
    category: 'Technical',
    day: 2,
    time: '9:00 AM – 5:00 PM',
    venue: 'Incubation Hall / 260 Seater',
    description: 'Design a hardware module to generate QFT gate sequences, connect it via Qiskit, and execute the resulting circuits on real IBM Quantum hardware in a 6-hour hackathon.',
    highlight: true,
    tagline: 'FPGA meets real IBM Quantum hardware',
    format: 'Hardware Hackathon (Qiskit + IBM Q)',
    timeSlot: 'Morning'
  },
  {
    id: 'mega-rush-2',
    name: 'Mega Rush 2.0 (Esports)',
    club: 'Techniosys',
    category: 'Gaming',
    day: 2,
    time: '10:00 AM – 6:00 PM',
    venue: 'Labs L405-L407 & 240 Seater',
    description: 'Campus-wide LAN tournament featuring tactical shooters, battle royales, and fighting games with live shoutcasting on stadium screens.',
    highlight: true,
    tagline: 'High-octane collegiate esports championship',
    format: 'Multi-Lab LAN Tournament',
    timeSlot: 'Morning'
  },
  {
    id: 'build-with-gemma',
    name: 'Build with Gemma: Agentic Edition',
    club: 'GDG, Velocity, DSAI Soc',
    category: 'Technical',
    day: 2,
    time: '10:00 AM – 5:00 PM',
    venue: 'Both 260 Seaters',
    description: 'A 6-hour autonomous agent competition powered by Google Gemma. Build reasoning multi-agent workflows with tool-calling capabilities and UI interfaces.',
    highlight: true,
    tagline: 'Autonomous AI agents powered by Gemma',
    format: '6-Hour Agentic AI Challenge',
    timeSlot: 'Morning'
  },
  {
    id: 'solo-duet-dance',
    name: 'Solo & Duet Dance',
    club: 'Dynamight',
    category: 'Cultural',
    day: 2,
    time: '10:00 AM – 1:00 PM',
    venue: 'M Block Courtyard',
    description: 'Choreographed solo and partner showdowns encompassing hip-hop, contemporary, locking, and classical fusion.',
    highlight: false,
    format: 'Solo & Partner Showdown',
    timeSlot: 'Morning'
  },
  {
    id: 'standup-comedy',
    name: 'Stand-Up Comedy Show',
    club: 'Invited Artist',
    category: 'Cultural',
    day: 2,
    time: '11:00 AM – 12:30 PM',
    venue: 'Ground Amphitheatre',
    description: 'An open-air comedy special with observational campus humour, sharp punchlines, and crowd-work by top comedic talent.',
    highlight: false,
    format: 'Open Air Special',
    timeSlot: 'Morning'
  },
  {
    id: 'debate-competition',
    name: 'Parliamentary Debate',
    club: 'Zeitgeist',
    category: 'Cultural',
    day: 2,
    time: '2:00 PM – 5:00 PM',
    venue: '240 Seater',
    description: 'Collegiate teams clash over contemporary geopolitical, technological, and ethical motions in an Oxford-style parliamentary format.',
    highlight: false,
    format: 'Oxford Parliamentary',
    timeSlot: 'Afternoon'
  },
  {
    id: 'tote-bag-painting',
    name: 'Tote Bag Painting Jam',
    club: 'Mosaic',
    category: 'Cultural',
    day: 2,
    time: '2:00 PM – 5:00 PM',
    venue: '2 x 120 Seaters',
    description: 'Expressive textile art jam where participants design and take home custom-painted canvas tote bags with acrylic dyes and stencils.',
    highlight: false,
    format: 'Open Textile Art Jam',
    timeSlot: 'Afternoon'
  },
  {
    id: 'group-dance',
    name: 'Group Dance Extravaganza',
    club: 'Dynamight',
    category: 'Cultural',
    day: 2,
    time: '3:00 PM – 6:00 PM',
    venue: 'Main Ground Stage',
    description: 'High-energy synchronization battles between collegiate crews featuring thematic narratives, stunt formations, and lighting synchronization.',
    highlight: true,
    tagline: 'Inter-collegiate crew choreography battles',
    format: 'Collegiate Crew Battle',
    timeSlot: 'Afternoon'
  },
  {
    id: 'battle-of-bands',
    name: 'Battle of the Bands',
    club: '440 Hz',
    category: 'Cultural',
    day: 2,
    time: '6:30 PM – 9:00 PM',
    venue: 'Main Ground Stage',
    description: 'College rock, metal, fusion, and indie bands electrify the main arena with original compositions and thunderous covers.',
    highlight: true,
    tagline: 'Amplified rock & fusion concert showdown',
    format: 'Live Amplified Rock Battle',
    timeSlot: 'Twilight & Night'
  },

  // DAY 3 - THE CARNIVAL ISLAND
  {
    id: 'kernel-panic',
    name: 'Kernel Panic: Linux Festival',
    club: 'OS Code, Velocity',
    category: 'Technical',
    day: 3,
    time: '10:00 AM – 5:00 PM',
    venue: '120 Seater',
    description: 'Grand Linux Festival featuring a Linux User Meetup, custom desktop rice showcase, kernel driver teardowns, and a rapid troubleshooting mini-hackathon.',
    highlight: true,
    tagline: 'Desktop ricing, kernel hacking & open source',
    format: 'Linux Fest & Rice Hackathon',
    timeSlot: 'Morning'
  },
  {
    id: 'quiz-quest',
    name: 'Quiz Quest',
    club: 'Inquizitive',
    category: 'Cultural',
    day: 3,
    time: '10:00 AM – 12:00 PM',
    venue: '120 Seater',
    description: 'General knowledge, tech trivia, pop culture, and cryptic visual connect rounds for sharp collegiate minds.',
    highlight: false,
    format: 'Teams of 2 (Trivia & Tech)',
    timeSlot: 'Morning'
  },
  {
    id: 'street-play',
    name: 'Nukkad Natak (Street Play)',
    club: 'Limelight',
    category: 'Cultural',
    day: 3,
    time: '11:00 AM – 1:00 PM',
    venue: 'Main Ground Arena',
    description: 'Powerful acoustic street performances tackling pertinent societal themes with rhythmic percussion, slogans, and raw dramatic movement.',
    highlight: false,
    format: 'Nukkad Natak Troupe',
    timeSlot: 'Morning'
  },
  {
    id: 'fashion-show',
    name: 'Couture: The Themed Fashion Runway',
    club: 'InMotion',
    category: 'Cultural',
    day: 3,
    time: '3:00 PM – 5:30 PM',
    venue: 'Main Ground Stage',
    description: 'Avant-garde styling, custom student-designed haute couture, and dramatic choreography exploring myth, futurism, and classical aesthetics.',
    highlight: true,
    tagline: 'Avant-garde runway fashion show',
    format: 'Themed Haute Couture Runway',
    timeSlot: 'Afternoon'
  },
  {
    id: 'closing-ceremony',
    name: 'Closing Ceremony & Prize Distribution',
    club: 'All Techno-Cultural Clubs',
    category: 'Flagship',
    day: 3,
    time: '7:30 PM – 9:00 PM',
    venue: 'Main Ground',
    description: 'Felicitation of winners across 20+ competitions, awarding of championship trophies, and emotional finale address.',
    highlight: false,
    format: 'Grand Awards & Felicitation',
    timeSlot: 'Twilight & Night'
  },
  {
    id: 'dj-night',
    name: 'Grand Finale DJ Concert',
    club: 'Invited Artist',
    category: 'Flagship',
    day: 3,
    time: '9:00 PM – 11:00 PM',
    venue: 'Main Ground Stage',
    description: 'High-energy electronic dance music spectacle featuring visual projection mapping, bass drops, and open-air celebration under the stars.',
    highlight: true,
    tagline: 'The ultimate closing EDM celebration',
    format: 'Electronic Dance Spectacle',
    timeSlot: 'Twilight & Night'
  }
];

export const CATEGORIES = ['All', 'Technical', 'Cultural', 'Gaming', 'Management', 'Flagship'] as const;
export type EventCategory = (typeof CATEGORIES)[number];
