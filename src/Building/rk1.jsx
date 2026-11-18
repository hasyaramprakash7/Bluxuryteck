"use client";

// Zapline trading CTA hero — "Royal Violet"
// Single-file React + Tailwind component. Requires tailwindcss, react.
// Design stage: 1672×941 design px, scaled by --s = min(vw/1672, vh/941).

import { useEffect, useRef, useState } from "react";

/* ============================================================
   ASSETS
   ============================================================ */
const GLOW_VIDEO =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/e859f229-8ebd-43fb-a5a0-58006ba75327.mp4";
const DASH_GLOW =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/e0e14572-12e1-4c08-b471-a21521844945.png";

/* ============================================================
   Non-Tailwind CSS: keyframes, stage scale, media queries,
   pseudo-element glow. Everything else uses Tailwind.
   ============================================================ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@700&display=swap');

:root { --s: 0.86; }

.zapline-root {
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.zapline-display {
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-weight: 700;
  letter-spacing: -0.03em;
}

/* ---------- stage ---------- */
.zapline-stage {
  position: absolute;
  left: 50%;
  top: calc((100dvh - 941px * var(--s)) / 2);
  width: 1672px;
  height: 941px;
  margin-left: -836px;
  transform-origin: center top;
  transform: scale(var(--s));
}

/* ---------- dash top glow line ---------- */
.zapline-dash::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(168,85,247,0.35) 12%,
    rgba(216,180,254,1) 50%,
    rgba(168,85,247,0.35) 88%,
    transparent 100%);
  box-shadow: 0 0 14px 1px rgba(168,85,247,0.75);
  z-index: 3;
  pointer-events: none;
}

/* ---------- entrance keyframes ---------- */
@keyframes zfade-down  { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes zfade-up    { from { opacity: 0; transform: translateY(24px); }  to { opacity: 1; transform: translateY(0); } }
@keyframes zwipe-up    { from { opacity: 0; transform: translateY(110%); }  to { opacity: 1; transform: translateY(0); } }
@keyframes zrise       { from { opacity: 0; transform: translateY(80px); }  to { opacity: 1; transform: translateY(0); } }
@keyframes zscale-in   { from { opacity: 0; transform: scale(0.96); }       to { opacity: 1; transform: scale(1); } }

.z-anim-nav   { animation: zfade-down 0.8s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
.z-anim-wipe  { animation: zwipe-up   0.9s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
.z-anim-up    { animation: zfade-up   0.8s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
.z-anim-rise  { animation: zrise      1.1s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
.z-anim-scale { animation: zscale-in  0.9s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }

/* ---------- mobile / desktop switches ---------- */
.zapline-mobile-only  { display: none; }
@media (max-width: 899px), (orientation: portrait) {
  .zapline-desktop-only { display: none !important; }
  .zapline-mobile-only  { display: block; }
}

/* ---------- reduced motion ---------- */
@media (prefers-reduced-motion: reduce) {
  .z-anim-nav, .z-anim-wipe, .z-anim-up, .z-anim-rise, .z-anim-scale {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .zapline-glow-video { display: none !important; }
}

/* ---------- chart drop shadow ---------- */
.zapline-chart-line { filter: drop-shadow(0 0 4px rgba(147,18,255,0.9)); }

/* ---------- mobile scroll ---------- */
.zapline-mobile-scroll { overflow-y: auto; -webkit-overflow-scrolling: touch; }
.zapline-mobile-scroll::-webkit-scrollbar { width: 0; height: 0; }

/* ---------- button hover glow ---------- */
.zapline-btn-primary:hover {
  filter: brightness(1.1);
  box-shadow: 0 0 24px rgba(147,18,255,0.6), 0 0 64px rgba(147,18,255,0.3);
}
.zapline-btn-dark:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.28);
}
`;

/* ============================================================
   ICONS
   ============================================================ */
const BoltLogo = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="zbolt" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    <path d="M13 2 L4 14 L11 14 L10 22 L20 9 L13 9 Z" fill="url(#zbolt)" />
  </svg>
);

const Gear = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
  </svg>
);
const SearchIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
  </svg>
);
const DashboardIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1.6" />
    <rect x="14" y="3" width="7" height="7" rx="1.6" />
    <rect x="3" y="14" width="7" height="7" rx="1.6" />
    <rect x="14" y="14" width="7" height="7" rx="1.6" />
  </svg>
);
const TargetIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.8" fill="currentColor" />
  </svg>
);
const LogOutIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5" /><path d="M21 12H9" />
  </svg>
);
const WalletIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5" />
    <circle cx="16" cy="14" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);
const GiftIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="3" y="8" width="18" height="13" rx="2" />
    <path d="M3 12h18M12 8v13" />
    <path d="M7.5 8a2.5 2.5 0 1 1 0-5C9.5 3 12 8 12 8s2.5-5 4.5-5a2.5 2.5 0 1 1 0 5" />
  </svg>
);
const SettingsIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
  </svg>
);
const BellIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);
const ChevronRightIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

/* ============================================================
   NAV
   ============================================================ */
function Nav() {
  return (
    <nav
      className="zapline-desktop-only absolute top-[26px] left-[56px] right-[56px] z-30 flex items-center justify-between z-anim-nav"
      style={{ animationDelay: "0ms" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <BoltLogo className="h-7 w-7" />
        <span className="text-white text-[20px] font-semibold tracking-[-0.02em]">Zapline</span>
      </div>

      {/* Menu */}
      <div className="flex items-center gap-1 rounded-full bg-white/[0.03] border border-white/[0.06] p-1">
        {[
          { label: "Home", active: true },
          { label: "Features" },
          { label: "Zapline Advantage" },
          { label: "Referral" },
          { label: "FAQ" },
        ].map((it) => (
          <span
            key={it.label}
            className={
              it.active
                ? "px-4 py-1.5 rounded-full bg-white/[0.08] text-white text-[13px] font-medium cursor-default"
                : "px-4 py-1.5 rounded-full text-white/65 text-[13px] font-medium cursor-default hover:text-white transition-colors"
            }
          >
            {it.label}
          </span>
        ))}
      </div>

      {/* CTA */}
      <button
        type="button"
        className="zapline-btn-primary h-9 px-5 rounded-full bg-[linear-gradient(180deg,#a020ff_0%,#7a1cf8_100%)] text-white text-[13px] font-semibold transition-[filter,box-shadow] duration-300"
      >
        Get Started
      </button>
    </nav>
  );
}

/* ============================================================
   HERO COPY
   ============================================================ */
function HeroCopy() {
  return (
    <div className="zapline-desktop-only absolute left-0 right-0 top-[150px] z-20 flex flex-col items-center text-center px-10">
      <h1 className="zapline-display text-white text-[84px] leading-[1.02]">
        <span className="z-anim-wipe block" style={{ animationDelay: "120ms" }}>
          <span className="bg-clip-text text-transparent bg-[linear-gradient(120deg,#e9d5ff_0%,#a020ff_45%,#7a1cf8_100%)]">
            Zapline
          </span>{" "}
          Trade Smarter,
        </span>
        <span className="z-anim-wipe block" style={{ animationDelay: "240ms" }}>
          Faster, Safer.
        </span>
      </h1>

      <p
        className="z-anim-up mt-7 max-w-[760px] text-[#8b8988] text-[16px] leading-[26px] font-normal"
        style={{ animationDelay: "420ms" }}
      >
        The first fully integrated on-chain trading experience. No dashboards, no delays — Zapline empowers you
        to trade directly from your favorite DeFi apps and terminals.
      </p>

      <div
        className="z-anim-up mt-9 flex items-center gap-3"
        style={{ animationDelay: "560ms" }}
      >
        <button
          type="button"
          className="zapline-btn-primary h-11 px-7 rounded-full bg-[linear-gradient(180deg,#a020ff_0%,#7a1cf8_100%)] text-white text-[14px] font-semibold transition-[filter,box-shadow] duration-300"
        >
          Get Started
        </button>
        <button
          type="button"
          className="zapline-btn-dark h-11 px-7 rounded-full bg-white/[0.03] border border-white/[0.12] text-white text-[14px] font-semibold transition-[background,border-color] duration-300"
        >
          Learn More
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   CHART
   ============================================================ */
const CHART_PTS = [
  [0, 72], [30, 66], [60, 58], [90, 61], [120, 50], [150, 53], [180, 42], [210, 46],
  [240, 35], [270, 39], [300, 28], [330, 32], [360, 22], [390, 26], [420, 18],
  [450, 22], [480, 14], [510, 18], [540, 10], [570, 14], [600, 8],
];

function Chart() {
  const linePath = CHART_PTS.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const areaPath = `${linePath} L600,100 L0,100 Z`;
  return (
    <svg viewBox="0 0 600 100" preserveAspectRatio="none" className="w-full h-full">
      <defs>
        <linearGradient id="zchart" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9312ff" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#9312ff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#9312ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#zchart)" />
      <path
        d={linePath}
        stroke="#b56bff"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="zapline-chart-line"
      />
    </svg>
  );
}

/* ============================================================
   SIDEBAR
   ============================================================ */
function Sidebar() {
  const primary = [
    { label: "Search", Icon: SearchIcon },
    { label: "Dashboard", Icon: DashboardIcon, active: true },
    { label: "Snipes", Icon: TargetIcon },
    { label: "Disconnect", Icon: LogOutIcon },
  ];
  const secondary = [
    { label: "Wallets", Icon: WalletIcon },
    { label: "Referral", Icon: GiftIcon },
    { label: "Settings", Icon: SettingsIcon },
  ];

  return (
    <aside className="w-[240px] flex-none border-r border-white/[0.06] flex flex-col p-4 gap-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <BoltLogo className="h-5 w-5" />
          <span className="text-white text-[13px] font-semibold">Zapline</span>
        </div>
        <Gear className="h-4 w-4 text-white/50" />
      </div>

      {/* Primary */}
      <div className="flex flex-col gap-0.5">
        {primary.map(({ label, Icon, active }) => (
          <div
            key={label}
            className={
              active
                ? "flex items-center gap-2.5 h-8 px-2.5 rounded-md bg-[rgba(147,18,255,0.15)] border border-[rgba(147,18,255,0.25)] text-white text-[12px] font-medium"
                : "flex items-center gap-2.5 h-8 px-2.5 rounded-md text-white/60 text-[12px] font-medium hover:bg-white/[0.04] hover:text-white/90 transition-colors cursor-default"
            }
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="h-px bg-white/[0.06] my-1" />

      {/* Secondary */}
      <div className="flex flex-col gap-0.5">
        {secondary.map(({ label, Icon }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 h-8 px-2.5 rounded-md text-white/60 text-[12px] font-medium hover:bg-white/[0.04] hover:text-white/90 transition-colors cursor-default"
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Pro promo */}
      <div className="mt-auto rounded-lg border border-[rgba(147,18,255,0.3)] bg-[linear-gradient(135deg,rgba(147,18,255,0.2),rgba(147,18,255,0.04))] p-2.5">
        <div className="flex items-center gap-1.5">
          <BoltLogo className="h-3.5 w-3.5" />
          <span className="text-white text-[11px] font-semibold">Zapline Pro</span>
        </div>
        <p className="mt-1 text-[9px] text-white/55 leading-[1.3]">
          Unlock advanced snipes & priority routing.
        </p>
        <button
          type="button"
          className="mt-2 w-full h-6 rounded-md bg-[linear-gradient(180deg,#a020ff_0%,#7a1cf8_100%)] text-white text-[9px] font-semibold"
        >
          Upgrade
        </button>
      </div>
    </aside>
  );
}

/* ============================================================
   MAIN PANEL
   ============================================================ */
function StatCard({ label, value, delta, positive }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.015] p-2.5">
      <p className="text-[9px] text-white/50 leading-tight">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-white text-[18px] font-semibold tracking-[-0.01em]">{value}</span>
        <span className={`text-[9px] font-medium ${positive ? "text-[#45b558]" : "text-[#f03b2a]"}`}>
          {delta}
        </span>
      </div>
    </div>
  );
}

function MainPanel() {
  return (
    <main className="flex-1 min-w-0 flex flex-col p-3 gap-2">
      {/* Top bar */}
      <div className="flex items-center justify-between h-7">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
            <SearchIcon className="h-3 w-3 text-white/55" />
          </span>
          <span className="h-6 w-6 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
            <BellIcon className="h-3 w-3 text-white/55" />
          </span>
          <span className="text-[10px] text-white/35 ml-1">/</span>
          <span className="text-[10px] text-white/55">Overview</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/55">Alex T.</span>
          <span className="text-[10px] text-white/35 font-mono">0x3f4…9c7e</span>
          <span className="h-6 w-6 rounded-full bg-[linear-gradient(135deg,#a020ff,#5b21b6)] flex items-center justify-center text-[9px] font-semibold text-white">
            AT
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard
          label="Revenue generated (since inception)"
          value="214,402"
          delta="+12.5%"
          positive
        />
        <StatCard label="Active wallets/users" value="6412" delta="−3.1%" />
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[80px] rounded-lg border border-white/[0.06] bg-white/[0.015] p-2.5 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] text-white/70 font-medium">Daily dynamics of sales</p>
          <span className="text-[9px] text-white/35">Last 30d</span>
        </div>
        <div className="flex-1 min-h-[50px]">
          <Chart />
        </div>
      </div>

      {/* Footer row */}
      <div className="flex items-stretch gap-2">
        {/* Calendar card */}
        <div className="flex-1 rounded-lg border border-white/[0.06] bg-white/[0.015] p-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-white/70 font-medium">January 2024</p>
            <span className="text-[9px] text-white/35">Start date – Now (monthly)</span>
          </div>
          <div className="mt-1.5 grid grid-cols-3 gap-2">
            <div>
              <p className="text-[8px] text-white/40 leading-tight">Total snipes</p>
              <p className="text-[10px] text-white font-medium">
                1,284 <span className="text-[#45b558] text-[8px]">+8.4%</span>
              </p>
            </div>
            <div>
              <p className="text-[8px] text-white/40 leading-tight">Avg. execution</p>
              <p className="text-[10px] text-white font-medium">0.42s</p>
            </div>
            <div>
              <p className="text-[8px] text-white/40 leading-tight">Win rate</p>
              <p className="text-[10px] text-white font-medium">
                68.2% <span className="text-[#45b558] text-[8px]">+2.1%</span>
              </p>
            </div>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-[8px] text-white/45">
            <span>Connected apps:</span>
            <span className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.06]">
              Charting
            </span>
            <span className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.06]">
              Terminals
            </span>
          </div>
        </div>

        {/* Small KPI card */}
        <div className="w-[140px] rounded-lg border border-white/[0.06] bg-white/[0.015] p-2.5 flex flex-col justify-between">
          <div>
            <p className="text-[8px] text-white/40 leading-tight">Projected Q1</p>
            <p className="text-[14px] text-white font-semibold mt-0.5">$2.84M</p>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full w-[68%] rounded-full bg-[linear-gradient(90deg,#7a1cf8,#a020ff)]" />
          </div>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function Dashboard() {
  return (
    <div
      className="zapline-desktop-only zapline-dash z-anim-rise absolute left-[234px] top-[651px] w-[1204px] rounded-t-[14px] border border-b-0 border-[rgba(147,18,255,0.35)] bg-[linear-gradient(180deg,rgba(20,18,28,0.72)_0%,rgba(10,10,14,0.94)_100%)] backdrop-blur-[20px] overflow-hidden flex z-20"
      style={{
        height: "max(290px, calc(50dvh / var(--s) - 180.5px))",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.04), 0 -1px 24px rgba(168,85,247,0.35), 0 0 80px rgba(147,18,255,0.15)",
        animationDelay: "820ms",
      }}
    >
      {/* External glow strip above dashboard */}
      <img
        src={DASH_GLOW}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 select-none"
        style={{
          bottom: "calc(100% - 30px)",
          width: "110%",
          height: "80px",
          objectFit: "cover",
          mixBlendMode: "screen",
          opacity: 0.75,
        }}
      />

      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col z-anim-up" style={{ animationDelay: "980ms" }}>
        <MainPanel />
      </div>
    </div>
  );
}

/* ============================================================
   MOBILE LAYOUT
   ============================================================ */
function MobileLayout() {
  return (
    <div className="zapline-mobile-only zapline-mobile-scroll relative z-10 h-[100dvh]">
      <div className="flex flex-col min-h-full">
        {/* Nav */}
        <nav className="flex items-center justify-between px-5 pt-5">
          <div className="flex items-center gap-2">
            <BoltLogo className="h-6 w-6" />
            <span className="text-white text-[17px] font-semibold">Zapline</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="zapline-btn-primary h-9 px-4 rounded-full bg-[linear-gradient(180deg,#a020ff_0%,#7a1cf8_100%)] text-white text-[12px] font-semibold"
            >
              Get Started
            </button>
            <button
              type="button"
              aria-label="Menu"
              className="h-9 w-9 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </nav>

        {/* Hero */}
        <div className="px-6 mt-10 text-center">
          <h1 className="zapline-display text-white text-[36px] leading-[1.05]">
            <span className="bg-clip-text text-transparent bg-[linear-gradient(120deg,#e9d5ff_0%,#a020ff_45%,#7a1cf8_100%)]">
              Zapline
            </span>
            <br />
            Trade Smarter,
            <br />
            Faster, Safer.
          </h1>
          <p className="mt-4 text-[#8b8988] text-[14px] leading-[22px] max-w-[380px] mx-auto">
            The first fully integrated on-chain trading experience. No dashboards, no delays — trade directly from your favorite DeFi apps.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2.5">
            <button
              type="button"
              className="zapline-btn-primary h-10 px-5 rounded-full bg-[linear-gradient(180deg,#a020ff_0%,#7a1cf8_100%)] text-white text-[13px] font-semibold"
            >
              Get Started
            </button>
            <button
              type="button"
              className="zapline-btn-dark h-10 px-5 rounded-full bg-white/[0.03] border border-white/[0.12] text-white text-[13px] font-semibold"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Mobile dashboard */}
        <div className="mt-10 mx-4 rounded-t-[18px] border border-b-0 border-[rgba(147,18,255,0.35)] bg-[linear-gradient(180deg,rgba(20,18,28,0.8)_0%,rgba(10,10,14,0.95)_100%)] backdrop-blur-[16px] overflow-hidden">
          {/* Chips row */}
          <div className="flex items-center gap-1.5 px-3 py-3 overflow-x-auto">
            {["Dashboard", "Search", "Snipes", "Wallets", "Referral", "Settings"].map((chip, i) => (
              <span
                key={chip}
                className={
                  i === 0
                    ? "flex-none px-3 py-1.5 rounded-full bg-[rgba(147,18,255,0.18)] border border-[rgba(147,18,255,0.35)] text-white text-[11px] font-medium"
                    : "flex-none px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/60 text-[11px] font-medium"
                }
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="border-t border-white/[0.06] px-3 py-3 flex flex-col gap-2.5">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/60">Alex T.</span>
              <span className="text-[10px] text-white/35 font-mono">0x3f4…9c7e</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                <p className="text-[9px] text-white/50">Revenue generated</p>
                <p className="mt-1 text-white text-[15px] font-semibold">214,402</p>
                <p className="text-[9px] text-[#45b558]">+12.5%</p>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                <p className="text-[9px] text-white/50">Active wallets</p>
                <p className="mt-1 text-white text-[15px] font-semibold">6412</p>
                <p className="text-[9px] text-[#f03b2a]">−3.1%</p>
              </div>
            </div>

            {/* Chart */}
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
              <p className="text-[10px] text-white/70">Daily dynamics of sales</p>
              <div className="mt-1 h-[70px]">
                <Chart />
              </div>
            </div>

            {/* Rows */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-md bg-white/[0.02] border border-white/[0.05] p-2">
                <p className="text-[8px] text-white/40">Total snipes</p>
                <p className="text-[11px] text-white font-medium">1,284</p>
              </div>
              <div className="rounded-md bg-white/[0.02] border border-white/[0.05] p-2">
                <p className="text-[8px] text-white/40">Avg. exec</p>
                <p className="text-[11px] text-white font-medium">0.42s</p>
              </div>
              <div className="rounded-md bg-white/[0.02] border border-white/[0.05] p-2">
                <p className="text-[8px] text-white/40">Win rate</p>
                <p className="text-[11px] text-white font-medium">68.2%</p>
              </div>
            </div>

            <div className="text-[9px] text-white/45 pb-2">
              Connected apps: <span className="text-white/70">Charting · Terminals</span>
            </div>
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function ZaplineHero() {
  const starsRef = useRef(null);
  const rimRef = useRef(null);
  const videoRef = useRef(null);

  const [reduced, setReduced] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  /* ---- reduced motion ---- */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  /* ---- set --s scale on :root, and redraw canvases ---- */
  useEffect(() => {
    const setScale = () => {
      const s = Math.min(window.innerWidth / 1672, window.innerHeight / 941);
      document.documentElement.style.setProperty("--s", String(s));
    };
    setScale();

    const drawStars = () => {
      const c = starsRef.current;
      if (!c) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      c.style.width = w + "px";
      c.style.height = h + "px";
      const ctx = c.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);

      const count = Math.floor((w * h) / 3200);
      for (let i = 0; i < count; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h * 0.85;
        const r = Math.random() * 1.1 + 0.15;
        const a = Math.random() * 0.75 + 0.12;
        ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawRim = () => {
      const c = rimRef.current;
      if (!c) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      c.style.width = w + "px";
      c.style.height = h + "px";
      const ctx = c.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const arcTopY = -h * 0.22;
      const arcEndY = h * 0.42;
      const arcSpread = w * 0.85;

      // Soft glow behind the arch
      const glow = ctx.createRadialGradient(cx, h * 0.05, 0, cx, h * 0.05, w * 0.75);
      glow.addColorStop(0, "rgba(190,90,255,0.55)");
      glow.addColorStop(0.35, "rgba(147,18,255,0.20)");
      glow.addColorStop(1, "rgba(147,18,255,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h * 0.9);

      // Magenta plasma underlay
      const m = ctx.createRadialGradient(cx, h * 0.28, 0, cx, h * 0.28, w * 0.55);
      m.addColorStop(0, "rgba(255,60,200,0.16)");
      m.addColorStop(1, "rgba(255,60,200,0)");
      ctx.fillStyle = m;
      ctx.fillRect(0, 0, w, h * 0.65);

      const strokeArc = (lineWidth, color, blur) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.shadowColor = "rgba(180,90,255,1)";
        ctx.shadowBlur = blur;
        ctx.beginPath();
        ctx.moveTo(cx - arcSpread, arcEndY);
        ctx.quadraticCurveTo(cx, arcTopY, cx + arcSpread, arcEndY);
        ctx.stroke();
        ctx.restore();
      };

      strokeArc(70, "rgba(147,18,255,0.14)", 90);
      strokeArc(24, "rgba(168,60,255,0.32)", 50);
      strokeArc(6, "rgba(216,170,255,0.72)", 26);
      strokeArc(1.6, "rgba(255,240,255,0.95)", 10);
    };

    const redraw = () => {
      setScale();
      drawStars();
      drawRim();
    };

    redraw();
    window.addEventListener("resize", redraw);
    return () => window.removeEventListener("resize", redraw);
  }, []);

  /* ---- glow video autoplay ---- */
  useEffect(() => {
    if (reduced) return;
    const v = videoRef.current;
    if (!v) return;
    const onPlaying = () => setVideoReady(true);
    v.addEventListener("playing", onPlaying);
    const p = v.play?.();
    if (p && typeof p.catch === "function") p.catch(() => {});
    return () => v.removeEventListener("playing", onPlaying);
  }, [reduced]);

  return (
    <div className="zapline-root relative h-[100dvh] w-full overflow-hidden bg-black text-[#f7f7f8]">
      <style>{CSS}</style>

      {/* ---------- Stars ---------- */}
      <canvas
        ref={starsRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      />

      {/* ---------- Procedural rim (fallback / mobile) ---------- */}
      <canvas
        ref={rimRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-[1] transition-opacity duration-700 ${
          videoReady ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* ---------- Glow video (desktop) ---------- */}
      {!reduced && (
        <video
          ref={videoRef}
          src={GLOW_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          className={`zapline-glow-video zapline-desktop-only pointer-events-none absolute z-[2] object-cover transition-opacity duration-[800ms] ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
          style={{
            left: "50%",
            top: "calc((100dvh - 941px * var(--s)) / 2)",
            width: "calc(1672px * var(--s))",
            height: "calc(717px * var(--s))",
            marginLeft: "calc(-836px * var(--s))",
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* ---------- Desktop stage ---------- */}
      <div className="zapline-stage zapline-desktop-only z-10">
        <Nav />
        <HeroCopy />
        <Dashboard />
      </div>

      {/* ---------- Mobile layout ---------- */}
      <MobileLayout />
    </div>
  );
}