# AVINYA 2027 — Cinematic Festival Landing Page

A cinematic, hero-first landing page for **AVINYA 2027**, the techno-cultural festival of **Indian Institute of Information Technology Dharwad (IIIT Dharwad)**, taking place from **12–14 March 2027**.

The experience opens with a full-screen ship-and-ocean voyage. A scroll-driven frame sequence moves the ship animation forward or backward as the visitor scrolls, while festival identity and key information remain visible over the scene.

## Festival identity

Avinya is presented as a three-day voyage across three themed islands:

| Day | Date | Theme |
|---|---|---|
| Day 1 | 12 March 2027 | **The Last Outpost** — desert frontier |
| Day 2 | 13 March 2027 | **The Pandemonium** — synthwave / cyberpunk |
| Day 3 | 14 March 2027 | **The Carnival Island** — nighttime carnival |

The festival also features **Hack2Future**, IIIT Dharwad's flagship national-level hackathon.

## Current website experience

This version intentionally focuses on the hero section rather than rendering the full festival-page sections.

- Full-screen cinematic ship and ocean hero.
- Scroll-controlled canvas animation using a sequence of pre-rendered frames.
- Stabilized frame sequence stored under `public/voyage-frames-stabilized/`.
- Hero typography and festival details for AVINYA 2027.
- Calls to action for exploring the voyage and discovering Hack2Future, where their destinations are configured in the application.
- No homepage navbar or additional content sections in this hero-only version.

## Tech stack

- **Next.js** — application framework and App Router
- **React** — UI components
- **TypeScript** — application type safety
- **Tailwind CSS** — styling
- **GSAP / ScrollTrigger** — scroll-linked animation control
- **HTML Canvas** — rendering the ship animation frame sequence

The hero uses image frames rather than playing the source clip as a conventional video element. This allows the animation to respond to scroll progress and reverse when the visitor scrolls upward.

## Getting started

### Prerequisites

- Node.js version compatible with the Next.js version installed in this repository
- npm

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Create a production build

```bash
npm run build
```

### Run the linter

```bash
npm run lint
```

### Run the production server

```bash
npm run start
```

> These commands assume the corresponding scripts are defined in `package.json`.

## Hero frame assets

The stabilized hero frame sequence is expected in:

```text
public/
└── voyage-frames-stabilized/
    ├── frame files …
    └── …
```

Keep the frame files in the sequence and naming format expected by the frame loader in `VoyageCanvas`. If the frame directory or naming convention changes, update the frame path and frame count in the component together.

The project has used a 72-frame stabilized sequence. Confirm the actual filenames in the repository before changing the configured frame count.

### Frame-processing notes

The stabilized sequence was generated from the optimized source frames using OpenCV feature matching (ORB), affine motion estimation, and smoothing. The original optimized frames should be retained as a backup rather than overwritten.

## Project areas

The following are the main areas referenced by the current implementation. Confirm the exact repository structure if files have since been moved or renamed.

```text
src/
├── app/
│   ├── page.tsx                 # Homepage composition
│   └── globals.css              # Global styles
└── components/
    └── effects/
        └── VoyageCanvas.tsx     # Scroll-driven ship hero and canvas renderer

public/
└── voyage-frames-stabilized/    # Stabilized hero frame sequence
```

## Customization

### Change hero text

Update the hero overlay content in the component that renders the AVINYA title, festival description, date, and calls to action.

### Adjust scroll sensitivity

The amount of scrolling required to complete the ship sequence is controlled by the GSAP `ScrollTrigger` configuration in `VoyageCanvas`. Adjust the trigger's scroll distance / end position and test both forward and reverse scrolling. Do not change the frame count merely to change scroll speed.

### Replace or update frames

1. Preserve a backup of the current frame directory.
2. Keep all replacement frames at consistent dimensions and aspect ratio.
3. Keep frame names and ordering consistent with the loader, or update the loader accordingly.
4. Test loading, forward scrolling, reverse scrolling, and the final frame after replacement.

## Content source

Festival dates, island names and themes, and Hack2Future details are based on the Avinya project brief. The cultural and technical event PDFs contain the event information for the wider festival website; this hero-only version does not display the full event catalogue.

## Notes

- Do not remove the stabilized frame assets when cleaning or refactoring the project.
- Verify the hero in a browser at desktop and mobile sizes after changing canvas dimensions or scroll behavior.
- A successful lint and production build confirm code/build checks; they do not replace visual testing of scroll smoothness and frame stability.

---

**AVINYA 2027 · IIIT Dharwad · 12–14 March 2027**
