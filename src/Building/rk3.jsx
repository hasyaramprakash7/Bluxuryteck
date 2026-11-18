"use client";

// Cinematic two-section landing page — single-file React component.
// Requires: react, framer-motion, tailwindcss.
// The liquid-glass classes, font imports, and base styles live in one <style>
// block because they rely on CSS mask-composite (not expressible in Tailwind).

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/* ============================================================
   ASSETS
   ============================================================ */
const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260619_191346_9d19d66e-86a4-47f7-8dc6-712c1788c3b2.mp4";
const CAPS_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_093722_ccfc7ebf-182f-419f-8a62-2dc02db7dd9d.mp4";

const NAV_LINKS = ["Work", "Studio", "Services", "Journal", "Contact"];
const TRUST = ["Aeon", "Vela", "Apex", "Orbit", "Zeno"];

/* ============================================================
   CSS — liquid glass + fonts + base
   ============================================================ */
const GLASS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600&display=swap');

html, body {
  background: #000;
  color: #fff;
  font-family: 'Barlow', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.font-heading { font-family: 'Instrument Serif', serif; font-style: italic; }
.font-body { font-family: 'Barlow', sans-serif; }

.liquid-glass {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}
.liquid-glass::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg,
    rgba(255,255,255,0.45) 0%,
    rgba(255,255,255,0.15) 20%,
    rgba(255,255,255,0) 40%,
    rgba(255,255,255,0) 60%,
    rgba(255,255,255,0.15) 80%,
    rgba(255,255,255,0.45) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
}

.liquid-glass-strong {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
  box-shadow: 4px 4px 4px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.15);
  position: relative;
  overflow: hidden;
}
.liquid-glass-strong::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg,
    rgba(255,255,255,0.5) 0%,
    rgba(255,255,255,0.2) 20%,
    rgba(255,255,255,0) 40%,
    rgba(255,255,255,0) 60%,
    rgba(255,255,255,0.2) 80%,
    rgba(255,255,255,0.5) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
}
`;

/* ============================================================
   ICONS — exact SVG paths from the spec
   ============================================================ */
const ArrowUpRight = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M7 17L17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

const Play = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <polygon points="6 4 20 12 6 20 6 4" />
  </svg>
);

const ClockIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const GlobeIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c-2.5 3-3.5 6-3.5 9s1 6 3.5 9" />
    <path d="M12 3c2.5 3 3.5 6 3.5 9s-1 6-3.5 9" />
  </svg>
);

const ImageIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
  </svg>
);

const MovieIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
  </svg>
);

const LightbulbIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
  </svg>
);

/* ============================================================
   SHARED MOTION PRESET
   ============================================================ */
const fadeUp = (delay = 0) => ({
  initial: { filter: "blur(10px)", opacity: 0, y: 20 },
  animate: { filter: "blur(0px)", opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: "easeOut" },
});

/* ============================================================
   FadingVideo
   ============================================================ */
function FadingVideo({ src, className = "", style }) {
  const ref = useRef(null);
  const [index, setIndex] = useState(0);
  const sources = Array.isArray(src) ? src : [src];

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    let raf = null;

    const fade = (from, to, dur) => {
      let start = null;
      cancelAnimationFrame(raf);
      const step = (t) => {
        if (start === null) start = t;
        const p = Math.min((t - start) / dur, 1);
        v.style.opacity = String(from + (to - from) * p);
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const onLoaded = () => fade(0, 1, 500);

    const onTimeUpdate = () => {
      if (!v.duration) return;
      const remaining = v.duration - v.currentTime;
      if (remaining <= 0.55 && !v.dataset.fo) {
        v.dataset.fo = "1";
        fade(1, 0, 550);
      }
    };

    const onEnded = () => {
      delete v.dataset.fo;
      if (sources.length === 1) {
        v.currentTime = 0;
        v.play().catch(() => {});
        fade(0, 1, 500);
      } else {
        setIndex((i) => (i + 1) % sources.length);
      }
    };

    v.addEventListener("loadeddata", onLoaded);
    v.addEventListener("timeupdate", onTimeUpdate);
    v.addEventListener("ended", onEnded);

    return () => {
      v.removeEventListener("loadeddata", onLoaded);
      v.removeEventListener("timeupdate", onTimeUpdate);
      v.removeEventListener("ended", onEnded);
      cancelAnimationFrame(raf);
    };
  }, [sources.length]);

  return (
    <video
      ref={ref}
      src={sources[index]}
      className={className}
      style={{ opacity: 0, ...style }}
      autoPlay
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  );
}

/* ============================================================
   BlurText — word-by-word staggered blur-in on intersection
   ============================================================ */
function BlurText({ text, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const words = text.split(" ");

  return (
    <div
      ref={ref}
      className={className}
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        rowGap: "0.1em",
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", marginRight: "0.28em" }}
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={inView ? { filter: "blur(0px)", opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

/* ============================================================
   NAVBAR
   ============================================================ */
function Navbar() {
  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-8 lg:px-16">
      <div className="flex items-center justify-between">
        {/* Left — liquid-glass circle with italic "a" */}
        <a
          href="#"
          aria-label="Home"
          className="liquid-glass flex h-12 w-12 items-center justify-center rounded-full"
        >
          <span className="font-heading text-2xl text-white">a</span>
        </a>

        {/* Center — glass pill (hidden on mobile) */}
        <div className="hidden md:flex liquid-glass rounded-full px-1.5 py-1.5 items-center">
          {NAV_LINKS.map((label) => (
            <a
              key={label}
              href="#"
              className="font-body px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              {label}
            </a>
          ))}
          <a
            href="#"
            className="ml-1.5 flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            Start a Project
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Right — spacer */}
        <div className="h-12 w-12" aria-hidden="true" />
      </div>
    </header>
  );
}

/* ============================================================
   SECTION 1 — HERO
   ============================================================ */
function Hero() {
  return (
    <section className="relative h-screen overflow-hidden bg-black">
      <FadingVideo
        src={HERO_VIDEO}
        className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0"
        style={{ width: "120%", height: "120%" }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <Navbar />

        <main className="flex-1 flex flex-col items-center justify-center pt-24 px-4 text-center">
          {/* Badge */}
          <motion.div
            {...fadeUp(0.4)}
            className="liquid-glass rounded-full inline-flex items-center gap-2 pl-1.5 pr-4 py-1.5"
          >
            <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold text-black">
              New
            </span>
            <span className="text-xs text-white/85 font-body">
              Booking Q3 2026 engagements — limited capacity
            </span>
          </motion.div>

          {/* Headline */}
          <div className="mt-6 max-w-3xl">
            <BlurText
              text="Crafted Digital Experiences Built to Outlast Trends"
              className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.8] tracking-[-4px]"
            />
          </div>

          {/* Subtext */}
          <motion.p
            {...fadeUp(0.8)}
            className="mt-4 max-w-2xl text-sm md:text-base text-white font-body font-light leading-tight"
          >
            We are a small studio of designers and engineers shaping
            brand-defining websites for ambitious companies. Precise typography,
            cinematic motion, and code you can be proud of.
          </motion.p>

          {/* CTA buttons */}
          <motion.div {...fadeUp(1.1)} className="mt-6 flex items-center gap-6">
            <a
              href="#"
              className="liquid-glass-strong rounded-full px-5 py-2.5 inline-flex items-center gap-2 text-sm font-medium text-white"
            >
              Start a Project
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              Watch Showreel
            </a>
          </motion.div>

          {/* Stats cards */}
          <motion.div {...fadeUp(1.3)} className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="liquid-glass p-5 w-[220px] rounded-[1.25rem] text-left">
              <ClockIcon className="w-5 h-5 text-white/85" />
              <p className="text-4xl font-heading italic tracking-[-1px] leading-none mt-4">
                6 Weeks
              </p>
              <p className="mt-2 text-xs text-white/70 font-body font-light leading-snug">
                Average End-to-End Launch Time
              </p>
            </div>
            <div className="liquid-glass p-5 w-[220px] rounded-[1.25rem] text-left">
              <GlobeIcon className="w-5 h-5 text-white/85" />
              <p className="text-4xl font-heading italic tracking-[-1px] leading-none mt-4">
                140+
              </p>
              <p className="mt-2 text-xs text-white/70 font-body font-light leading-snug">
                Brands Shipped Across Four Continents
              </p>
            </div>
          </motion.div>

          {/* Trust bar */}
          <motion.div {...fadeUp(1.4)} className="mt-10 flex flex-col items-center gap-4 pb-8">
            <div className="liquid-glass rounded-full px-5 py-2">
              <span className="text-[11px] text-white/80 font-body">
                Trusted by founders, operators, and creative directors worldwide
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
              {TRUST.map((name) => (
                <span
                  key={name}
                  className="font-heading italic text-2xl md:text-3xl tracking-tight text-white/85"
                >
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 2 — CAPABILITIES
   ============================================================ */
const CAPS = [
  {
    Icon: ImageIcon,
    title: "Design",
    tags: ["Brand Systems", "Art Direction", "Visual Identity", "Motion"],
    body:
      "We shape identities and interfaces that feel unmistakably yours — typographic systems, component libraries, and art-directed pages that scale without losing soul.",
  },
  {
    Icon: MovieIcon,
    title: "Engineering",
    tags: ["React", "Next.js", "Headless CMS", "Edge-Ready"],
    body:
      "Production-grade front-ends built on modern stacks. Performant, accessible, and instrumented — with code your team will enjoy extending long after launch.",
  },
  {
    Icon: LightbulbIcon,
    title: "Growth",
    tags: ["SEO", "Analytics", "A/B Testing", "Retention"],
    body:
      "Launch is the starting line. We partner with your team on conversion, content, and iteration loops that turn a beautiful site into a compounding asset.",
  },
];

function CapabilityCard({ Icon, title, tags, body }) {
  return (
    <div className="liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col">
      <div className="flex items-start justify-between gap-4">
        <div className="liquid-glass h-11 w-11 rounded-[0.75rem] flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-white/85" />
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1" />

      <div>
        <h3 className="font-heading italic text-3xl md:text-4xl tracking-[-1px] leading-none">
          {title}
        </h3>
        <p className="mt-3 text-sm text-white/90 font-body font-light leading-snug max-w-[32ch]">
          {body}
        </p>
      </div>
    </div>
  );
}

function Capabilities() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      <FadingVideo
        src={CAPS_VIDEO}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="relative z-10 px-8 md:px-16 lg:px-20 pt-24 pb-10 flex flex-col min-h-screen">
        <div className="mb-auto">
          <p className="text-sm font-body text-white/80 mb-6">// Capabilities</p>
          <h2 className="font-heading italic text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-[-3px]">
            Studio craft,
            <br />
            end to end
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {CAPS.map((c) => (
            <CapabilityCard key={c.title} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   DEFAULT EXPORT
   ============================================================ */
export default function LandingPage() {
  return (
    <>
      <style>{GLASS_CSS}</style>
      <Hero />
      <Capabilities />
    </>
  );
}