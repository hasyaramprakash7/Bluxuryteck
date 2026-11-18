"use client";

import { useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------- data */

const PLATE =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/b4b7e033-b082-4f09-8ec4-2fabca30c4b4.webp";
const VIDEO =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/48106c12-33c9-4cea-9780-4a080477405e.mp4";

const NAV_ITEMS = ["Work", "Showcase", "Members", "Journal"];

/* ---------------------------------------------------------------- icons */

const stroke = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const LayersIcon = (p) => (
  <svg {...stroke} {...p}>
    <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" />
    <path d="m3 12.5 9 4.5 9-4.5" />
    <path d="m3 17 9 4.5 9-4.5" />
  </svg>
);
const CircoolesIcon = (p) => (
  <svg {...stroke} {...p}>
    <circle cx="9" cy="12" r="6" />
    <circle cx="15" cy="12" r="6" />
  </svg>
);
const QuotientIcon = (p) => (
  <svg {...stroke} {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="m14.6 14.6 4.6 4.6" />
  </svg>
);
const HourglassIcon = (p) => (
  <svg {...stroke} {...p}>
    <path d="M7 3h10M7 21h10" />
    <path d="M8 3v3l4 5 4-5V3" />
    <path d="M8 21v-3l4-5 4 5v3" />
  </svg>
);
const CatalogIcon = (p) => (
  <svg {...stroke} {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
  </svg>
);

const LOGOS = [
  { name: "Layers", Icon: LayersIcon },
  { name: "Circooles", Icon: CircoolesIcon },
  { name: "Quotient", Icon: QuotientIcon },
  { name: "Hourglass", Icon: HourglassIcon },
  { name: "Catalog", Icon: CatalogIcon },
];

/* ---------------------------------------------------------------- css */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Poppins:wght@600&display=swap');

:root{ --u: min(100vw / 1448, 100dvh / 1086); }
html, body{ margin:0; padding:0; height:100%; overflow:hidden; background:#000; }

.ec-root{
  font-family:'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-feature-settings:'cv11','ss01';
  font-synthesis-weight:none;
}
.ec-poppins{ font-family:'Poppins', ui-sans-serif, system-ui, sans-serif; }

/* nothing here is a control — no pointer, no text cursor */
.ec-static{ cursor:default; -webkit-user-select:none; user-select:none; }

@keyframes ecFade   { from{opacity:0;} to{opacity:1;} }
@keyframes ecRise   { from{opacity:0; transform:translateY(24px);} to{opacity:1; transform:translateY(0);} }
@keyframes ecSettle { from{opacity:0; transform:translateY(-10px) scale(.94);} to{opacity:1; transform:translateY(0) scale(1);} }
@keyframes ecScroll { from{transform:translate3d(0,0,0);} to{transform:translate3d(-50%,0,0);} }

.ec-fade, .ec-rise, .ec-settle{
  animation-duration:.95s;
  animation-timing-function:cubic-bezier(.22,.61,.36,1);
  animation-fill-mode:both;
}
.ec-fade   { animation-name:ecFade; }
.ec-rise   { animation-name:ecRise; }
.ec-settle { animation-name:ecSettle; animation-duration:.85s; }

.ec-rim::before,
.ec-rim-ghost::before{
  content:"";
  position:absolute;
  inset:0;
  border-radius:inherit;
  padding:1px;
  -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite:xor;
  mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite:exclude;
  pointer-events:none;
}
.ec-rim::before{
  background:linear-gradient(45deg,
    rgba(255,172,92,.95) 0%,
    rgba(238,127,32,.32) 34%,
    rgba(238,127,32,.06) 62%,
    rgba(255,200,160,.45) 100%);
}
.ec-rim-ghost::before{
  background:linear-gradient(115deg,
    rgba(255,255,255,.55) 0%,
    rgba(150,124,102,.28) 45%,
    rgba(236,122,28,.95) 100%);
  opacity:.9;
  transition:opacity .35s ease;
}
.ec-rim-ghost:hover::before{ opacity:1; }

.ec-mask-x{
  -webkit-mask-image:linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%);
  mask-image:linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%);
}
@media (max-width:767px){
  .ec-mask-x{
    -webkit-mask-image:linear-gradient(90deg, transparent 0%, #000 7%, #000 93%, transparent 100%);
    mask-image:linear-gradient(90deg, transparent 0%, #000 7%, #000 93%, transparent 100%);
  }
}

.ec-track{ animation:ecScroll 46s linear infinite; will-change:transform; }
.ec-strip:hover .ec-track{ animation-play-state:paused; }

@media (prefers-reduced-motion:reduce){
  .ec-fade,.ec-rise,.ec-settle{ animation:none !important; opacity:1 !important; transform:none !important; }
  .ec-track{ animation:none !important; }
  .ec-video{ display:none !important; }
  .ec-primary,.ec-ghost,.ec-video{ transition:none !important; }
}
`;

/* ---------------------------------------------------------------- component */

export default function EclipsioHero() {
  const [reduced, setReduced] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

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

  /* only the mobile menu toggle is interactive; close on Escape */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <section
      className="ec-root relative h-[100dvh] w-full overflow-hidden bg-black text-white antialiased"
      aria-label="Eclipsio hero"
    >
      <style>{CSS}</style>

      {/* ================= SCENE — clipped, never causes sideways scroll ================= */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 aspect-[1448/1086] w-[calc(1448*var(--u))] -translate-x-1/2 max-md:w-[190vw]">
          <img
            src={PLATE}
            alt=""
            draggable="false"
            className="h-full w-full select-none object-cover object-bottom"
          />
          {!reduced && (
            <video
              ref={videoRef}
              src={VIDEO}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onPlaying={() => setVideoReady(true)}
              className={`ec-video pointer-events-none absolute bottom-0 left-1/2 aspect-[1930/1086] h-full -translate-x-1/2 select-none object-cover object-bottom transition-opacity duration-1000 ${
                videoReady ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 mx-auto flex h-full w-[calc(1448*var(--u))] max-w-full flex-col">

        {/* ---------- NAV ---------- */}
        <header className="relative h-[calc(124.5*var(--u))] flex-none max-md:h-16">
          <div className="absolute inset-x-0 top-[calc(34*var(--u))] flex h-[calc(37.7*var(--u))] items-center justify-center max-md:top-3.5 max-md:h-10">

            {/* brand — static */}
            <span
              className="ec-fade ec-static absolute left-[calc(68*var(--u))] top-0 flex h-full items-center gap-2 text-white max-md:left-[18px] max-md:gap-1.5"
              style={{ animationDelay: ".05s" }}
              aria-label="Eclipsio"
            >
              <svg
                viewBox="0 0 40 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[calc(31*var(--u))] w-auto max-md:h-[22px]"
                aria-hidden="true"
              >
                <path d="M4 4v12a6 6 0 0 0 12 0V4" />
                <path d="M23 28V15a5.5 5.5 0 0 1 11 0v13" />
              </svg>
              <span className="text-[calc(27.8*var(--u))] font-semibold leading-none tracking-[-0.03em] max-md:text-[20px]">
                Eclipsio
              </span>
            </span>

            {/* links — desktop, static */}
            <nav
              className="ec-fade ec-static hidden items-center gap-[calc(42.6*var(--u))] md:flex"
              style={{ animationDelay: ".12s" }}
              aria-label="Primary"
            >
              {NAV_ITEMS.map((label) => (
                <span
                  key={label}
                  className="text-[calc(16.25*var(--u))] font-semibold text-white/75 transition-colors duration-300 hover:text-white"
                >
                  {label}
                </span>
              ))}
            </nav>

            {/* CTA — desktop, static */}
            <span
              className="ec-fade ec-static absolute right-[calc(62*var(--u))] top-0 hidden h-full items-center rounded-full bg-white px-[calc(24*var(--u))] text-[calc(16*var(--u))] font-semibold text-black transition-transform duration-300 hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(255,255,255,0.18)] md:inline-flex"
              style={{ animationDelay: ".18s" }}
            >
              Start Creating
            </span>

            {/* menu button — mobile (the only real control left) */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="ec-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="ec-fade absolute right-[18px] top-0 flex aspect-square h-full items-center justify-center rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-md md:hidden"
              style={{ animationDelay: ".18s" }}
            >
              <span className="relative block h-3 w-4" aria-hidden="true">
                <i
                  className={`absolute left-0 h-[1.7px] w-full rounded bg-white transition-transform duration-300 ${
                    menuOpen ? "top-[5px] rotate-45" : "top-[2px]"
                  }`}
                />
                <i
                  className={`absolute left-0 h-[1.7px] w-full rounded bg-white transition-transform duration-300 ${
                    menuOpen ? "top-[5px] -rotate-45" : "top-[9px]"
                  }`}
                />
              </span>
            </button>
          </div>

          {/* dropdown — mobile, static items */}
          {menuOpen && (
            <div
              id="ec-menu"
              className="ec-static absolute right-[18px] z-50 flex w-[190px] flex-col gap-0.5 rounded-[18px] border border-white/10 bg-[#0a0a0b]/95 p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.75)] backdrop-blur-xl md:hidden"
              style={{ top: "calc(14px + 40px + 8px)" }}
            >
              {NAV_ITEMS.map((label) => (
                <span
                  key={label}
                  className="rounded-xl px-3 py-2.5 text-[15px] font-semibold text-white/80 transition-colors hover:bg-white/[0.07] hover:text-white"
                >
                  {label}
                </span>
              ))}
              <span className="mt-1 rounded-xl bg-white px-3 py-2.5 text-center text-[15px] font-semibold text-black">
                Start Creating
              </span>
            </div>
          )}
        </header>

        {/* ---------- HERO COPY ---------- */}
        <main className="flex flex-col items-center text-center">
          <div className="flex w-full flex-col items-center px-[18px] md:px-0">

            {/* badge */}
            <div
              className="ec-rim ec-settle ec-static relative inline-flex h-[calc(43.9*var(--u))] items-center gap-[calc(10*var(--u))] rounded-full bg-[linear-gradient(180deg,rgba(255,175,115,0.10)_0%,rgba(60,28,10,0.34)_55%,rgba(24,12,6,0.58)_100%)] px-[calc(24*var(--u))] shadow-[inset_0_0_26px_rgba(238,127,32,0.20),inset_0_1px_0_rgba(255,226,200,0.20),0_10px_36px_rgba(238,127,32,0.10)] backdrop-blur-[10px] max-md:h-[34px] max-md:gap-2 max-md:px-3.5"
              style={{ animationDelay: ".30s" }}
            >
              <span
                className="h-[calc(7*var(--u))] w-[calc(7*var(--u))] flex-none rounded-full bg-[#f7c69b] shadow-[0_0_8px_2px_rgba(247,198,155,0.80),0_0_18px_rgba(238,127,32,0.65)] max-md:h-1.5 max-md:w-1.5"
                aria-hidden="true"
              />
              <span className="whitespace-nowrap text-[calc(15.6*var(--u))] font-medium tracking-[.01em] text-[#b9b9bd] max-md:text-[11.5px]">
                Shine Your Name Brighter Tonight
              </span>
            </div>

            {/* headline */}
            <h1 className="ec-static mt-[calc(26*var(--u))] text-[calc(78.8*var(--u))] leading-[calc(81*var(--u))] tracking-[-0.022em] text-white [font-weight:750] max-md:mt-[18px] max-md:max-w-full max-md:text-[clamp(28px,8.6vw,38px)] max-md:leading-[1.1] max-md:text-balance">
              <span className="ec-rise block" style={{ animationDelay: ".42s" }}>
                Launch a Personal Brand That
              </span>
              <span className="ec-rise block" style={{ animationDelay: ".52s" }}>
                Outshines Every Résumé
              </span>
            </h1>

            {/* subline */}
            <p
              className="ec-rise ec-static mt-[calc(22*var(--u))] max-w-[calc(1010*var(--u))] text-[calc(22.6*var(--u))] leading-[calc(36*var(--u))] tracking-[.031em] text-[#bcbcbe] max-md:mt-3.5 max-md:text-[14.5px] max-md:leading-[22px]"
              style={{ animationDelay: ".66s" }}
            >
              Whether you're a designer, developer, or creator, Eclipsio will help
              <br className="hidden md:block" /> you glow brighter with a site
              that feels polished, and you.
            </p>

            {/* buttons — static, visual only */}
            <div className="ec-static mt-[calc(30*var(--u))] flex w-full justify-center gap-[calc(14*var(--u))] max-md:mt-[22px] max-md:gap-3">
              <span
                className="ec-rise ec-primary inline-flex h-[calc(55.4*var(--u))] items-center justify-center rounded-full border border-white/55 bg-[linear-gradient(180deg,#f28a2a_0%,#ec7a1c_100%)] px-[calc(36*var(--u))] text-[calc(18.5*var(--u))] font-semibold text-white shadow-[0_0_0_0_rgba(238,127,32,0)] transition-[box-shadow,transform,filter] duration-300 hover:-translate-y-px hover:brightness-105 hover:shadow-[0_0_38px_rgba(238,127,32,0.55),0_0_86px_rgba(238,127,32,0.22)] max-md:h-[50px] max-md:flex-1 max-md:min-w-0 max-md:px-3 max-md:text-[15px]"
                style={{ animationDelay: ".78s" }}
              >
                Start Creating
              </span>
              <span
                className="ec-rise ec-rim-ghost ec-ghost relative inline-flex h-[calc(55.4*var(--u))] items-center justify-center rounded-full bg-black px-[calc(36*var(--u))] text-[calc(18.5*var(--u))] font-semibold text-white transition-[background-color,transform] duration-300 hover:-translate-y-px hover:bg-[#0a0806] max-md:h-[50px] max-md:flex-1 max-md:min-w-0 max-md:px-3 max-md:text-[15px]"
                style={{ animationDelay: ".86s" }}
              >
                View Samples
              </span>
            </div>
          </div>

          {/* logo strip */}
          <div
            className="ec-strip ec-mask-x ec-rise ec-static mt-[calc(34*var(--u))] h-[calc(56*var(--u))] w-[calc(892*var(--u))] overflow-hidden rounded-full border border-[rgba(255,190,140,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.075)_0%,rgba(255,255,255,0.018)_100%)] backdrop-blur-[14px] max-md:mt-6 max-md:h-11 max-md:w-full max-md:rounded-none max-md:border-0 max-md:bg-none max-md:backdrop-blur-none"
            style={{ animationDelay: ".98s" }}
          >
            <div className="relative h-full overflow-hidden">
              <div className="ec-track flex h-full w-max items-center">
                {[...LOGOS, ...LOGOS].map(({ name, Icon }, i) => (
                  <div
                    key={`${name}-${i}`}
                    className="mr-[calc(56*var(--u))] flex flex-none items-center gap-[calc(34*var(--u)*0.4)] text-[#8b8b90] max-md:mr-[34px] max-md:gap-2.5"
                    aria-hidden={i >= LOGOS.length}
                  >
                    <Icon className="h-[calc(34*var(--u))] w-[calc(34*var(--u))] flex-none max-md:h-[22px] max-md:w-[22px]" />
                    <span className="ec-poppins whitespace-nowrap text-[calc(17.5*var(--u))] font-semibold tracking-[-0.01em] max-md:text-[14px]">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* ---------- eclipse zone ---------- */}
        <div className="min-h-0 flex-1" />
      </div>
    </section>
  );
}