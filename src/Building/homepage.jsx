// Combined: BLuxuryTech landing page + Portfolio gallery
// Static images imported at top, click to open the real component full-screen.
import { useCallback, useEffect, useRef, useState, Suspense, lazy } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Static image imports (bundled by Vite / Webpack)                  */
/*  Put your screenshots in src/assets/portfolio/                     */
/* ------------------------------------------------------------------ */
// import imgMain      from "../assets/assets/m1.png";
import imgEcomers   from "../assets/assets/m2.png";
import imgEcomWomen from "../assets/assets/m1.png";
import imgRK1       from "../assets/assets/m6.png";
import imgRK2       from "../assets/assets/m3.png";
import imgRK3       from "../assets/assets/m7.png";
import imgRK4       from "../assets/assets/m4.png";
import imgRK5       from "../assets/assets/m5.png";

/* ------------------------------------------------------------------ */
/*  Lazy-load every real project (only used by the full-screen viewer) */
/* ------------------------------------------------------------------ */
const Main      = lazy(() => import("./main1"));
const Ecomers   = lazy(() => import("./ecomers1"));
const EcomWomen = lazy(() => import("./ecomwomen"));
const RK1       = lazy(() => import("./rk1"));
const RK2       = lazy(() => import("./rk2"));
const RK3       = lazy(() => import("./rk3"));
const RK4       = lazy(() => import("./rk4"));
const RK5       = lazy(() => import("./rk5"));

/* ------------------------------------------------------------------ */
/*  PROJECT DATA — image is now the imported module                   */
/* ------------------------------------------------------------------ */
const PROJECTS = [
  
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
    accent: "#16191f",
    image: imgEcomWomen,
    Component: EcomWomen,
  },
  {
    id: "rk1", num: "04",
    title: "ATELIER", subtitle: "Design · Build · Handover",
    category: "Architecture · Construction",
    description: "Three-stage hero with crossfade backdrops and a drag-to-reveal before/after slider showing bare land turning into a finished home.",
    tags: ["React", "Framer"],
    accent: "#D4AF37",
    image: imgRK1,
    Component: RK1,
  },
  {
    id: "rk2", num: "05",
    title: "ASCENTA", subtitle: "3D Cinematic Studio",
    category: "Architecture · 3D",
    description: "Scroll-driven react-three-fiber villa that assembles stage by stage, with night toggle, blueprint wireframe and auto-tour.",
    tags: ["R3F", "Three.js"],
    accent: "#FCD34D",
    image: imgRK2,
    Component: RK2,
  },
  {
    id: "rk3", num: "06",
    title: "VELL ESTATES", subtitle: "Featured Estates 2026",
    category: "Real Estate · Editorial",
    description: "Photo-depth carousel of luxury properties with an amenities rail and a rolling estate counter.",
    tags: ["React"],
    accent: "#2a3a4a",
    image: imgRK3,
    Component: RK3,
  },
  {
    id: "rk4", num: "07",
    title: "MELLI MOTION", subtitle: "3D Animation Academy",
    category: "Education · 3D",
    description: "Three.js mech character with parallax petals and scroll-triggered reveals across five themed sections.",
    tags: ["Three.js", "React"],
    accent: "#5b3bd1",
    image: imgRK4,
    Component: RK4,
  },
  {
    id: "rk5", num: "08",
    title: "HIGO", subtitle: "Eau de Parfum 2026",
    category: "Beauty · E-commerce",
    description: "Parallax fig-fruit hero, sensory note selector, size picker and add-to-bag flow for a small-batch fragrance.",
    tags: ["Framer Motion", "React"],
    accent: "#D4AF37",
    image: imgRK5,
    Component: RK5,
  },
 
];

/* ------------------------------------------------------------------ */
/*  Card aspect ratio — 1280 × 800 (16:10)                            */
/* ------------------------------------------------------------------ */
const PREVIEW_W = 1280;
const PREVIEW_H = 800;
const PREVIEW_ASPECT = `${PREVIEW_W} / ${PREVIEW_H}`;

/* ------------------------------------------------------------------ */
/*  Logging                                                           */
/* ------------------------------------------------------------------ */
const PF_LOG =
  typeof import.meta !== "undefined" && import.meta.env && import.meta.env.DEV
    ? (...args) => console.info("%c[PF]", "color:#16A35A;font-weight:700", ...args)
    : (...args) => console.info("%c[PF]", "color:#16A35A;font-weight:700", ...args);

/* ------------------------------------------------------------------ */
/*  Loading shimmer                                                   */
/* ------------------------------------------------------------------ */
function LoadingShimmer({ accent }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #08080a 0%, #0d0d12 50%, #08080a 100%)" }}
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

/* ------------------------------------------------------------------ */
/*  Card image                                                        */
/*  - Preloads the imported URL to detect load / error                */
/*  - If image is taller than the card, hover pans top → bottom       */
/* ------------------------------------------------------------------ */
function CardImage({ project, engaged }) {
  const [status, setStatus] = useState("loading"); // loading | ok | error
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
      PF_LOG(`card:image-loaded ${project.id} (${img.naturalWidth}×${img.naturalHeight}${pannable ? ", pannable" : ""})`);
    };
    img.onerror = () => {
      if (cancelled) return;
      setStatus("error");
      PF_LOG(`card:image-missing ${project.id} → ${project.image}`);
    };
    img.src = project.image;

    return () => { cancelled = true; };
  }, [project.image, project.id]);

  if (status === "loading") {
    return <LoadingShimmer accent={project.accent} />;
  }

  if (status === "error") {
    return (
      <div
        className="absolute inset-0 grid place-items-center"
        style={{ background: `radial-gradient(circle at 50% 50%, ${project.accent}20, #08080a 70%)` }}
      >
        <div className="text-center px-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.24em]" style={{ color: project.accent }}>
            {project.num}
          </div>
          <div className="mt-2 text-lg font-semibold text-white">{project.title}</div>
          <div className="mt-1 text-[11px] text-white/40">{project.subtitle}</div>
          <div className="mt-3 text-[9px] font-mono uppercase tracking-[0.2em] text-white/25">
            image missing
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 bg-[#08080a]"
      style={{
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

/* ------------------------------------------------------------------ */
/*  Project card                                                      */
/* ------------------------------------------------------------------ */
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
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e12] text-left transition-all duration-500 hover:-translate-y-1 hover:border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      style={{
        boxShadow: "0 20px 60px -30px rgba(0,0,0,.9)",
        animation: `pf-fade .9s cubic-bezier(.16,1,.3,1) ${index * 60}ms backwards`,
      }}
      aria-label={`Open ${project.title}`}
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: PREVIEW_ASPECT }}>
        <CardImage project={project} engaged={engaged} />

        <span className="absolute left-4 top-4 z-10 rounded-full bg-black/45 px-2 py-0.5 font-mono text-[10px] tracking-[0.2em] text-white/70 backdrop-blur">
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
      <div className="flex flex-col gap-3 p-5">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.24em]" style={{ color: project.accent }}>
            {project.category}
          </div>
          <h3 className="mt-1.5 text-lg font-semibold leading-tight text-white">{project.title}</h3>
          <p className="mt-0.5 text-xs text-white/50">{project.subtitle}</p>
        </div>
        <p className="line-clamp-2 text-xs leading-relaxed text-white/55">{project.description}</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span key={t} className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/55">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Full-screen project viewer                                        */
/* ------------------------------------------------------------------ */
function ProjectViewer({ project, onClose }) {
  useEffect(() => {
    const root = document.getElementById("root");
    if (root) root.classList.add("viewing-project");
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      if (root) root.classList.remove("viewing-project");
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

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
/*  Landing page CSS                                                  */
/* ------------------------------------------------------------------ */
const LANDING_CSS = `
:root{--bg:#fff;--fg:#0a0a0a;--mut:#4b5563;--green:#0B6E3C;--btn:#0B6E3C;--card:rgba(255,255,255,.72);--line:rgba(10,10,10,.15);--hbg:rgba(255,255,255,.82);box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
:root[data-theme="dark"]{--bg:#000;--fg:#f5f5f5;--mut:#a3a3a3;--green:#16A35A;--card:rgba(255,255,255,.05);--line:rgba(255,255,255,.15);--hbg:rgba(0,0,0,.72)}
html{scroll-padding-top:calc(env(safe-area-inset-top,0px) + 84px);scroll-behavior:smooth}
*,*::before,*::after{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font-family:Manrope,system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.6;transition:background .4s,color .4s}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);background:var(--hbg);backdrop-filter:blur(14px);z-index:30}
#scene{position:fixed;inset:0;width:100%;height:100%;z-index:0;display:block}
main,header,footer{position:relative;z-index:1}
h1,h2,h3{font-family:Syne,"Helvetica Neue",Arial,sans-serif;line-height:1.05;margin:0}
a{color:inherit;text-decoration:none}
header{position:sticky;top:env(safe-area-inset-top,0px);z-index:40;background:var(--hbg);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
.bar{max-width:1200px;margin:0 auto;padding:0 20px;height:64px;display:flex;align-items:center;justify-content:space-between;gap:16px}
.logo{font-family:Syne,sans-serif;font-weight:800;font-size:1.05rem;white-space:nowrap}
.logo i{font-style:normal;color:var(--green)}
nav{display:flex;gap:26px;font-size:.92rem}
nav a{color:var(--mut);transition:color .2s}nav a:hover{color:var(--fg)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;cursor:pointer;font:600 .95rem Manrope,sans-serif;padding:13px 26px;border-radius:999px;background:var(--btn);color:#fff;transition:transform .2s,box-shadow .2s}
.btn:hover{transform:translateY(-2px);box-shadow:0 10px 36px -8px var(--green)}
.btn.ghost{background:transparent;color:var(--fg);border:1px solid var(--line);box-shadow:none}
.btn.ghost:hover{border-color:var(--fg)}
.tog{padding:9px 16px;font-size:.82rem}
:focus-visible{outline:2px solid var(--green);outline-offset:3px}
.wrap{max-width:1200px;margin:0 auto;padding:0 20px}
.hero{min-height:calc(100svh - 64px);display:flex;align-items:center}
.hero h1{font-size:clamp(2.5rem,7.2vw,5.6rem);font-weight:800;max-width:11ch;letter-spacing:-.02em}
.hero p{color:var(--mut);font-size:1.15rem;max-width:34rem;margin:26px 0 34px}
.hero .row{display:flex;flex-wrap:wrap;gap:12px}
.hint{position:absolute;bottom:24px;left:20px;font-size:.8rem;color:var(--mut)}
section{padding:110px 0}
.head{max-width:40rem;margin-bottom:48px}
.head h2{font-size:clamp(2rem,4.6vw,3.4rem);font-weight:800;letter-spacing:-.015em}
.head p{color:var(--mut);margin:14px 0 0}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
.card{position:relative;padding:34px 30px 30px;border:1px solid var(--line);border-radius:22px;background:var(--card);backdrop-filter:blur(16px);transform-style:preserve-3d;transition:transform .25s ease-out,border-color .25s,box-shadow .25s;will-change:transform}
.card:hover{border-color:var(--green);box-shadow:0 30px 60px -30px var(--green)}
.card .ic{width:54px;height:54px;border-radius:14px;display:grid;place-items:center;background:var(--green);color:#fff;margin-bottom:22px;transform:translateZ(46px);box-shadow:0 14px 28px -10px var(--green)}
.card h3{font-size:1.4rem;transform:translateZ(26px);margin-bottom:10px}
.card p{color:var(--mut);margin:0;transform:translateZ(12px)}

.portfolio-band{background:#08080a;padding:110px 0;color:#fff}
.portfolio-band .head h2{color:#fff}
.portfolio-band .head p{color:rgba(255,255,255,.55)}
.pf-gallery{display:grid;grid-template-columns:1fr;gap:20px;font-family:Manrope,system-ui,sans-serif}
@media (min-width:640px){.pf-gallery{grid-template-columns:repeat(2,1fr)}}
@media (min-width:1024px){.pf-gallery{grid-template-columns:repeat(3,1fr)}}

#root.viewing-project{display:block !important;max-width:none !important;padding:0 !important;margin:0 !important;text-align:left !important;width:100% !important;min-height:100vh !important}

.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;counter-reset:s}
.step{padding:28px 24px;border-top:2px solid var(--green);background:var(--card);backdrop-filter:blur(16px);border-radius:0 0 18px 18px}
.step b{font-family:Syne,sans-serif;font-size:2.2rem;color:var(--green);display:block;line-height:1;margin-bottom:14px}
.step h3{font-size:1.2rem;margin-bottom:8px}.step p{color:var(--mut);margin:0;font-size:.95rem}
.cta{border:1px solid var(--line);border-radius:28px;padding:clamp(28px,5vw,64px);background:var(--card);backdrop-filter:blur(18px);display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center}
.cta h2{font-size:clamp(1.9rem,4vw,3rem);font-weight:800}
.cta p{color:var(--mut)}
.f{display:grid;gap:16px}
.f .fld{display:block;min-width:0}
.f label{display:block;font-size:.74rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--mut);margin-bottom:8px}
.f input,.f select{width:100%;max-width:100%;padding:14px 16px;border-radius:12px;border:1px solid var(--line);background:transparent;color:var(--fg);font:500 .95rem Manrope,sans-serif}
.f select option{background:var(--bg);color:var(--fg)}
.msg{font-size:.9rem;min-height:1.3em;color:var(--green)}
.msg.err{color:#d93a3a}
footer{border-top:1px solid var(--line);padding:30px 20px;text-align:center;color:var(--mut);font-size:.85rem;background:var(--hbg);backdrop-filter:blur(14px)}

@keyframes pf-fade{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}

@media (max-width:900px){
  .grid,.cta{grid-template-columns:1fr}
  .steps{grid-template-columns:1fr 1fr}
  .hero{align-items:flex-end;padding-bottom:90px}
  .bar{height:auto;min-height:64px;padding:10px 20px;flex-wrap:wrap;row-gap:10px}
  nav{order:3;width:100%;display:flex;gap:22px;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none;white-space:nowrap;font-size:.88rem;padding-bottom:2px}
  nav::-webkit-scrollbar{display:none}
  nav a{flex:none}
}
@media (max-width:520px){
  .steps{grid-template-columns:1fr}
  .hide-sm{display:none}
  section{padding:80px 0}
  .portfolio-band{padding:80px 0}
}
@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  .card,.btn{transition:none}
  .pf-fade,.group{animation:none !important}
}
`;

/* ------------------------------------------------------------------ */
/*  Landing page data                                                 */
/* ------------------------------------------------------------------ */
const PRODUCTS = [
  { title: "Business and CRM automation", body: "WhatsApp and email enquiries are captured, documents are read automatically, and every lead lands in your CRM already followed up.",
    icon: <><circle cx="6" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><path d="M9 6h4a4 4 0 0 1 4 4v5" /></> },
  { title: "iOS and Android apps", body: "Polished apps that feel native on every phone, with photos and video syncing across devices the moment they are captured.",
    icon: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></> },
  { title: "Enterprise web portals", body: "Custom SaaS dashboards built for heavy daily use. Thousands of records and users stay fast, clear and secure.",
    icon: <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8M12 18v3M7 13l3-3 3 2 4-5" /></> },
  { title: "Zero-egress cloud", body: "Cloudflare R2 storage, Render hosting and MongoDB Atlas data, arranged so you never pay to access your own files.",
    icon: <path d="M7 18a4 4 0 0 1-.6-7.96A6 6 0 0 1 18 9a4.5 4.5 0 0 1 0 9z" /> },
];

const STEPS = [
  { n: "1", title: "Neural scoping", body: "We map your operations and agree the outcome we will measure." },
  { n: "2", title: "Architecture design", body: "Agent network, app flows and data layout are signed off before building." },
  { n: "3", title: "Rapid sprints", body: "Working builds arrive every week so you review real screens." },
  { n: "4", title: "Containerized launch", body: "Packaged, tested and released with monitoring on from day one." },
];

const FOCUS_OPTIONS = ["Automation pipelines", "Mobile apps", "Web portal or SaaS", "Cloud cost reduction"];
const NAV_ITEMS = [["products", "Products"], ["portfolio", "Portfolio"], ["process", "Process"], ["audit", "System audit"]];

/* ------------------------------------------------------------------ */
/*  Three.js loader                                                   */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  ThreeScene                                                        */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Theme                                                             */
/* ------------------------------------------------------------------ */
const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  try { return localStorage.getItem("blt-theme") || "light"; } catch { return "light"; }
};

/* ------------------------------------------------------------------ */
/*  Main combined component                                           */
/* ------------------------------------------------------------------ */
export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [activeId, setActiveId] = useState(null);
  const savedScroll = useRef(0);

  const [form, setForm] = useState({ name: "", email: "", focus: FOCUS_OPTIONS[0] });
  const [msg, setMsg] = useState({ text: "", error: false });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("blt-theme", theme); } catch { /* ignore */ }
    const ref = ThreeScene._colorsRef;
    if (ref && ref.current) ref.current();
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const open = useCallback((id) => {
    PF_LOG(`open project ${id}`);
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
      PF_LOG(`deep-link ${hash}`);
      window.history.pushState({ project: hash }, "", `#${hash}`);
      setActiveId(hash);
      requestAnimationFrame(() => window.scrollTo(0, 0));
    }
    const onPopState = (e) => {
      if (e.state?.project) {
        PF_LOG(`history:open ${e.state.project}`);
        setActiveId(e.state.project);
        requestAnimationFrame(() => window.scrollTo(0, 0));
      } else {
        PF_LOG(`history:back to gallery`);
        setActiveId(null);
        const y = savedScroll.current;
        if (y > 0) { savedScroll.current = 0; requestAnimationFrame(() => window.scrollTo(0, y)); }
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const jump = useCallback((id) => {
    PF_LOG(`jump to #${id}`);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
      setMsg({ text: "Enter your name and a valid work email.", error: true });
      return;
    }
    PF_LOG(`audit form submitted`);
    setMsg({ text: `Thanks ${name.split(" ")[0]}. We will reply to ${email} within one business day.`, error: false });
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
          <a href="#top" className="logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            B LUXURY <i>TECH</i>
          </a>
          <nav>
            {NAV_ITEMS.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); jump(id); }}>{label}</a>
            ))}
          </nav>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button type="button" className="btn ghost tog" onClick={toggleTheme} aria-label="Switch theme">
              {theme === "dark" ? "White mode" : "Black mode"}
            </button>
            <button type="button" className="btn hide-sm" onClick={() => jump("audit")}>Start your audit</button>
          </div>
        </div>
      </header>

      <main id="top">
        <div className="hero">
          <div className="wrap" style={{ width: "100%" }}>
            <h1>Autonomous AI agents built for enterprise.</h1>
            <p>We engineer self-refining agent networks, cross-platform mobile apps and scalable web platforms that take repetitive work off your team.</p>
            <div className="row">
              <button type="button" className="btn" onClick={() => jump("audit")}>Start your audit</button>
              <button type="button" className="btn ghost" onClick={() => jump("products")}>See what we build</button>
            </div>
          </div>
          <div className="hint">Move your cursor and scroll to turn the model</div>
        </div>

        <section id="products">
          <div className="wrap">
            <div className="head">
              <h2>Four systems that run your business</h2>
              <p>Each one is designed around a result you can measure: fewer manual hours, faster delivery, lower running costs.</p>
            </div>
            <div className="grid">
              {PRODUCTS.map((p) => (
                <div className="card tilt" key={p.title}>
                  <div className="ic">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {p.icon}
                    </svg>
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="portfolio" className="portfolio-band">
          <div className="wrap">
            <div className="head">
              <h2>Recent work</h2>
              <p>Nine systems we shipped and still run. Click a card to open the live page.</p>
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
              <h2>From first call to launch in nine weeks</h2>
              <p>Four stages, each with something you can review.</p>
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
          </div>
        </section>

        <section id="audit">
          <div className="wrap">
            <div className="cta">
              <div>
                <h2>Get a free system audit</h2>
                <p>Tell us what slows your team down. We will review your workflows, apps and cloud costs and send back a clear plan.</p>
              </div>
              <form className="f" onSubmit={handleSubmit} noValidate>
                <div className="fld">
                  <label htmlFor="n">Full name</label>
                  <input id="n" name="name" type="text" autoComplete="name"
                    value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="fld">
                  <label htmlFor="e">Work email</label>
                  <input id="e" name="email" type="email" autoComplete="email"
                    value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="fld">
                  <label htmlFor="p">Product focus</label>
                  <select id="p" name="focus" value={form.focus}
                    onChange={(e) => setForm((f) => ({ ...f, focus: e.target.value }))}>
                    {FOCUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <button type="submit" className="btn">Request audit</button>
                <div className={`msg${msg.error ? " err" : ""}`} role="status">{msg.text}</div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer>B Luxury Tech is the operating entity of B Luxury Private Limited.</footer>
    </>
  );
}