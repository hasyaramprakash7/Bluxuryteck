// Portfolio.jsx — Gallery showcase for all project components
// Requires: react, tailwind, lucide-react
// The 8 project components must exist in this same folder.

import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

/* --- lazy-load every project (heavy ones like rk2/rk4 pull three.js) --- */
const Main      = lazy(() => import('./main1'));
const Ecomers   = lazy(() => import('./ecomers1'));
const EcomWomen = lazy(() => import('./ecomwomen'));
const RK1       = lazy(() => import('./rk1'));
const RK2       = lazy(() => import('./rk2'));
const RK3       = lazy(() => import('./rk3'));
const RK4       = lazy(() => import('./rk4'));
const RK5       = lazy(() => import('./rk5'));

/* ------------------------------------------------------------------ */
/*  PROJECT DATA                                                       */
/* ------------------------------------------------------------------ */
const PROJECTS = [
  {
    id: 'main', num: '01',
    title: 'B LUXURY TECH', subtitle: 'Autonomous AI Agents',
    category: 'AI · SaaS Platform',
    description:
      'Marketing site for enterprise AI agent networks — live terminal, ROI calculator and multi-agent architecture simulator.',
    tags: ['React', 'Tailwind', 'Lucide'],
    accent: '#00FF88',
    kind: 'bluxury',
    Component: Main,
  },
  {
    id: 'ecomers', num: '02',
    title: 'RUNWAY', subtitle: 'Try the Look',
    category: 'E-commerce · Fashion',
    description:
      'Editorial fashion runway with 3D carousel, hot-spot pins, size picker and a complete-the-look bundle checkout.',
    tags: ['React', 'E-commerce'],
    accent: '#0B6E3C',
    kind: 'runway',
    Component: Ecomers,
  },
  {
    id: 'ecomwomen', num: '03',
    title: 'MAISON VELL', subtitle: 'Spring Summer 2027',
    category: 'Luxury · Fashion',
    description:
      'Sprite-sheet driven luxury runway with depth-based model transitions and a rolling "Look" counter.',
    tags: ['React', 'Sprite'],
    accent: '#16191f',
    kind: 'maison',
    Component: EcomWomen,
  },
  {
    id: 'rk1', num: '04',
    title: 'ATELIER', subtitle: 'Design · Build · Handover',
    category: 'Architecture · Construction',
    description:
      'Three-stage hero with crossfade backdrops and a drag-to-reveal before/after slider showing bare land turning into a finished home.',
    tags: ['React', 'Framer'],
    accent: '#D4AF37',
    kind: 'atelier',
    Component: RK1,
  },
  {
    id: 'rk2', num: '05',
    title: 'ASCENTA', subtitle: '3D Cinematic Studio',
    category: 'Architecture · 3D',
    description:
      'Scroll-driven react-three-fiber villa that assembles stage by stage, with night toggle, blueprint wireframe and auto-tour.',
    tags: ['R3F', 'Three.js'],
    accent: '#FCD34D',
    kind: 'ascenta',
    Component: RK2,
  },
  {
    id: 'rk3', num: '06',
    title: 'VELL ESTATES', subtitle: 'Featured Estates 2026',
    category: 'Real Estate · Editorial',
    description:
      'Photo-depth carousel of luxury properties with an amenities rail and a rolling estate counter.',
    tags: ['React'],
    accent: '#2a3a4a',
    kind: 'vell',
    Component: RK3,
  },
  {
    id: 'rk4', num: '07',
    title: 'MELLI MOTION', subtitle: '3D Animation Academy',
    category: 'Education · 3D',
    description:
      'Three.js mech character with parallax petals and scroll-triggered reveals across five themed sections.',
    tags: ['Three.js', 'React'],
    accent: '#5b3bd1',
    kind: 'melli',
    Component: RK4,
  },
  {
    id: 'rk5', num: '08',
    title: 'HIGO', subtitle: 'Eau de Parfum 2026',
    category: 'Beauty · E-commerce',
    description:
      'Parallax fig-fruit hero, sensory note selector, size picker and add-to-bag flow for a small-batch fragrance.',
    tags: ['Framer Motion', 'React'],
    accent: '#D4AF37',
    kind: 'higo',
    Component: RK5,
  },
  {
    id: 'bluxury-html', num: '09',
    title: 'B LUXURY · HTML', subtitle: 'Standalone Version',
    category: 'Vanilla · Three.js',
    description:
      'Zero-dependency Three.js landing with theme toggle, tilt cards, starfield and a 3D torus knot that follows scroll.',
    tags: ['HTML', 'Three.js'],
    accent: '#16A35A',
    kind: 'bluxury-html',
    external: '/bluxury-html.html',
  },
];

/* ------------------------------------------------------------------ */
/*  MINI PREVIEWS — pure SVG/CSS, no heavy assets                      */
/* ------------------------------------------------------------------ */

function BluxuryPreview({ accent }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: 'radial-gradient(circle at 30% 20%, #0a1a14 0%, #050811 70%)' }}
    >
      {/* grid */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,228,255,.9) 1px, transparent 1px), linear-gradient(90deg, rgba(34,228,255,.9) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'linear-gradient(to bottom, black, transparent)',
        }}
      />
      {/* terminal window */}
      <div className="absolute left-[8%] top-[18%] w-[64%] rounded-lg border border-white/10 bg-black/70 p-3 shadow-2xl backdrop-blur">
        <div className="mb-2 flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-400/80" />
          <span className="h-2 w-2 rounded-full bg-yellow-400/80" />
          <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
        </div>
        <div className="space-y-1 font-mono text-[7px] leading-tight">
          <div style={{ color: '#22E4FF' }}>[Scout] New enquiry detected<span style={{ color: '#e2e8f0' }}>...</span></div>
          <div style={{ color: '#22E4FF' }}>[Parser] Extracted: budget<span style={{ color: '#e2e8f0' }}>...</span></div>
          <div style={{ color: '#22E4FF' }}>[Builder] Drafting proposal<span style={{ color: '#e2e8f0' }}>...</span></div>
          <div className="flex items-center gap-1" style={{ color: accent }}>
            [Orchestrator]
            <span className="inline-block h-2 w-1 animate-pulse" style={{ background: accent }} />
          </div>
        </div>
      </div>
      {/* glow */}
      <div
        className="absolute -right-10 bottom-0 h-32 w-32 rounded-full opacity-40 blur-3xl"
        style={{ background: accent }}
      />
      {/* accent chip */}
      <div
        className="absolute right-3 top-3 rounded-full border px-2 py-0.5 text-[7px] font-mono tracking-wider"
        style={{ borderColor: `${accent}66`, color: accent, background: `${accent}15` }}
      >
        MULTI-AGENT ACTIVE
      </div>
    </div>
  );
}

function RunwayPreview({ accent }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#faf8f5' }}>
      {/* figure silhouette */}
      <svg
        className="absolute left-1/2 top-1/2 h-[88%] -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 200 320"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="rw-fig" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8e2d9" />
            <stop offset="100%" stopColor="#d4c9ba" />
          </linearGradient>
        </defs>
        <ellipse cx="100" cy="315" rx="55" ry="4" fill="#000" opacity="0.15" />
        <path
          d="M100 22 C80 22 70 40 70 60 C70 78 78 92 90 98 L90 130 L70 140 L60 200 L72 300 L92 300 L96 210 L104 210 L108 300 L128 300 L140 200 L130 140 L110 130 L110 98 C122 92 130 78 130 60 C130 40 120 22 100 22 Z"
          fill="url(#rw-fig)"
        />
      </svg>
      {/* pins */}
      {[
        { n: 1, l: 48, t: 26 },
        { n: 2, l: 47, t: 58 },
        { n: 3, l: 46, t: 88 },
      ].map((p) => (
        <div
          key={p.n}
          className="absolute grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[8px] font-semibold shadow-md"
          style={{ left: `${p.l}%`, top: `${p.t}%` }}
        >
          {p.n}
        </div>
      ))}
      {/* side product cards */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-9 w-9 rounded border border-[#c8c8c8] bg-[#ece7df]"
            style={{ boxShadow: '0 2px 6px -2px rgba(0,0,0,.2)' }}
          />
        ))}
      </div>
      {/* label */}
      <div
        className="absolute left-3 top-3 rounded-full px-2 py-0.5 text-[7px] font-medium tracking-[0.2em] text-white"
        style={{ background: accent }}
      >
        RUNWAY
      </div>
    </div>
  );
}

function MaisonPreview({ accent }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0) 55%, rgba(255,255,255,.7) 100%), linear-gradient(90deg, #f1f5fa 0%, #e7eff6 40%, #eef4f9 65%, #f6f9fc 100%)',
      }}
    >
      {/* runway models at different depths */}
      {[0, 1, 2].map((i) => (
        <svg
          key={i}
          className="absolute bottom-0"
          viewBox="0 0 80 180"
          style={{
            left: `${20 + i * 26}%`,
            height: `${72 - i * 14}%`,
            opacity: 1 - i * 0.28,
            filter: i > 0 ? `blur(${i * 0.6}px)` : 'none',
          }}
        >
          <path
            d="M40 10 C32 10 28 18 28 26 C28 34 32 40 38 43 L38 55 L32 58 L28 90 L34 160 L38 160 L40 100 L44 160 L48 160 L54 90 L50 58 L44 55 L44 43 C50 40 54 34 54 26 C54 18 48 10 40 10 Z"
            fill="#c9d2dc"
          />
        </svg>
      ))}
      {/* rolling look number */}
      <div className="absolute bottom-3 left-4 font-bold tracking-[0.15em] text-[#16191f]">
        <div className="text-[7px] font-normal opacity-60">LOOK</div>
        <div className="text-[22px] leading-none">15</div>
      </div>
      {/* label */}
      <div className="absolute right-3 top-3 text-[7px] font-semibold tracking-[0.22em] text-[#16191f]">
        MAISON VELL
      </div>
    </div>
  );
}

function AtelierPreview() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#08080a]">
      {/* dark hero bg */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,.85) 0%, rgba(0,0,0,.35) 60%, rgba(0,0,0,.95) 100%), radial-gradient(ellipse at 30% 70%, #2a1f0f 0%, #08080a 65%)',
        }}
      />
      {/* horizon line / building hint */}
      <svg className="absolute inset-x-0 bottom-[18%] w-full" viewBox="0 0 300 60" preserveAspectRatio="none">
        <path d="M0 55 L40 55 L40 45 L80 45 L80 50 L140 50 L140 35 L200 35 L200 48 L260 48 L260 40 L300 40 L300 60 L0 60 Z" fill="#1a1a1a" />
        <rect x="140" y="20" width="3" height="30" fill="#D4AF37" opacity="0.6" />
      </svg>
      {/* eyebrow pill */}
      <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 backdrop-blur">
        <span className="h-1 w-1 rounded-full bg-amber-300" />
        <span className="text-[6px] uppercase tracking-[0.2em] text-white/85">Stage 01 — Bare Land</span>
      </div>
      {/* title lines */}
      <div className="absolute bottom-3 left-3 right-3">
        <div className="text-[10px] font-light leading-tight text-white">
          We design and build <span className="italic text-amber-200">your house</span>
        </div>
        <div className="mt-1 h-[2px] w-full overflow-hidden rounded bg-white/15">
          <div className="h-full w-1/3 bg-gradient-to-r from-amber-200 to-amber-400" />
        </div>
      </div>
      {/* vertical accent bar */}
      <div className="absolute right-3 top-3 text-[6px] uppercase tracking-[0.2em] text-white/40">ATELIER</div>
    </div>
  );
}

function AscentaPreview() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#05070b]">
      {/* radial ambience */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 80%, #1a2a3a 0%, #05070b 70%)' }}
      />
      {/* wireframe villa */}
      <svg
        className="absolute left-1/2 top-1/2 h-[80%] -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 300 200"
        fill="none"
        stroke="#FCD34D"
        strokeWidth="0.8"
        opacity="0.85"
      >
        {/* foundation */}
        <line x1="40" y1="165" x2="260" y2="165" strokeOpacity="0.5" />
        {/* columns */}
        {[40, 80, 140, 200, 260].map((x, i) => (
          <line key={i} x1={x} y1="165" x2={x} y2="90" strokeOpacity="0.7" />
        ))}
        {/* level 1 slab */}
        <line x1="40" y1="90" x2="260" y2="90" />
        {/* upper columns */}
        {[70, 130, 200, 230].map((x, i) => (
          <line key={`u${i}`} x1={x} y1="90" x2={x} y2="45" strokeOpacity="0.6" />
        ))}
        {/* roof */}
        <line x1="40" y1="45" x2="260" y2="45" />
        {/* cantilever overhang */}
        <line x1="40" y1="45" x2="30" y2="38" strokeOpacity="0.35" />
        <line x1="260" y1="45" x2="270" y2="38" strokeOpacity="0.35" />
        {/* depth diagonals */}
        <line x1="40" y1="165" x2="70" y2="155" strokeOpacity="0.25" />
        <line x1="260" y1="165" x2="230" y2="155" strokeOpacity="0.25" />
        <line x1="40" y1="90" x2="70" y2="80" strokeOpacity="0.25" />
        <line x1="260" y1="90" x2="230" y2="80" strokeOpacity="0.25" />
        {/* pool */}
        <ellipse cx="230" cy="172" rx="35" ry="4" fill="#1c6c8c" strokeOpacity="0" opacity="0.5" />
      </svg>
      {/* stage pill */}
      <div className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full border border-white/10 bg-black/60 px-2 py-0.5 backdrop-blur">
        <span className="text-[6px] uppercase tracking-[0.18em] text-white/70">02 · Structure</span>
      </div>
      {/* controls */}
      <div className="absolute right-2 bottom-2 flex flex-col gap-1">
        <span className="h-5 w-5 rounded-full border border-amber-300/50 bg-amber-300/15" />
        <span className="h-5 w-5 rounded-full border border-white/10 bg-black/50" />
      </div>
      <div className="absolute bottom-2 left-3 text-[6px] uppercase tracking-[0.3em] text-white/35">ASCENTA</div>
    </div>
  );
}

function VellPreview() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          'linear-gradient(transparent 60%, rgba(255,255,255,.72) 100%), linear-gradient(90deg, #f1f5fa 0%, #e7eff6 38%, #eef4f9 62%, #f6f9fc 100%)',
      }}
    >
      {/* property cards */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute overflow-hidden rounded shadow-lg"
          style={{
            left: `${18 + i * 22}%`,
            bottom: `${i * 4}%`,
            width: `${34 - i * 5}%`,
            height: `${68 - i * 12}%`,
            opacity: 1 - i * 0.25,
            filter: i > 0 ? `blur(${i * 0.8}px)` : 'none',
            transform: `perspective(400px) rotateY(${(i - 1) * 6}deg)`,
          }}
        >
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(180deg, #b8c8d8 0%, #6a7d90 50%, #3a4a5a 100%)`,
            }}
          />
        </div>
      ))}
      {/* estate label */}
      <div className="absolute bottom-3 left-4 text-[#16191f]">
        <div className="text-[7px] font-normal uppercase tracking-[0.14em] opacity-60">Estate</div>
        <div className="text-[20px] font-bold leading-none tracking-[0.12em]">01</div>
      </div>
      <div className="absolute right-3 top-3 text-[6px] font-semibold uppercase tracking-[0.2em] text-[#16191f]">
        VELL ESTATES
      </div>
    </div>
  );
}

function MelliPreview() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #e4e0fa 0%, #ece9fc 100%)' }}
    >
      {/* star */}
      <svg
        className="absolute right-4 top-4 h-10 w-10 text-[#0d0b1a]"
        viewBox="0 0 40 40"
        fill="currentColor"
      >
        <path d="M20 0c1.2 11.5 8.5 18.8 20 20-11.5 1.2-18.8 8.5-20 20-1.2-11.5-8.5-18.8-20-20C11.5 18.8 18.8 11.5 20 0z" />
      </svg>
      {/* mech silhouette */}
      <svg
        className="absolute bottom-3 left-1/2 h-[64%] -translate-x-1/2"
        viewBox="0 0 100 160"
      >
        <rect x="42" y="14" width="16" height="20" rx="3" fill="#0d0b1a" />
        <rect x="44" y="18" width="12" height="4" rx="1" fill="#00ffff" />
        <rect x="36" y="36" width="28" height="34" rx="2" fill="#0d0b1a" />
        <circle cx="50" cy="53" r="4" fill="#00ffff" />
        <rect x="22" y="38" width="12" height="22" rx="2" fill="#0d0b1a" />
        <rect x="66" y="38" width="12" height="22" rx="2" fill="#0d0b1a" />
        <rect x="38" y="72" width="10" height="40" rx="2" fill="#0d0b1a" />
        <rect x="52" y="72" width="10" height="40" rx="2" fill="#0d0b1a" />
        <rect x="36" y="112" width="14" height="6" rx="2" fill="#0d0b1a" />
        <rect x="52" y="112" width="14" height="6" rx="2" fill="#0d0b1a" />
      </svg>
      {/* number */}
      <div className="absolute bottom-2 left-3 text-[24px] font-bold leading-none tracking-tighter text-[#cfc6f6]">
        01
      </div>
      <div className="absolute left-3 top-3 text-[6px] font-semibold uppercase tracking-[0.25em] text-[#0d0b1a]">
        MELLI
      </div>
    </div>
  );
}

function HigoPreview() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, #3A1A4F 0%, #1A0B2E 60%, #0E0518 100%)' }}
    >
      {/* bottle */}
      <svg
        className="absolute left-1/2 top-1/2 h-[70%] -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 200 470"
      >
        <defs>
          <linearGradient id="pv-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7A5C1C" />
            <stop offset="0.5" stopColor="#F6E9B0" />
            <stop offset="1" stopColor="#6E5018" />
          </linearGradient>
          <linearGradient id="pv-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8355A0" />
            <stop offset="0.6" stopColor="#5D2E75" />
            <stop offset="1" stopColor="#160925" />
          </linearGradient>
        </defs>
        <rect x="70" y="24" width="60" height="84" rx="9" fill="url(#pv-gold)" />
        <rect x="61" y="104" width="78" height="13" rx="6.5" fill="url(#pv-gold)" />
        <rect x="84" y="114" width="32" height="44" fill="url(#pv-glass)" />
        <path
          d="M86 152 C60 158 32 171 32 197 L32 414 C32 436 47 450 69 450 L131 450 C153 450 168 436 168 414 L168 197 C168 171 140 158 114 152 Z"
          fill="url(#pv-glass)"
        />
        <rect x="55" y="272" width="90" height="98" fill="#F8F6F2" opacity="0.95" />
        <text x="100" y="320" textAnchor="middle" fontSize="22" letterSpacing="5" fill="#1A0B2E" fontFamily="serif">
          HIGO
        </text>
        <line x1="73" y1="332" x2="127" y2="332" stroke="#C5A059" strokeWidth="0.8" />
      </svg>
      {/* gold dots */}
      {[
        { l: '20%', t: '22%' },
        { l: '78%', t: '52%' },
        { l: '30%', t: '78%' },
      ].map((p, i) => (
        <span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_2px_rgba(212,175,55,0.6)]"
          style={{ left: p.l, top: p.t }}
        />
      ))}
      <div className="absolute left-3 top-3 text-[7px] uppercase tracking-[0.35em] text-[#D4AF37]/85">HIGO</div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[6px] uppercase tracking-[0.3em] text-[#F8F6F2]/50">
        Eau de Parfum · 2026
      </div>
    </div>
  );
}

function BluxuryHtmlPreview({ accent }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: 'radial-gradient(circle at 30% 30%, #0a1a14 0%, #050811 70%)' }}
    >
      {/* starfield */}
      {Array.from({ length: 24 }).map((_, i) => {
        const s = ((i * 37) % 100) + '%';
        const t = ((i * 61) % 90) + '%';
        return (
          <span
            key={i}
            className="absolute h-0.5 w-0.5 rounded-full"
            style={{ left: s, top: t, background: accent, opacity: 0.6 }}
          />
        );
      })}
      {/* torus knot hint */}
      <svg
        className="absolute left-1/2 top-1/2 h-[70%] -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 200 200"
        fill="none"
        stroke={accent}
        strokeWidth="0.8"
        opacity="0.85"
      >
        <ellipse cx="100" cy="100" rx="70" ry="30" transform="rotate(30 100 100)" />
        <ellipse cx="100" cy="100" rx="70" ry="30" transform="rotate(90 100 100)" />
        <ellipse cx="100" cy="100" rx="70" ry="30" transform="rotate(150 100 100)" />
        <circle cx="100" cy="100" r="16" fill={accent} opacity="0.5" />
      </svg>
      <div className="absolute left-3 top-3 text-[7px] font-bold tracking-[0.14em] text-white">
        B LUXURY <span style={{ color: accent }}>TECH</span>
      </div>
      <div className="absolute bottom-2 left-3 text-[6px] uppercase tracking-[0.2em] text-white/40">
        Vanilla · Three.js
      </div>
    </div>
  );
}

function Preview({ project }) {
  const Cmp = {
    bluxury: BluxuryPreview,
    runway: RunwayPreview,
    maison: MaisonPreview,
    atelier: AtelierPreview,
    ascenta: AscentaPreview,
    vell: VellPreview,
    melli: MelliPreview,
    higo: HigoPreview,
    'bluxury-html': BluxuryHtmlPreview,
  }[project.kind];
  return Cmp ? <Cmp accent={project.accent} /> : null;
}

/* ------------------------------------------------------------------ */
/*  CARD                                                               */
/* ------------------------------------------------------------------ */
function ProjectCard({ project, onOpen, index }) {
  return (
    <button
      onClick={() => onOpen(project.id)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e12] text-left transition-all duration-500 hover:-translate-y-1 hover:border-white/25"
      style={{
        boxShadow: '0 20px 60px -30px rgba(0,0,0,.9)',
        animation: `pf-fade .9s cubic-bezier(.16,1,.3,1) ${index * 60}ms backwards`,
      }}
      aria-label={`Open ${project.title}`}
    >
      {/* preview */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Preview project={project} />
        {/* hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e12] via-transparent to-transparent opacity-60" />
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${project.accent}15, transparent 60%)`,
          }}
        />
        {/* number */}
        <span className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.2em] text-white/40">
          {project.num}
        </span>
        {/* open arrow */}
        <span
          className="absolute right-4 top-4 grid h-9 w-9 -translate-y-1 place-items-center rounded-full border opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
          style={{
            borderColor: `${project.accent}66`,
            background: `${project.accent}22`,
            color: project.accent,
            backdropFilter: 'blur(8px)',
          }}
        >
          <ArrowUpRight size={16} />
        </span>
      </div>

      {/* content */}
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div
              className="text-[10px] font-medium uppercase tracking-[0.24em]"
              style={{ color: project.accent }}
            >
              {project.category}
            </div>
            <h3 className="mt-1.5 text-lg font-semibold leading-tight text-white">
              {project.title}
            </h3>
            <p className="mt-0.5 text-xs text-white/50">{project.subtitle}</p>
          </div>
        </div>
        <p className="line-clamp-2 text-xs leading-relaxed text-white/55">
          {project.description}
        </p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/55"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  COMPONENT VIEWER                                                   */
/* ------------------------------------------------------------------ */
function ProjectViewer({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const Cmp = project.Component;

  return (
    <>
      {project.external ? (
        <iframe
          title={project.title}
          src={project.external}
          className="fixed inset-0 h-full w-full border-0 bg-white"
        />
      ) : (
        <Suspense
          fallback={
            <div className="fixed inset-0 grid place-items-center bg-[#0a0a0f]">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="h-10 w-10 animate-spin rounded-full border-2 border-t-transparent"
                  style={{ borderColor: `${project.accent}33`, borderTopColor: project.accent }}
                />
                <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Loading {project.title}
                </span>
              </div>
            </div>
          }
        >
          <Cmp />
        </Suspense>
      )}

      {/* floating back pill */}
      <button
        onClick={onClose}
        className="fixed bottom-5 left-5 z-[2147483647] flex items-center gap-2 rounded-full border border-white/25 bg-black/85 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-black"
        style={{ boxShadow: `0 12px 40px -10px ${project.accent}55` }}
      >
        <ArrowLeft size={14} />
        Portfolio
      </button>

      {/* project label */}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[2147483647] hidden sm:block">
        <div className="rounded-full border border-white/15 bg-black/70 px-4 py-2 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: project.accent }} />
            <span className="text-[10px] font-mono tracking-[0.2em] text-white/70">
              {project.num} · {project.title}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PORTFOLIO                                                     */
/* ------------------------------------------------------------------ */
export default function Portfolio() {
  const [activeId, setActiveId] = useState(null);
  const savedScroll = useRef(0);

  const open = (id) => {
    savedScroll.current = window.scrollY;
    setActiveId(id);
  };

  const close = () => {
    setActiveId(null);
  };

  // restore scroll after closing a component
  useEffect(() => {
    if (activeId === null && savedScroll.current > 0) {
      const y = savedScroll.current;
      savedScroll.current = 0;
      requestAnimationFrame(() => window.scrollTo(0, y));
    }
  }, [activeId]);

  if (activeId) {
    const project = PROJECTS.find((p) => p.id === activeId);
    if (project) return <ProjectViewer project={project} onClose={close} />;
  }

  return (
    <div className="min-h-screen bg-[#08080a] font-sans text-white antialiased">
      <style>{`
        @keyframes pf-fade {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pf-hero-in {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pf-line { animation: pf-hero-in 1.1s cubic-bezier(.2,.8,.15,1) both; }
        .pf-line.d1 { animation-delay: .12s; }
        .pf-line.d2 { animation-delay: .24s; }
        .pf-line.d3 { animation-delay: .36s; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>

      {/* ambient grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at 50% 30%, black, transparent 80%)',
        }}
      />
      {/* glow */}
      <div className="pointer-events-none fixed -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[140px]" />

      {/* hero */}
      <header className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 sm:pt-32">
        <div className="pf-line flex items-center gap-3">
          <span className="h-px w-10 bg-white/30" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/50">
            Portfolio · {new Date().getFullYear()}
          </span>
        </div>
        <h1 className="pf-line d1 mt-6 max-w-4xl text-[clamp(40px,8vw,110px)] font-semibold leading-[0.95] tracking-[-0.03em]">
          Eight projects,<br />
          <span className="bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
            one studio.
          </span>
        </h1>
        <p className="pf-line d2 mt-6 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
          A curated collection of landing pages, e-commerce experiences and 3D
          interfaces. Click any card to open the live component.
        </p>
        <div className="pf-line d3 mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.25em] text-white/40">
          <span>{PROJECTS.length} projects</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>React · Three.js · Framer</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>2025 – 2026</span>
        </div>
      </header>

      {/* gallery */}
      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-32 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} onOpen={open} index={i} />
          ))}
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/10 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 text-[10px] uppercase tracking-[0.25em] text-white/35 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} — Curated Work</span>
          <span>Built with React · Tailwind · Three.js</span>
        </div>
      </footer>
    </div>
  );
}