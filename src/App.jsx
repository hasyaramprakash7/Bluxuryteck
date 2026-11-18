// Combined: BLuxuryTech landing page + Portfolio gallery
// Static images imported at top, click to open the real component full-screen.
import { useCallback, useEffect, useRef, useState, Suspense, lazy } from "react";
import { ArrowLeft, ArrowUpRight, CheckCircle2, ShieldCheck, Terminal, Cpu, Globe, Server, MessageSquare, Sparkles } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Static image imports (bundled by Vite / Webpack)                  */
/* ------------------------------------------------------------------ */
import imgMain      from "./assets/assets/m1.png";
import imgEcomers   from "./assets/assets/m2.png";
import imgEcomWomen from "./assets/assets/m3.png";
import imgRK1       from "./assets/assets/m4.png";
import imgRK2       from "./assets/assets/m5.png";
import imgRK3       from "./assets/assets/m6.png";
import imgRK4       from "./assets/assets/m7.png";
import imgRK5       from "./assets/assets/m7.png";
import imgBluxHtml  from "./assets/assets/m7.png";

/* ------------------------------------------------------------------ */
/*  Lazy-load every real project (only used by the full-screen viewer) */
/* ------------------------------------------------------------------ */
const Main      = lazy(() => import("./Building/main1"));
const Ecomers   = lazy(() => import("./Building/ecomers1"));
const EcomWomen = lazy(() => import("./Building/ecomwomen"));
const RK1       = lazy(() => import("./Building/rk1"));
const RK2       = lazy(() => import("./Building/rk2"));
const RK3       = lazy(() => import("./Building/rk3"));
const RK4       = lazy(() => import("./Building/rk4"));
const RK5       = lazy(() => import("./Building/rk5"));

/* ------------------------------------------------------------------ */
/*  PROJECT DATA                                                      */
/* ------------------------------------------------------------------ */
const PROJECTS = [
  // {
  //   id: "main", num: "01",
  //   title: "B LUXURY TECH", subtitle: "Autonomous AI Agents",
  //   category: "AI · SaaS Platform",
  //   description: "Marketing site for enterprise AI agent networks — live terminal, ROI calculator and multi-agent architecture simulator.",
  //   tags: ["React", "Tailwind", "Lucide"],
  //   accent: "#00FF88",
  //   image: imgMain,
  //   Component: Main,
  // },
  {
    id: "ecomers", num: "02",
    title: "RUNWAY", subtitle: "Try the Look",
    category: "E-commerce · Fashion",
    description: "Editorial fashion runway with 3D carousel, hot-spot pins, size picker and a complete-the-look bundle checkout.",
    tags: ["React", "E-commerce"],
    accent: "#0B6E3C",
    image: imgEcomers,
    Component: Ecomers,
  },
  {
    id: "ecomwomen", num: "03",
    title: "MAISON VELL", subtitle: "Spring Summer 2027",
    category: "Luxury · Fashion",
    description: "Sprite-sheet driven luxury runway with depth-based model transitions and a rolling \"Look\" counter.",
    tags: ["React", "Sprite"],
    accent: "#16A35A",
    image: imgMain,
    Component: EcomWomen,
  },
  {
    id: "rk1", num: "04",
    title: "ATELIER", subtitle: "Design · Build · Handover",
    category: "Architecture · Construction",
    description: "Three-stage hero with crossfade backdrops and a drag-to-reveal before/after slider showing bare land turning into a finished home.",
    tags: ["React", "Framer"],
    accent: "#0B6E3C",
    image: imgRK3,
    Component: RK1,
  },
  {
    id: "rk2", num: "05",
    title: "ASCENTA", subtitle: "Cyberspace — reality",
    category: "Cyberspace — reality",
    description: "Scroll-driven react-three-fiber Cyberspace — reality stage by stage, with night toggle, blueprint wireframe and auto-tour.",
    tags: ["R3F", "Three.js"],
    accent: "#16A35A",
    image: imgEcomWomen,
    Component: RK2,
  },
  {
    id: "rk3", num: "06",
    title: "Elevate", subtitle: "Elevate your essential data to new heights",
    category: "Data · Enterprise Analytics",
    description: "Photo-depth carousel and interactive analytics rail built to organize and visualize critical business data in real time.",
    tags: ["React"],
    accent: "#0B6E3C",
    image: imgRK5,
    Component: RK3,
  },
  {
    id: "rk4", num: "07",
    title: "MELLI MOTION", subtitle: "3D Animation",
    category: "Education · 3D",
    description: "Three.js mech character with parallax petals and scroll-triggered reveals across five themed sections.",
    tags: ["Three.js", "React"],
    accent: "#5b3bd1",
    image: imgRK1,
    Component: RK4,
  },
  {
    id: "rk5", num: "08",
    title: "HIGO", subtitle: "Eau de Parfum 2026",
    category: "Beauty · E-commerce",
    description: "Parallax fig-fruit hero, sensory note selector, size picker and add-to-bag flow for a small-batch fragrance.",
    tags: ["Framer Motion", "React"],
    accent: "#16A35A",
    image: imgRK2,
    Component: RK5,
  },
  // {
  //   id: "bluxury-html", num: "09",
  //   title: "B LUXURY · HTML", subtitle: "Standalone Version",
  //   category: "Vanilla · Three.js",
  //   description: "Zero-dependency Three.js landing with theme toggle, tilt cards, starfield and a 3D torus knot that follows scroll.",
  //   tags: ["HTML", "Three.js"],
  //   accent: "#16A35A",
  //   image: imgBluxHtml,
  //   external: "/bluxury-html.html",
  // },
];

const WHATSAPP_NUMBER = "917893828468";
const PORTFOLIO_URL = "https://bluxury.pages.dev/";
const INSTAGRAM_URL = "https://www.instagram.com/bluxurytech";

const PREVIEW_W = 1280;
const PREVIEW_H = 800;
const PREVIEW_ASPECT = `${PREVIEW_W} / ${PREVIEW_H}`;

const PF_LOG =
  typeof import.meta !== "undefined" && import.meta.env && import.meta.env.DEV
    ? (...args) => console.info("%c[PF]", "color:#16A35A;font-weight:700", ...args)
    : () => {};

function buildWhatsAppUrl(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function LoadingShimmer({ accent }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: "var(--pf-media-bg)" }}
    >
      <div className="absolute inset-0 opacity-30"
        style={{ background: `radial-gradient(circle at 30% 40%, ${accent}33 0%, transparent 55%)` }} />
      <div className="pf-shimmer absolute inset-0"
        style={{ background: `linear-gradient(90deg, transparent 0%, ${accent}22 50%, transparent 100%)` }} />
      <style>{`
        .pf-shimmer { background-size: 200% 100%; animation: pf-shimmer-move 1.8s ease-in-out infinite; }
        @keyframes pf-shimmer-move {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) { .pf-shimmer { animation: none; } }
      `}</style>
    </div>
  );
}

function CardImage({ project, engaged }) {
  const [status, setStatus] = useState("loading");
  const [canPan, setCanPan] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setCanPan(false);

    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      setStatus("ok");
      const imgRatio = img.naturalHeight / img.naturalWidth;
      const cardRatio = PREVIEW_H / PREVIEW_W;
      const pannable = imgRatio > cardRatio * 1.1;
      setCanPan(pannable);
      PF_LOG(`card:image-loaded ${project.id}`);
    };
    img.onerror = () => {
      if (cancelled) return;
      setStatus("error");
      PF_LOG(`card:image-missing ${project.id}`);
    };
    img.src = project.image;

    return () => { cancelled = true; };
  }, [project.image, project.id]);

  if (status === "loading") return <LoadingShimmer accent={project.accent} />;

  if (status === "error") {
    return (
      <div
        className="absolute inset-0 grid place-items-center"
        style={{ background: `radial-gradient(circle at 50% 50%, ${project.accent}24, var(--pf-media-bg) 72%)` }}
      >
        <div className="text-center px-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.24em]" style={{ color: project.accent }}>
            {project.num}
          </div>
          <div className="mt-2 text-lg font-semibold" style={{ color: "var(--fg)" }}>{project.title}</div>
          <div className="mt-1 text-[11px]" style={{ color: "var(--mut)" }}>{project.subtitle}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: "var(--pf-media-bg)",
        backgroundImage: `url("${project.image}")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: engaged && canPan ? "center bottom" : "center top",
        transition:
          engaged && canPan
            ? "background-position 4s cubic-bezier(.35,0,.65,1)"
            : "background-position .7s ease-out",
      }}
    />
  );
}

function ProjectCard({ project, onOpen, index }) {
  const [engaged, setEngaged] = useState(false);
  const activate = () => onOpen(project.id);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={activate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
      }}
      onMouseEnter={() => setEngaged(true)}
      onMouseLeave={() => setEngaged(false)}
      onFocus={() => setEngaged(true)}
      onBlur={() => setEngaged(false)}
      className="pf-card group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl text-left transition-all duration-500 hover:-translate-y-1 focus:outline-none focus-visible:ring-2"
      style={{
        animation: `pf-fade .9s cubic-bezier(.16,1,.3,1) ${index * 60}ms backwards`,
      }}
      aria-label={`Open ${project.title}`}
    >
      <div className="pf-media-wrap relative w-full overflow-hidden" style={{ aspectRatio: PREVIEW_ASPECT }}>
        <CardImage project={project} engaged={engaged} />

        <span className="pf-num-badge absolute left-4 top-4 z-10 rounded-full px-2.5 py-0.5 font-mono text-[10px] tracking-[0.2em] backdrop-blur">
          {project.num}
        </span>
        <span
          className="absolute right-4 top-4 z-10 grid h-9 w-9 -translate-y-1 place-items-center rounded-full border opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
          style={{
            borderColor: `${project.accent}66`,
            background: `${project.accent}22`,
            color: project.accent,
            backdropFilter: "blur(8px)",
          }}
        >
          <ArrowUpRight size={16} />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: project.accent }}>
            {project.category}
          </div>
          <h3 className="mt-1.5 text-lg font-semibold leading-tight" style={{ color: "var(--fg)" }}>{project.title}</h3>
          <p className="mt-0.5 text-xs" style={{ color: "var(--mut)" }}>{project.subtitle}</p>
        </div>
        <p className="line-clamp-2 text-xs leading-relaxed" style={{ color: "var(--mut)" }}>{project.description}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {project.tags.map((t) => (
            <span key={t} className="pf-tag-pill rounded-full px-2.5 py-0.5 text-[10px] font-semibold">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectViewer({ project, onClose }) {
  useEffect(() => {
    document.title = `${project.title} — BLuxury Tech Portfolio`;
    const root = document.getElementById("root");
    if (root) root.classList.add("viewing-project");
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.title = "BLuxury Tech — Autonomous AI Agents, Mobile Apps & Web Portals";
      if (root) root.classList.remove("viewing-project");
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose, project.title]);

  const Cmp = project.Component;

  return (
    <>
      {project.external ? (
        <iframe title={project.title} src={project.external} className="fixed inset-0 h-full w-full border-0 bg-white" />
      ) : (
        <Suspense
          fallback={
            <div className="fixed inset-0 grid place-items-center bg-[#0a0a0f]">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-t-transparent"
                  style={{ borderColor: `${project.accent}33`, borderTopColor: project.accent }} />
                <span className="text-xs uppercase tracking-[0.3em] text-white/50">Loading {project.title}</span>
              </div>
            </div>
          }
        >
          <Cmp />
        </Suspense>
      )}

      <button
        onClick={onClose}
        className="fixed bottom-5 left-5 z-[2147483647] flex items-center gap-2 rounded-full border border-white/25 bg-black/85 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-black"
        style={{ boxShadow: `0 12px 40px -10px ${project.accent}55` }}
      >
        <ArrowLeft size={14} />
        Portfolio
      </button>

      <div className="pointer-events-none fixed bottom-5 right-5 z-[2147483647] hidden sm:block">
        <div className="rounded-full border border-white/15 bg-black/70 px-4 py-2 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: project.accent }} />
            <span className="text-[10px] font-mono tracking-[0.2em] text-white/70">{project.num} · {project.title}</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Interactive 3D Tilt Card for Software Development Systems         */
/* ------------------------------------------------------------------ */
function TiltCard({ product }) {
  const cardRef = useRef(null);

  const onMove = (e) => {
    const el = cardRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-4px)`;
  };

  const onLeave = () => {
    const el = cardRef.current;
    if (el) el.style.transform = "";
  };

  return (
    <div
      ref={cardRef}
      className="card tilt"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="card-top">
        <div className="ic">
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {product.icon}
          </svg>
        </div>
        <span className="card-badge">{product.badge}</span>
      </div>
      <h3>{product.title}</h3>
      <p>{product.body}</p>
      <div className="card-tags">
        {product.stack.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>
    </div>
  );
}

const LANDING_CSS = `
:root{
  --bg:#fcfcfb;
  --fg:#090b0a;
  --mut:#4b5563;
  --green:#0B6E3C;
  --btn:#0B6E3C;
  --accent:#0B6E3C;
  --card:rgba(255,255,255,.86);
  --pf-card-bg:#ffffff;
  --pf-media-bg:#f2f2ef;
  --pf-band-bg:rgba(246,246,243,.78);
  --line:rgba(10,12,11,.12);
  --hbg:rgba(252,252,251,.86);
  --shadow:0 24px 64px -32px rgba(9,11,10,.16);
  box-sizing:border-box;
  padding-top:env(safe-area-inset-top,0px);
  padding-bottom:env(safe-area-inset-bottom,0px)
}
:root[data-theme="dark"]{
  --bg:#050606;
  --fg:#f6f6f4;
  --mut:#9ca3af;
  --green:#16A35A;
  --accent:#16A35A;
  --card:rgba(16,19,18,.76);
  --pf-card-bg:#0e0e12;
  --pf-media-bg:#08080a;
  --pf-band-bg:rgba(8,9,10,.86);
  --line:rgba(255,255,255,.12);
  --hbg:rgba(5,6,6,.82);
  --shadow:0 28px 70px -30px rgba(0,0,0,.85)
}
html{scroll-padding-top:calc(env(safe-area-inset-top,0px) + 84px);scroll-behavior:smooth}
*,*::before,*::after{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font-family:Manrope,system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.6;transition:background .4s,color .4s;-webkit-font-smoothing:antialiased}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);background:var(--hbg);backdrop-filter:blur(16px);z-index:30}
#scene{position:fixed;inset:0;width:100%;height:100%;z-index:0;display:block}
main,header,footer{position:relative;z-index:1}
h1,h2,h3{font-family:Syne,"Helvetica Neue",Arial,sans-serif;line-height:1.05;margin:0}
a{color:inherit;text-decoration:none}

header{position:sticky;top:env(safe-area-inset-top,0px);z-index:40;background:var(--hbg);backdrop-filter:blur(16px);border-bottom:1px solid var(--line)}
.bar{max-width:1220px;margin:0 auto;padding:0 24px;height:68px;display:flex;align-items:center;justify-content:space-between;gap:16px;position:relative}
.logo{font-family:Syne,sans-serif;font-weight:800;font-size:1.06rem;letter-spacing:.04em;white-space:nowrap;display:flex;align-items:center;gap:9px}
.logo i{font-style:normal;color:var(--green)}
.logo-dot{width:8px;height:8px;border-radius:999px;background:var(--green);box-shadow:0 0 12px var(--green)}
nav{display:flex;gap:28px;font-size:.9rem;font-weight:500}
nav a{color:var(--mut);transition:color .2s}nav a:hover{color:var(--fg)}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:1px solid transparent;cursor:pointer;font:600 .92rem Manrope,sans-serif;padding:13px 26px;border-radius:999px;background:var(--btn);color:#fff;transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease}
.btn:hover{transform:translateY(-2px);box-shadow:0 14px 36px -10px var(--green)}
.btn.ghost{background:var(--card);color:var(--fg);border:1px solid var(--line);box-shadow:none;backdrop-filter:blur(12px)}
.btn.ghost:hover{border-color:var(--green)}
.btn.wa-btn{background:linear-gradient(135deg,#0B6E3C 0%,#16A35A 100%);border:1px solid rgba(255,255,255,.18);box-shadow:0 14px 38px -12px rgba(22,163,90,.55)}
.btn.wa-btn:hover{border-color:rgba(255,255,255,.4);box-shadow:0 18px 44px -10px rgba(22,163,90,.75)}
.tog{padding:9px 15px;font-size:.8rem}
.pf-nav-btn{white-space:nowrap;padding:10px 18px;font-size:.86rem}
:focus-visible{outline:2px solid var(--green);outline-offset:3px}
.wrap{max-width:1220px;margin:0 auto;padding:0 24px}

/* Hero + Eyebrow */
.hero{min-height:calc(100svh - 68px);display:flex;align-items:center;padding:102px 0}
.eyebrow{display:inline-flex;align-items:center;gap:9px;padding:7px 16px;border-radius:999px;border:1px solid var(--line);background:var(--card);backdrop-filter:blur(14px);font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--fg);margin-bottom:24px;box-shadow:var(--shadow)}
.eyebrow-pulse{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 10px var(--green)}
.eyebrow span{color:var(--green)}
.hero h1{font-size:clamp(2.55rem,6.8vw,5.4rem);font-weight:800;max-width:12ch;letter-spacing:-.025em}
.hero p{color:var(--mut);font-size:1.12rem;max-width:36rem;margin:24px 0 34px;line-height:1.68}
.hero .row{display:flex;flex-wrap:wrap;gap:12px}
.hint{position:absolute;bottom:22px;left:24px;font-size:.76rem;letter-spacing:.04em;color:var(--mut)}

/* Enterprise Metrics Bar */
.metrics-band{border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:var(--card);backdrop-filter:blur(18px);padding:30px 0}
.metrics-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.metric{padding:4px 14px;border-left:2px solid var(--green)}
.metric b{display:block;font-family:Syne,sans-serif;font-size:clamp(1.65rem,3vw,2.25rem);font-weight:800;line-height:1.1;color:var(--fg)}
.metric span{display:block;font-size:.82rem;color:var(--mut);margin-top:5px}

section{padding:108px 0}
.head{max-width:44rem;margin-bottom:50px}
.head-tag{display:inline-flex;align-items:center;gap:8px;font-size:.72rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--green);margin-bottom:12px}
.head h2{font-size:clamp(2rem,4.5vw,3.35rem);font-weight:800;letter-spacing:-.02em}
.head p{color:var(--mut);margin:14px 0 0;font-size:1.02rem}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.card{position:relative;display:flex;flex-direction:column;padding:34px 28px 28px;border:1px solid var(--line);border-radius:24px;background:var(--card);backdrop-filter:blur(18px);box-shadow:var(--shadow);transform-style:preserve-3d;transition:transform .25s ease-out,border-color .25s,box-shadow .25s;will-change:transform}
.card:hover{border-color:var(--green);box-shadow:0 30px 65px -30px var(--green)}
.card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:22px}
.card .ic{width:52px;height:52px;border-radius:15px;display:grid;place-items:center;background:linear-gradient(135deg,var(--green),#16A35A);color:#fff;transform:translateZ(36px);box-shadow:0 14px 28px -10px var(--green);flex:none}
.card-badge{font-size:.66rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--green);border:1px solid var(--line);padding:5px 11px;border-radius:999px;background:var(--bg)}
.card h3{font-size:1.3rem;transform:translateZ(22px);margin-bottom:10px}
.card p{color:var(--mut);margin:0;font-size:.93rem;transform:translateZ(12px)}
.card-tags{margin-top:auto;padding-top:20px;display:flex;flex-wrap:wrap;gap:6px}
.card-tags span{font-size:.71rem;font-weight:600;color:var(--mut);border:1px solid var(--line);padding:3px 10px;border-radius:999px}

/* Tech Stack & Standards Matrix */
.stack-box{margin-top:34px;padding:30px;border:1px solid var(--line);border-radius:24px;background:var(--card);backdrop-filter:blur(18px);box-shadow:var(--shadow)}
.stack-header{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;padding-bottom:18px;border-bottom:1px solid var(--line);margin-bottom:22px}
.stack-header h3{font-size:1.15rem}
.stack-header span{font-size:.82rem;color:var(--mut)}
.stack-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.stack-col strong{display:flex;align-items:center;gap:7px;font-size:.74rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--green);margin-bottom:11px}
.stack-pills{display:flex;flex-wrap:wrap;gap:6px}
.stack-pills span{font-size:.78rem;font-weight:600;padding:5px 10px;border-radius:9px;border:1px solid var(--line);background:var(--bg);color:var(--fg)}

/* Theme-Aware Portfolio Band & Project Cards */
.portfolio-band{background:var(--pf-band-bg);backdrop-filter:blur(16px);padding:108px 0;color:var(--fg);border-top:1px solid var(--line);border-bottom:1px solid var(--line);transition:background .4s,color .4s}
.pf-gallery{display:grid;grid-template-columns:1fr;gap:22px;font-family:Manrope,system-ui,sans-serif}
.pf-card{background:var(--pf-card-bg);border:1px solid var(--line);box-shadow:var(--shadow)}
.pf-card:hover{border-color:var(--green);box-shadow:0 28px 65px -28px var(--green)}
.pf-media-wrap{border-bottom:1px solid var(--line)}
.pf-num-badge{background:var(--hbg);color:var(--fg);border:1px solid var(--line)}
.pf-tag-pill{background:var(--bg);color:var(--mut);border:1px solid var(--line)}
@media (min-width:640px){.pf-gallery{grid-template-columns:repeat(2,1fr)}}
@media (min-width:1024px){.pf-gallery{grid-template-columns:repeat(3,1fr)}}

#root.viewing-project{display:block !important;max-width:none !important;padding:0 !important;margin:0 !important;text-align:left !important;width:100% !important;min-height:100vh !important}

/* Process & Engagement Models */
.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;counter-reset:s}
.step{padding:28px 24px;border-top:2px solid var(--green);border-right:1px solid var(--line);border-bottom:1px solid var(--line);border-left:1px solid var(--line);background:var(--card);backdrop-filter:blur(16px);border-radius:0 0 20px 20px;box-shadow:var(--shadow)}
.step b{font-family:Syne,sans-serif;font-size:2.1rem;color:var(--green);display:block;line-height:1;margin-bottom:14px}
.step h3{font-size:1.18rem;margin-bottom:8px}.step p{color:var(--mut);margin:0;font-size:.94rem}

.engage-grid{margin-top:34px;display:grid;grid-template-columns:1fr 1fr;gap:22px}
.engage-card{padding:32px;border:1px solid var(--line);border-radius:24px;background:var(--card);backdrop-filter:blur(18px);box-shadow:var(--shadow);display:flex;flex-direction:column;justify-content:space-between}
.engage-card.featured{border-color:var(--green)}
.engage-tag{font-size:.7rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--green);margin-bottom:8px;display:block}
.engage-card h3{font-size:1.45rem;margin-bottom:10px}
.engage-card p{color:var(--mut);font-size:.94rem;margin:0 0 20px}
.engage-list{list-style:none;padding:0;margin:0 0 24px;display:grid;gap:10px;font-size:.9rem}
.engage-list li{display:flex;align-items:center;gap:10px;color:var(--fg)}
.engage-list svg{color:var(--green);flex:none}

/* Executive WhatsApp Consultation Suite */
.cta{position:relative;border:1px solid var(--green);border-radius:30px;padding:clamp(28px,5vw,60px);background:var(--card);backdrop-filter:blur(22px);box-shadow:var(--shadow);display:grid;grid-template-columns:1fr 1.08fr;gap:44px;align-items:start}
.cta-pill{display:inline-flex;align-items:center;gap:8px;padding:6px 13px;border-radius:999px;background:rgba(22,163,90,.12);border:1px solid rgba(22,163,90,.3);color:var(--green);font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:14px}
.cta h2{font-size:clamp(1.95rem,4vw,3rem);font-weight:800;letter-spacing:-.02em}
.cta p{color:var(--mut);margin-top:12px}
.trust-points{margin-top:24px;display:grid;gap:12px;padding-top:20px;border-top:1px solid var(--line);font-size:.9rem}
.trust-points div{display:flex;align-items:center;gap:10px;color:var(--fg)}
.trust-points svg{color:var(--green);flex:none}
.wa-direct-box{margin-top:22px;padding:16px 18px;border-radius:16px;border:1px solid var(--line);background:var(--bg);display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
.wa-direct-box small{display:block;font-size:.72rem;text-transform:uppercase;letter-spacing:.12em;color:var(--mut);font-weight:700}
.wa-direct-box strong{font-size:.96rem;color:var(--fg)}

.f{display:grid;gap:14px}
.f-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.f .fld{display:block;min-width:0}
.f label{display:block;font-size:.71rem;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:var(--mut);margin-bottom:7px}
.f input,.f select,.f textarea{width:100%;max-width:100%;padding:13px 15px;border-radius:13px;border:1px solid var(--line);background:var(--bg);color:var(--fg);font:500 .94rem Manrope,sans-serif;transition:border-color .2s,box-shadow .2s}
.f input:focus,.f select:focus,.f textarea:focus{outline:none;border-color:var(--green);box-shadow:0 0 0 3px rgba(22,163,90,.16)}
.f textarea{resize:vertical;min-height:86px}
.f select option{background:var(--bg);color:var(--fg)}
.msg{font-size:.88rem;min-height:1.3em;color:var(--green);font-weight:600;line-height:1.5}
.msg.err{color:#d93a3a}
.msg a{text-decoration:underline;color:var(--green);margin-left:6px}

/* Enterprise Footer */
footer{border-top:1px solid var(--line);padding:56px 24px 36px;color:var(--mut);font-size:.86rem;background:var(--hbg);backdrop-filter:blur(16px)}
.footer-grid{max-width:1220px;margin:0 auto;display:grid;grid-template-columns:1.6fr 1fr 1fr;gap:32px;text-align:left;padding-bottom:32px;border-bottom:1px solid var(--line)}
.footer-brand p{margin:12px 0 0;max-width:26rem;line-height:1.6}
.footer-col h4{font-family:Syne,sans-serif;font-size:.92rem;color:var(--fg);margin:0 0 12px}
.footer-col ul{list-style:none;padding:0;margin:0;display:grid;gap:8px}
.footer-col a{transition:color .2s}
.footer-col a:hover{color:var(--green)}
.footer-bottom{max-width:1220px;margin:22px auto 0;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;font-size:.8rem}

@keyframes pf-fade{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}

.bar-actions{display:flex;gap:10px;align-items:center}
.desk-btn{display:inline-flex}

.menu-toggle{
  display:none;
  align-items:center;justify-content:center;
  width:40px;height:40px;padding:0;
  background:transparent;border:1px solid var(--line);border-radius:10px;
  color:var(--fg);cursor:pointer;
  transition:border-color .2s,background .2s;
}
.menu-toggle:hover{border-color:var(--fg)}
.menu-toggle .bar-line{
  display:block;width:18px;height:2px;background:currentColor;border-radius:2px;
  transition:transform .25s ease, opacity .2s ease;
}
.menu-toggle .bar-line + .bar-line{margin-top:4px}
.menu-toggle.open .bar-line:nth-child(1){transform:translateY(6px) rotate(45deg)}
.menu-toggle.open .bar-line:nth-child(2){opacity:0}
.menu-toggle.open .bar-line:nth-child(3){transform:translateY(-6px) rotate(-45deg)}

.nav-extra{display:none}

@media (max-width:1100px){
  .pf-nav-btn{padding:10px 15px;font-size:.84rem}
  .pf-nav-btn svg{display:none}
  .grid{grid-template-columns:repeat(2,1fr)}
}

@media (max-width:900px){
  .bar{padding:10px 16px;height:auto;min-height:64px;flex-wrap:nowrap;gap:10px}
  .desk-btn{display:none}
  .menu-toggle{display:inline-flex}

  nav{
    position:absolute;
    top:100%;left:0;right:0;
    display:flex;flex-direction:column;gap:0;
    background:var(--hbg);
    backdrop-filter:blur(16px);
    border-bottom:1px solid var(--line);
    box-shadow:0 20px 40px -20px rgba(0,0,0,.35);
    padding:0 20px;
    max-height:0;overflow:hidden;
    transition:max-height .35s ease, padding .35s ease;
    font-size:.95rem;
    width:auto;white-space:normal;
  }
  nav.open{max-height:620px;padding:8px 20px 18px}
  nav a{color:var(--fg);padding:12px 4px;border-bottom:1px solid var(--line);width:100%;font-size:.95rem}
  nav a:last-of-type{border-bottom:0}

  .nav-extra{display:flex;flex-direction:column;gap:10px;padding-top:14px;margin-top:6px;border-top:1px solid var(--line)}
  .nav-extra .btn{width:100%}

  .grid,.cta,.engage-grid,.footer-grid{grid-template-columns:1fr}
  .metrics-grid,.stack-grid,.steps{grid-template-columns:1fr 1fr}
  .hero{align-items:flex-end;padding-bottom:90px}
}

@media (max-width:560px){
  .steps,.metrics-grid,.stack-grid,.f-row{grid-template-columns:1fr}
  section{padding:80px 0}
  .portfolio-band{padding:80px 0}
  .pf-nav-btn{padding:11px 16px;font-size:.85rem}
  .tog{padding:8px 12px;font-size:.76rem}
  .logo{font-size:.95rem}
}

@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  .card,.btn{transition:none}
  .pf-fade,.group{animation:none !important}
  .menu-toggle .bar-line{transition:none}
}
`;

const METRICS = [
  { value: "99.9%", label: "Production uptime SLA across deployed cloud portals" },
  { value: "< 45 ms", label: "Global edge API latency via Cloudflare infrastructure" },
  { value: "100%", label: "Full Git source code & IP ownership transferred on handover" },
  { value: "7+ Live", label: "Enterprise web, mobile & 3D commerce systems in production" },
];

const PRODUCTS = [
  {
    badge: "AI & Automation",
    title: "Business and CRM automation",
    body: "WhatsApp and email enquiries are captured, documents are parsed automatically, and every lead lands in your CRM already followed up.",
    stack: ["Autonomous Agents", "WhatsApp API", "Webhooks"],
    icon: <><circle cx="6" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><path d="M9 6h4a4 4 0 0 1 4 4v5" /></>,
  },
  {
    badge: "Mobile Engineering",
    title: "iOS and Android apps",
    body: "Polished apps that feel native on every phone, with offline support, push notifications, and real-time media syncing across devices.",
    stack: ["React Native", "iOS", "Android", "Offline Sync"],
    icon: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>,
  },
  {
    badge: "Full-Stack Web",
    title: "Enterprise web portals & SaaS",
    body: "Custom multi-tenant SaaS dashboards and internal ERPs built for heavy daily use. Thousands of records stay fast, clear, and secure.",
    stack: ["React", "TypeScript", "PostgreSQL", "RBAC"],
    icon: <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8M12 18v3M7 13l3-3 3 2 4-5" /></>,
  },
  {
    badge: "Cloud & DevOps",
    title: "Zero-egress cloud infrastructure",
    body: "Cloudflare Workers, R2 object storage, and edge databases architected for sub-50ms global response times with zero bandwidth egress fees.",
    stack: ["Cloudflare R2", "Edge Workers", "Docker"],
    icon: <path d="M7 18a4 4 0 0 1-.6-7.96A6 6 0 0 1 18 9a4.5 4.5 0 0 1 0 9z" />,
  },
  {
    badge: "APIs & Integrations",
    title: "Custom APIs & payment pipelines",
    body: "High-throughput REST and real-time event APIs connecting payment gateways, ERPs, logistics partners, and legacy databases cleanly.",
    stack: ["Node.js", "Python", "REST / SSE", "Payments"],
    icon: <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>,
  },
  {
    badge: "AI & 3D Web",
    title: "Custom AI pipelines & 3D commerce",
    body: "Private document search (RAG), automated data extraction, and interactive WebGL / Three.js product configurators that convert visitors.",
    stack: ["PyTorch", "RAG Search", "Three.js", "WebGL"],
    icon: <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>,
  },
];

const TECH_STACK = [
  {
    area: "Frontend & Mobile",
    icon: <Globe size={14} />,
    items: ["React 19", "TypeScript", "Next.js", "React Native", "Three.js / WebGL", "Tailwind CSS"],
  },
  {
    area: "Backend & APIs",
    icon: <Server size={14} />,
    items: ["Node.js", "Python / FastAPI", "C++ Core", "REST & WebSockets", "Multi-Tenant Auth"],
  },
  {
    area: "Data & AI Systems",
    icon: <Cpu size={14} />,
    items: ["PostgreSQL", "MongoDB Atlas", "SQLite Edge", "PyTorch", "Ollama / Local RAG"],
  },
  {
    area: "Cloud & Security",
    icon: <ShieldCheck size={14} />,
    items: ["Cloudflare Pages", "Cloudflare R2", "Docker", "CI/CD Pipelines", "Encrypted RBAC"],
  },
];

const STEPS = [
  { n: "01", title: "Technical scoping", body: "We audit your bottlenecks, define system specs, and lock measurable KPIs." },
  { n: "02", title: "Architecture & UI/UX", body: "Database schema, API contracts, and interactive wireframes signed off before coding." },
  { n: "03", title: "Weekly sprint builds", body: "Live staging links ship every Friday so your team tests real features continuously." },
  { n: "04", title: "Production handover", body: "Zero-downtime deployment, automated monitoring, documentation, and full repo transfer." },
];

const ENGAGEMENTS = [
  {
    tag: "Fixed-Scope Delivery",
    title: "Custom MVP, Web Portal or Mobile App",
    desc: "Ideal for launching a new SaaS product, internal operations portal, or customer-facing mobile app on a predictable timeline.",
    featured: true,
    items: [
      "Complete UI/UX design + full-stack engineering",
      "Production deployment on zero-egress cloud",
      "100% source code ownership & technical docs",
      "30 days of post-launch priority support included",
    ],
  },
  {
    tag: "Dedicated Engineering Partner",
    title: "AI Automation & Continuous Scaling",
    desc: "Ideal for established businesses automating sales/support pipelines, integrating ERPs, or scaling high-traffic platforms.",
    featured: false,
    items: [
      "Custom WhatsApp, email & CRM autonomous agents",
      "Dedicated weekly engineering sprints & SLA",
      "Cloud cost optimization & database tuning",
      "Direct Slack / WhatsApp channel with lead engineers",
    ],
  },
];

const FOCUS_OPTIONS = [
  "Automation pipelines & AI agents",
  "Custom web portal or SaaS platform",
  "iOS and Android mobile app",
  "API integration & payment systems",
  "Cloud cost & zero-egress migration",
];

const TIMELINE_OPTIONS = [
  "Immediate (Within 2 weeks)",
  "This Month (2–4 weeks)",
  "Next Quarter (1–3 months)",
  "Exploring Architecture & Pricing",
];

const NAV_ITEMS = [["products", "Software"], ["portfolio", "Portfolio"], ["process", "Process"], ["audit", "Book Technical Call"]];

let threePromise = null;
function loadThree() {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.THREE) return Promise.resolve(window.THREE);
  if (threePromise) return threePromise;
  threePromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    s.async = true;
    s.onload = () => (window.THREE ? resolve(window.THREE) : reject(new Error("THREE missing")));
    s.onerror = () => reject(new Error("THREE failed to load"));
    document.head.appendChild(s);
  });
  return threePromise;
}

function ThreeScene() {
  const canvasRef = useRef(null);
  const colorsRef = useRef(null);

  useEffect(() => {
    ThreeScene._colorsRef = colorsRef;
    return () => { if (ThreeScene._colorsRef === colorsRef) ThreeScene._colorsRef = null; };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let rafId = 0;
    let teardown = () => {};

    loadThree()
      .then((THREE) => {
        if (disposed || !THREE) return;
        let renderer;
        try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); }
        catch { canvas.style.display = "none"; return; }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const root = document.documentElement;
        const cv = (n) => getComputedStyle(root).getPropertyValue(n).trim();

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
        camera.position.z = 7;

        const group = new THREE.Group();
        scene.add(group);

        const knotMat = new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.9 });
        const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.6, 0.4, 180, 24), knotMat);

        const coreMat = new THREE.MeshStandardMaterial({ flatShading: true, metalness: 0.7, roughness: 0.25 });
        const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.85, 1), coreMat);

        const ringMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.6 });
        const ring = new THREE.Mesh(new THREE.TorusGeometry(2.9, 0.012, 8, 220), ringMat);
        const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.01, 8, 220), ringMat);
        ring.rotation.x = Math.PI / 2.4;
        ring2.rotation.y = Math.PI / 2.6;
        group.add(knot, core, ring, ring2);

        const N = 700;
        const pos = new Float32Array(N * 3);
        for (let i = 0; i < N; i++) {
          const r = 5 + Math.random() * 7;
          const a = Math.random() * 6.283;
          const b = Math.acos(2 * Math.random() - 1);
          pos[i * 3] = r * Math.sin(b) * Math.cos(a);
          pos[i * 3 + 1] = r * Math.sin(b) * Math.sin(a);
          pos[i * 3 + 2] = r * Math.cos(b);
        }
        const pg = new THREE.BufferGeometry();
        pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        const pm = new THREE.PointsMaterial({ size: 0.035, transparent: true, opacity: 0.8 });
        const pts = new THREE.Points(pg, pm);
        scene.add(pts);

        scene.add(new THREE.AmbientLight(0xffffff, 0.45));
        const l1 = new THREE.PointLight(0x16a35a, 2.2, 30); l1.position.set(4, 3, 4);
        const l2 = new THREE.PointLight(0xffffff, 1.2, 30); l2.position.set(-4, -3, 3);
        scene.add(l1, l2);

        const colors = () => {
          const g = new THREE.Color(cv("--green"));
          const f = new THREE.Color(cv("--fg"));
          knotMat.color.copy(g); ringMat.color.copy(f); pm.color.copy(g);
          coreMat.color.copy(f); l1.color.copy(g);
        };
        colors();
        colorsRef.current = colors;

        const size = () => {
          const w = window.innerWidth;
          const h = window.innerHeight;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        size();

        let mx = 0, my = 0, target = 0, prog = 0;
        const onPointerMove = (e) => {
          mx = e.clientX / window.innerWidth - 0.5;
          my = e.clientY / window.innerHeight - 0.5;
        };
        const onScroll = () => {
          const h = document.documentElement.scrollHeight - window.innerHeight;
          target = h > 0 ? window.scrollY / h : 0;
        };

        window.addEventListener("resize", size);
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const frame = (t) => {
          rafId = requestAnimationFrame(frame);
          prog += (target - prog) * 0.06;
          const wide = window.innerWidth > 900;
          const s = wide ? 1 : 0.72;
          const spin = reduce ? 0 : t * 0.00022;
          group.rotation.y = prog * Math.PI * 3 + spin + mx * 0.7;
          group.rotation.x = prog * 1.1 + my * 0.5;
          group.position.x = wide ? Math.cos(prog * Math.PI * 3) * 2.3 : 0;
          group.position.y = wide ? 0 : 1.3 - prog * 1.2;
          group.scale.setScalar(s * (1 + Math.sin(prog * Math.PI) * 0.25));
          camera.position.z = 7 + prog * 2.5;
          knot.rotation.z = reduce ? 0 : t * 0.00012;
          core.rotation.x = reduce ? 0 : t * 0.0004;
          core.rotation.y = reduce ? 0 : t * 0.0006;
          pts.rotation.y = reduce ? 0 : t * 0.00003;
          pts.rotation.x = prog * 0.6;
          renderer.render(scene, camera);
        };
        rafId = requestAnimationFrame(frame);

        teardown = () => {
          cancelAnimationFrame(rafId);
          window.removeEventListener("resize", size);
          window.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("scroll", onScroll);
          colorsRef.current = null;
          [knot, core, ring, ring2].forEach((m) => m.geometry.dispose());
          [knotMat, coreMat, ringMat].forEach((m) => m.dispose());
          pg.dispose(); pm.dispose(); renderer.dispose();
        };
      })
      .catch(() => { if (canvas) canvas.style.display = "none"; });

    return () => { disposed = true; teardown(); };
  }, []);

  return <canvas id="scene" ref={canvasRef} aria-hidden="true" />;
}

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  try { return localStorage.getItem("blt-theme") || "light"; } catch { return "light"; }
};

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [activeId, setActiveId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const savedScroll = useRef(0);

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    focus: FOCUS_OPTIONS[0],
    timeline: TIMELINE_OPTIONS[0],
    notes: "",
  });
  const [msg, setMsg] = useState({ text: "", error: false, waUrl: "" });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("blt-theme", theme); } catch { /* ignore */ }
    const ref = ThreeScene._colorsRef;
    if (ref && ref.current) ref.current();
  }, [theme]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e) => {
      if (!e.target.closest("header")) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const open = useCallback((id) => {
    savedScroll.current = window.scrollY;
    window.history.pushState({ project: id }, "", `#${id}`);
    setActiveId(id);
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, []);

  const close = useCallback(() => {
    if (window.history.state?.project) window.history.back();
    else {
      setActiveId(null);
      const y = savedScroll.current;
      requestAnimationFrame(() => window.scrollTo(0, y));
    }
  }, []);

  useEffect(() => {
    if (!window.history.state || !window.history.state.view) {
      window.history.replaceState({ view: "gallery" }, "", window.location.pathname + window.location.search);
    }
    const hash = window.location.hash.replace(/^#/, "");
    const deepLinked = hash && PROJECTS.find((p) => p.id === hash);
    if (deepLinked && !window.history.state?.project) {
      window.history.pushState({ project: hash }, "", `#${hash}`);
      setActiveId(hash);
      requestAnimationFrame(() => window.scrollTo(0, 0));
    }
    const onPopState = (e) => {
      if (e.state?.project) {
        setActiveId(e.state.project);
        requestAnimationFrame(() => window.scrollTo(0, 0));
      } else {
        setActiveId(null);
        const y = savedScroll.current;
        if (y > 0) { savedScroll.current = 0; requestAnimationFrame(() => window.scrollTo(0, y)); }
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const jump = useCallback((id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
      setMsg({ text: "Please enter your full name and a valid work email address.", error: true, waUrl: "" });
      return;
    }

    const lines = [
      "*NEW TECHNICAL CONSULTATION — BLUXURY TECH*",
      "--------------------------------",
      `*Name:* ${name}`,
      form.company.trim() ? `*Company:* ${form.company.trim()}` : null,
      `*Work Email:* ${email}`,
      `*Focus:* ${form.focus}`,
      `*Target Timeline:* ${form.timeline}`,
      form.notes.trim() ? `*Project Brief:* ${form.notes.trim()}` : null,
      "--------------------------------",
      "Sent via bluxuryteck.pages.dev",
    ].filter(Boolean);

    const waUrl = buildWhatsAppUrl(lines.join("\n"));
    setMsg({
      text: `Opening WhatsApp to send your brief directly to our engineering lead (+91 78938 28468)...`,
      error: false,
      waUrl,
    });

    const popup = window.open(waUrl, "_blank", "noopener,noreferrer");
    if (!popup) {
      window.location.href = waUrl;
    }
  };

  if (activeId) {
    const project = PROJECTS.find((p) => p.id === activeId);
    if (project) return <ProjectViewer project={project} onClose={close} />;
  }

  return (
    <>
      <style>{LANDING_CSS}</style>
      <ThreeScene />

      <header>
        <div className="bar">
          <a
            href="#top"
            className="logo"
            onClick={(e) => { e.preventDefault(); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          >
            <span className="logo-dot" aria-hidden="true" />
            B LUXURY <i>TECH</i>
          </a>

          <nav id="main-nav" className={menuOpen ? "open" : ""}>
            {NAV_ITEMS.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); jump(id); }}>{label}</a>
            ))}

            <div className="nav-extra">
              <a
                className="btn pf-nav-btn"
                href={PORTFOLIO_URL}
                onClick={() => setMenuOpen(false)}
                aria-label="Open BLuxury Social App"
              >
                BLuxury Social App
              </a>
              <button type="button" className="btn ghost tog" onClick={toggleTheme}>
                {theme === "dark" ? "Light theme" : "Dark theme"}
              </button>
              <button type="button" className="btn wa-btn" onClick={() => jump("audit")}>
                Book technical call
              </button>
            </div>
          </nav>

          <div className="bar-actions">
            <a
              className="btn pf-nav-btn desk-btn"
              href={PORTFOLIO_URL}
              aria-label="Open BLuxury Social App"
            >
              Live Product
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>

            <button type="button" className="btn ghost tog desk-btn" onClick={toggleTheme} aria-label="Switch theme">
              {theme === "dark" ? "Light" : "Dark"}
            </button>

            <button type="button" className="btn wa-btn desk-btn" onClick={() => jump("audit")}>
              Book technical call
            </button>

            <button
              type="button"
              className={`menu-toggle${menuOpen ? " open" : ""}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="main-nav"
            >
              <span className="bar-line" />
              <span className="bar-line" />
              <span className="bar-line" />
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <div className="hero">
          <div className="wrap" style={{ width: "100%" }}>
            <div className="eyebrow">
              <span className="eyebrow-pulse" />
              <span>B Luxury Enterprise </span>
            </div>
            <h1>Autonomous AI &amp; luxury-grade software built to scale.</h1>
            <p>We architect high-precision web platforms, native iOS &amp; Android applications, and autonomous AI agent pipelines for ambitious enterprises.</p>
            <div className="row">
              <button type="button" className="btn wa-btn" onClick={() => jump("audit")}>
                <MessageSquare size={16} />
                Book technical call
              </button>
              <button type="button" className="btn ghost" onClick={() => jump("portfolio")}>
                Explore shipped systems
              </button>
            </div>
          </div>
          <div className="hint">Move your cursor and scroll to interact with the 3D architecture</div>
        </div>

        {/* Operational Credibility Metrics */}
        <div className="metrics-band">
          <div className="wrap">
            <div className="metrics-grid">
              {METRICS.map((m) => (
                <div className="metric" key={m.value}>
                  <b>{m.value}</b>
                  <span>{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section id="products">
          <div className="wrap">
            <div className="head">
              <span className="head-tag"><Sparkles size={13} /> Core Engineering Capabilities</span>
              <h2>Full-stack software &amp; AI systems built for production</h2>
              <p>Every platform is engineered from the ground up for security, sub-50ms edge performance, and measurable operational ROI.</p>
            </div>

            <div className="grid">
              {PRODUCTS.map((p) => (
                <TiltCard key={p.title} product={p} />
              ))}
            </div>

            {/* Technology Stack Matrix */}
            <div className="stack-box">
              <div className="stack-header">
                <h3>Production Technology Stack</h3>
                <span>Battle-tested frameworks &amp; zero-egress cloud infrastructure</span>
              </div>
              <div className="stack-grid">
                {TECH_STACK.map((col) => (
                  <div className="stack-col" key={col.area}>
                    <strong>{col.icon} {col.area}</strong>
                    <div className="stack-pills">
                      {col.items.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="portfolio" className="portfolio-band">
          <div className="wrap">
            <div className="head">
              <span className="head-tag">Shipped Software &amp; Interactive Demos</span>
              <h2>Recent production work</h2>
              <p>Real systems engineered and deployed by our team. Click any project card to launch the live interactive build full-screen.</p>
            </div>
            <div className="pf-gallery">
              {PROJECTS.map((p, i) => (
                <ProjectCard key={p.id} project={p} onOpen={open} index={i} />
              ))}
            </div>
          </div>
        </section>

        <section id="process">
          <div className="wrap">
            <div className="head">
              <span className="head-tag">Delivery &amp; Engagement</span>
              <h2>Structured engineering from spec to launch</h2>
              <p>Clear weekly milestones, transparent Git repositories, and zero black-box surprises.</p>
            </div>

            <div className="steps">
              {STEPS.map((s) => (
                <div className="step" key={s.n}>
                  <b>{s.n}</b>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>

            <div className="engage-grid">
              {ENGAGEMENTS.map((eng) => (
                <div className={`engage-card${eng.featured ? " featured" : ""}`} key={eng.title}>
                  <div>
                    <span className="engage-tag">{eng.tag}</span>
                    <h3>{eng.title}</h3>
                    <p>{eng.desc}</p>
                    <ul className="engage-list">
                      {eng.items.map((item) => (
                        <li key={item}>
                          <CheckCircle2 size={16} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button type="button" className={eng.featured ? "btn wa-btn" : "btn ghost"} onClick={() => jump("audit")}>
                    Request proposal
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="audit">
          <div className="wrap">
            <div className="cta">
              <div>
                <div className="cta-pill">
                  <MessageSquare size={13} /> Direct WhatsApp Engineering Desk
                </div>
                <h2>Book a technical &amp; architecture call</h2>
                <p>Complete the project brief and submit—your structured requirements are routed immediately to our lead architect on WhatsApp for priority scheduling.</p>

                <div className="trust-points">
                  <div><ShieldCheck size={18} /> <span>NDA-ready consultations &amp; 100% client IP ownership</span></div>
                  <div><Terminal size={18} /> <span>Direct consultation with senior full-stack &amp; AI architects</span></div>
                  <div><CheckCircle2 size={18} /> <span>Written scope, architecture diagram &amp; milestone estimate within 24h</span></div>
                </div>

                <div className="wa-direct-box">
                  <div>
                    <small>Priority WhatsApp Line</small>
                    <strong>+91 78938 28468</strong>
                  </div>
                  <a
                    href={buildWhatsAppUrl("Hello BLuxury Tech, I'd like to discuss a custom software / AI project.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn ghost tog"
                  >
                    Chat directly
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>

              <form className="f" onSubmit={handleSubmit} noValidate>
                <div className="f-row">
                  <div className="fld">
                    <label htmlFor="n">Full name *</label>
                    <input id="n" name="name" type="text" placeholder="Arjun Sharma" autoComplete="name"
                      value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="fld">
                    <label htmlFor="c">Company / Organization</label>
                    <input id="c" name="company" type="text" placeholder="Acme Enterprises" autoComplete="organization"
                      value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
                  </div>
                </div>

                <div className="f-row">
                  <div className="fld">
                    <label htmlFor="e">Work email *</label>
                    <input id="e" name="email" type="email" placeholder="you@company.com" autoComplete="email"
                      value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div className="fld">
                    <label htmlFor="t">Target timeline</label>
                    <select id="t" name="timeline" value={form.timeline}
                      onChange={(e) => setForm((f) => ({ ...f, timeline: e.target.value }))}>
                      {TIMELINE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>

                <div className="fld">
                  <label htmlFor="p">Engineering focus</label>
                  <select id="p" name="focus" value={form.focus}
                    onChange={(e) => setForm((f) => ({ ...f, focus: e.target.value }))}>
                    {FOCUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>

                <div className="fld">
                  <label htmlFor="m">Project brief or current bottleneck</label>
                  <textarea id="m" name="notes" placeholder="Briefly describe your product, users, or workflow you want to automate..."
                    value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
                </div>

                <button type="submit" className="btn wa-btn">
                  <MessageSquare size={17} />
                  Send Brief Directly to WhatsApp
                </button>

                <div className={`msg${msg.error ? " err" : ""}`} role="status">
                  {msg.text}
                  {msg.waUrl && (
                    <a href={msg.waUrl} target="_blank" rel="noopener noreferrer">
                      Open WhatsApp manually
                    </a>
                  )}
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-dot" aria-hidden="true" />
              B LUXURY <i>TECH</i>
            </div>
            <p>
              Bespoke enterprise software engineering, autonomous AI agent pipelines, and custom mobile &amp; web platforms. Operating division of <strong>B Luxury Private Limited</strong>.
            </p>
          </div>

          <div className="footer-col">
            <h4>Solutions</h4>
            <ul>
              <li><a href="#products" onClick={(e) => { e.preventDefault(); jump("products"); }}>AI &amp; CRM Automation</a></li>
              <li><a href="#products" onClick={(e) => { e.preventDefault(); jump("products"); }}>iOS &amp; Android Apps</a></li>
              <li><a href="#products" onClick={(e) => { e.preventDefault(); jump("products"); }}>Enterprise SaaS Portals</a></li>
              <li><a href="#products" onClick={(e) => { e.preventDefault(); jump("products"); }}>Zero-Egress Cloud</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company &amp; Direct Desk</h4>
            <ul>
              <li><a href={buildWhatsAppUrl("Hello BLuxury Tech, I'd like to schedule a technical call.")} target="_blank" rel="noopener noreferrer">WhatsApp (+91 78938 28468)</a></li>
              <li><a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer">BLuxury Social App</a></li>
              <li><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram (@bluxurytech)</a></li>
              <li><a href="#audit" onClick={(e) => { e.preventDefault(); jump("audit"); }}>Book Technical Call</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} B Luxury Private Limited. All rights reserved.</span>
          <span>India · Serving Global Enterprise Clients</span>
        </div>
      </footer>
    </>
  );
}