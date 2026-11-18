import { useState, useEffect, useRef } from 'react';

/* ============================================================================
   DATA
   ============================================================================ */

const MODELS =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_042056_1a704ff7-b0e5-4a9f-bbda-62392b819fb6.png&w=3840&q=85';
const PIECES =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_042057_080e85b0-b4aa-4072-8eb9-2304c7baf42b.png&w=2400&q=85';

const LOOKS = [[12,176],[178,330],[331,470],[476,633],[634,767],[767,956]];
const Y0 = 48, Y1 = 496, FIRST = 15;

const ITEMS = [
  [26,224,28,214,'Feather Jacket','$2,900'],
  [304,412,22,236,'Satin Wide Leg Trousers','$1,450'],
  [530,666,12,242,'Pleated Dress','$2,200'],
  [752,922,100,146,'Gold Waist Belt','$420'],
  [70,176,246,466,'Satin Trench Dress','$2,350'],
  [294,422,294,432,'Top Handle Bag','$980'],
  [508,688,240,452,'Billow Sleeve Blouse','$860'],
  [780,890,252,466,'Tie Waist Trousers','$740'],
  [64,178,484,698,'Powder Long Coat','$1,980'],
  [316,396,482,698,'Ivory Straight Trousers','$690'],
  [530,672,508,682,'Sculpted Ruffle Top','$1,120'],
  [754,916,484,700,'Pleated Maxi Skirt','$1,340'],
];

// depth stops from d = -1 (leaving past rail) to d = 5 (arriving out of haze)
const KX = [1.2,.744,.496,.346,.235,.15,.085];
const KF = [1.14,.89,.777,.704,.651,.616,.59];
const KH = [1.18,.832,.574,.436,.334,.258,.19];
const KB = [0,0,1.5,4,8,12,17];
const KO = [1,1,1,1,.86,.5,0];

const N = LOOKS.length;
const wrap  = (x, n) => ((x % n) + n) % n;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const U = (n) => `calc(${n} * var(--u))`;
const WIDE = { fontFamily: 'Michroma, sans-serif', textTransform: 'uppercase' };

/* sprite cropper — outer svg with viewBox holding a nested svg */
function Crop({ href, x0, y0, w, h, sheetW, sheetH }) {
  const vb = `${x0} ${y0} ${w} ${h}`;
  return (
    <svg viewBox={vb} aria-hidden="true">
      <svg x={x0} y={y0} width={w} height={h} viewBox={vb}>
        <image href={href} width={sheetW} height={sheetH} />
      </svg>
    </svg>
  );
}

/* ============================================================================
   COMPONENT
   ============================================================================ */

export default function MaisonVell() {
  const [cart,      setCart]      = useState(0);
  const [favorites, setFavorites] = useState({});
  const [loaded,    setLoaded]    = useState(false);

  const rootRef  = useRef(null);
  const stageRef = useRef(null);
  const railRef  = useRef(null);
  const ringRef  = useRef(null);
  const rollRef  = useRef(null);
  const modelRefs = useRef([]);
  const cardRefs  = useRef([]);

  // All mutable animation state lives here — nothing here triggers React re-renders
  const S = useRef({
    p: 0, target: 0, last: 0,
    down: false, sx: 0, st: 0, moved: 0,
    mx: 0, my: 0, cx: 0, cy: 0,
    wheelT: null, dirty: true,
    W: 0, H: 0, base: 0, cardS: 0, side: false,
    calm: false,
  });

  /* -- body overflow lock (matches spec) -- */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.style.background = '#fff';
    return () => {
      document.body.style.overflow = prev;
      document.body.style.background = '';
    };
  }, []);

  /* -- reduced motion -- */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    S.current.calm = mq.matches;
    const h = (e) => { S.current.calm = e.matches; };
    mq.addEventListener?.('change', h);
    return () => mq.removeEventListener?.('change', h);
  }, []);

  /* -- size models & cards -- */
  const sizeRef = useRef(null);
  useEffect(() => {
    const size = () => {
      const s = S.current;
      const stage = stageRef.current;
      const rail  = railRef.current;
      if (!stage || !rail) return;

      s.W = stage.clientWidth;
      s.H = stage.clientHeight;
      s.base = s.H * 1.2;
      s.side = window.innerWidth <= 820;

      LOOKS.forEach(([a, b], i) => {
        const el = modelRefs.current[i];
        if (!el) return;
        const r = (b - a) / (Y1 - Y0);
        el.style.width  = s.base * r + 'px';
        el.style.height = s.base + 'px';
      });

      s.cardS = s.side ? 160 : rail.clientHeight / 3;
      cardRefs.current.forEach((el) => {
        if (!el) return;
        el.style.height = s.side ? '100%' : s.cardS + 'px';
      });

      s.dirty = true;
    };
    sizeRef.current = size;
    size();
    window.addEventListener('resize', size);
    return () => window.removeEventListener('resize', size);
  }, []);

  /* -- re-size once sheets have decoded -- */
  useEffect(() => { if (loaded) sizeRef.current?.(); }, [loaded]);

  /* -- animation loop -- */
  useEffect(() => {
    const s = S.current;

    const paint = () => {
      // models
      LOOKS.forEach(([a, b], i) => {
        const el = modelRefs.current[i];
        if (!el) return;
        let d = wrap(i - s.p, N);
        if (d > N - 1) d -= N;
        const k = clamp(d + 1, 0, 6);
        const lo = Math.floor(k), hi = Math.min(6, lo + 1), t = k - lo;
        const mix = (A) => A[lo] + (A[hi] - A[lo]) * t;
        const h = mix(KH) * s.H;
        const sc = h / s.base;
        const w  = h * ((b - a) / (Y1 - Y0));
        const x  = mix(KX) * s.W - w / 2;
        const y  = mix(KF) * s.H - h;
        el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${sc.toFixed(4)})`;
        const f = mix(KB) / sc;
        const fs = f < 0.2 ? 'none' : `blur(${f.toFixed(1)}px)`;
        const o = mix(KO).toFixed(3);
        if (fs !== el._fs) { el._fs = fs; el.style.filter = fs; }
        if (o  !== el._o)  { el._o  = o;  el.style.opacity = o; }
        el.style.zIndex = 100 - Math.round(d * 10);
      });

      // cards
      const all = s.cardS * ITEMS.length;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        let y = wrap(i * s.cardS - s.p * 2 * s.cardS, all);
        if (y > all - s.cardS) y -= all;
        el.style.transform = s.side
          ? `translate3d(${y.toFixed(1)}px,0,0)`
          : `translate3d(0,${y.toFixed(1)}px,0)`;
      });

      // roll
      if (rollRef.current && rollRef.current.firstChild) {
        const lineH = rollRef.current.firstChild.getBoundingClientRect().height;
        rollRef.current.style.transform = `translate3d(0,${(-wrap(s.p, N) * lineH).toFixed(1)}px,0)`;
      }
    };

    const frame = (now) => {
      const dt = Math.min(50, now - s.last) || 16;
      s.last = now;
      const was = s.p;

      if (s.calm) s.p = s.target;
      else s.p += (s.target - s.p) * (1 - Math.exp(-dt * 0.0072));
      if (Math.abs(s.target - s.p) < 0.0004) s.p = s.target;

      if (s.p !== was || s.dirty) { s.dirty = false; paint(); }

      s.cx += (s.mx - s.cx) * 0.32;
      s.cy += (s.my - s.cy) * 0.32;
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate3d(${s.cx.toFixed(1)}px,${s.cy.toFixed(1)}px,0)`;
      }

      raf = requestAnimationFrame(frame);
    };

    let raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* -- pointer / wheel / key interactions -- */
  useEffect(() => {
    const s = S.current;
    const stage = stageRef.current;
    const ring  = ringRef.current;
    if (!stage) return;

    const PULL = () => Math.max(150, s.W * 0.2);

    const onEnter = (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = stage.getBoundingClientRect();
      s.mx = s.cx = e.clientX - r.left;
      s.my = s.cy = e.clientY - r.top;
      ring?.classList.add('show');
    };
    const onLeave = () => ring?.classList.remove('show');

    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      s.mx = e.clientX - r.left;
      s.my = e.clientY - r.top;
      if (!s.down) return;
      const dx = e.clientX - s.sx;
      s.moved = Math.max(s.moved, Math.abs(dx));
      s.target = s.st + dx / PULL();
    };

    const onDown = (e) => {
      if (e.target.closest('a')) return;
      s.down = true;
      s.sx = e.clientX;
      s.st = s.target;
      s.moved = 0;
      try { stage.setPointerCapture(e.pointerId); } catch {}
      ring?.classList.add('drag');
    };

    const onRelease = (e) => {
      if (!s.down) return;
      s.down = false;
      ring?.classList.remove('drag');
      if (s.moved < 6) {
        const hit = document.elementsFromPoint(e.clientX, e.clientY)
          .find((x) => x.classList && x.classList.contains('m'));
        if (hit) {
          let d = wrap(+hit.dataset.i - s.target, N);
          d = Math.round(d);
          if (d > 0 && d < N) s.target = Math.round(s.target) + d;
        }
      } else {
        s.target = Math.round(s.target);
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      s.target += clamp(e.deltaY + e.deltaX, -120, 120) / 420;
      clearTimeout(s.wheelT);
      s.wheelT = setTimeout(() => { s.target = Math.round(s.target); }, 150);
    };

    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        s.target = Math.round(s.target) + 1;
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        s.target = Math.round(s.target) - 1;
      }
    };

    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointerup', onRelease);
    stage.addEventListener('pointercancel', onRelease);
    stage.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);

    return () => {
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerdown', onDown);
      stage.removeEventListener('pointerup', onRelease);
      stage.removeEventListener('pointercancel', onRelease);
      stage.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  /* -- decode both sheets, then reveal -- */
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      [MODELS, PIECES].map((u) => {
        const img = new Image();
        img.src = u;
        return img.decode().catch(() => {});
      })
    )
      .then(() => document.fonts?.ready || Promise.resolve())
      .then(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, []);

  const toggleFav = (i) => setFavorites((p) => ({ ...p, [i]: !p[i] }));

  /* ========================================================================
     RENDER
     ======================================================================== */

  return (
    <>
      {/* Google Fonts — required by the spec */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Michroma&display=swap"
        rel="stylesheet"
      />

      {/* Scoped styles — the --u unit system + pseudo-elements Tailwind can't express */}
      <style>{`
        .mv-root {
          --u: min(calc(100vw / 1600), calc(100vh / 900));
          --ink: #16191f;
          --mid: #737b86;
          --dim: #a4adb8;
        }
        @media (max-width: 820px) { .mv-root { --u: 1px; } }

        .mv-root .m svg { display: block; position: relative; width: 100%; height: 100%; }

        /* floor shadow */
        .mv-root .m::before {
          content: '';
          position: absolute; left: 8%; right: 8%; bottom: -1.6%; height: 3.6%;
          border-radius: 50%;
          background: radial-gradient(closest-side, rgba(70,85,105,.24), transparent);
        }

        /* plus button cross */
        .mv-root .add::before,
        .mv-root .add::after {
          content: '';
          position: absolute; left: 50%; top: 50%;
          width: calc(15 * var(--u)); height: 1.5px;
          margin: -0.75px 0 0 calc(-7.5 * var(--u));
          background: var(--ink);
        }
        .mv-root .add::after { transform: rotate(90deg); }
        .mv-root .add:hover { transform: rotate(90deg); }

        /* favourite fill */
        .mv-root .fav[aria-pressed="true"] svg {
          fill: #d8a7a0; stroke: #b98179;
        }

        /* ring cursor states */
        .mv-root .ring.show { opacity: 1; }
        .mv-root .ring.drag {
          width: calc(84 * var(--u));
          height: calc(34 * var(--u));
          margin: calc(-17 * var(--u)) 0 0 calc(-42 * var(--u));
        }

        /* wait cover */
        .mv-root .wait {
          transition: opacity .5s;
        }
        .mv-root .wait.gone { opacity: 0; }

        /* mobile */
        @media (max-width: 820px) {
          .mv-root .ring { display: none; }
          .mv-root .stage, .mv-root .m { cursor: auto !important; }
        }

        .mv-root button:focus-visible,
        .mv-root a:focus-visible {
          outline: 2px solid var(--ink); outline-offset: 3px;
        }
      `}</style>

      <div
        ref={rootRef}
        className="mv-root h-[100svh] min-h-[520px] grid grid-rows-[auto_1fr] bg-white"
        style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#16191f', WebkitFontSmoothing: 'antialiased' }}
      >
        {/* ================= HEADER ================= */}
        <header className="relative z-[5] bg-white" style={{ padding: `${U(20)} ${U(46)} ${U(15)}` }}>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center max-[820px]:grid-cols-[1fr_auto]">
            <a href="#" aria-label="Maison Vell"
               className="text-[#16191f]"
               style={{ ...WIDE, fontSize: U(15.5), letterSpacing: '.2em' }}>
              Maison Vell
            </a>

            <nav aria-label="Sections"
                 className="flex gap-[calc(48*var(--u))] text-[#a4adb8] max-[820px]:hidden"
                 style={{ ...WIDE, fontSize: U(14.5), letterSpacing: '.14em' }}>
              <a href="#" aria-current="page" className="text-[#16191f]">Runway</a>
              <a href="#" className="hover:text-[#16191f] transition-colors">The Maison</a>
              <a href="#" className="hover:text-[#16191f] transition-colors">Lookbook</a>
              <a href="#" className="hover:text-[#16191f] transition-colors">Shop</a>
            </nav>

            <div className="justify-self-end flex items-center gap-[calc(22*var(--u))]"
                 style={{ ...WIDE, fontSize: U(9.5), letterSpacing: '.12em' }}>
              <a href="#" className="max-[820px]:hidden">Login</a>
              <a href="#" aria-label="Search" className="max-[820px]:hidden">
                <svg width={U(17)} height={U(17)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="10.5" cy="10.5" r="6.5" />
                  <path d="m15.5 15.5 5 5" />
                </svg>
              </a>
              <a href="#" aria-label="Saved" className="max-[820px]:hidden">
                <svg width={U(17)} height={U(17)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 20S3.5 15 3.5 9A4.6 4.6 0 0 1 12 6.6 4.6 4.6 0 0 1 20.5 9C20.5 15 12 20 12 20Z" />
                </svg>
              </a>
              <a href="#" aria-label="Bag" className="max-[820px]:hidden">
                <svg width={U(17)} height={U(17)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 8h14l1 13H4Z" />
                  <path d="M9 10V6a3 3 0 0 1 6 0v4" />
                </svg>
              </a>
              <a href="#">Cart ({cart})</a>
            </div>
          </div>

          <nav aria-label="Departments"
               className="flex justify-center gap-[calc(60*var(--u))] max-[820px]:hidden"
               style={{ ...WIDE, marginTop: U(17), fontSize: U(9.5), letterSpacing: '.14em' }}>
            <a href="#" className="hover:text-[#737b86] transition-colors">Collections</a>
            <a href="#" className="hover:text-[#737b86] transition-colors">Clothing</a>
            <a href="#" className="hover:text-[#737b86] transition-colors">Lookbook</a>
            <a href="#" className="hover:text-[#737b86] transition-colors">Beauty</a>
            <a href="#" className="hover:text-[#737b86] transition-colors">Accessories</a>
            <a href="#" className="hover:text-[#737b86] transition-colors">Our World</a>
          </nav>
        </header>

        {/* ================= MAIN ================= */}
        <main className="relative grid grid-cols-[1fr_calc(372*var(--u))] min-h-0 max-[820px]:grid-cols-1 max-[820px]:grid-rows-[1fr_190px]">

          {/* ---------- STAGE ---------- */}
          <section
            ref={stageRef}
            tabIndex={0}
            aria-label="Runway looks. Drag, scroll or use the arrow keys to change look."
            className="stage relative overflow-hidden min-w-0 touch-pan-y select-none"
            style={{
              cursor: 'none',
              background:
                'linear-gradient(transparent 60%, rgba(255,255,255,.72) 100%),' +
                'linear-gradient(90deg, #f1f5fa 0%, #e7eff6 38%, #eef4f9 62%, #f6f9fc 100%)',
            }}
          >
            {/* models */}
            <div className="absolute inset-0">
              {LOOKS.map(([x0, x1], i) => (
                <div
                  key={i}
                  ref={(el) => (modelRefs.current[i] = el)}
                  data-i={i}
                  className="m absolute left-0 top-0"
                  style={{
                    transformOrigin: '0 0',
                    willChange: 'transform, filter',
                    cursor: 'none',
                  }}
                >
                  <Crop
                    href={MODELS}
                    x0={x0} y0={Y0}
                    w={x1 - x0} h={Y1 - Y0}
                    sheetW={960} sheetH={540}
                  />
                </div>
              ))}
            </div>

            {/* intro */}
            <div
              className="absolute z-[2] pointer-events-none"
              style={{ left: U(46), top: U(36), width: U(390) }}
            >
              <h2 style={{ ...WIDE, fontWeight: 400, fontSize: U(22), lineHeight: 1.2, letterSpacing: '.16em', whiteSpace: 'nowrap' }}>
                Spring Summer 2027
              </h2>
              <p
                className="max-[820px]:hidden"
                style={{ marginTop: U(16), fontSize: U(14), lineHeight: 1.62, letterSpacing: '.012em', color: '#737b86' }}
              >
                A study in softness and strength. The new season collection from Maison Vell blends delicate textures and modern silhouettes, crafted for a more beautiful tomorrow.
              </p>
            </div>

            {/* look number + shop link */}
            <div className="absolute z-[2]" style={{ left: U(46), bottom: U(44) }}>
              <div
                aria-live="polite"
                className="flex"
                style={{
                  ...WIDE,
                  fontSize: U(29),
                  lineHeight: U(38),
                  letterSpacing: '.14em',
                  gap: '.5em',
                  pointerEvents: 'none',
                }}
              >
                <span>Look</span>
                <span className="block overflow-hidden" style={{ height: U(38) }}>
                  <span ref={rollRef} className="block" style={{ willChange: 'transform' }}>
                    {Array.from({ length: N + 1 }).map((_, i) => (
                      <b key={i} className="block font-normal" style={{ height: U(38) }}>
                        {FIRST + (i % N)}
                      </b>
                    ))}
                  </span>
                </span>
              </div>
              <a
                href="#"
                className="inline-block"
                style={{
                  ...WIDE,
                  marginTop: U(13),
                  fontSize: U(9.5),
                  letterSpacing: '.14em',
                  paddingBottom: U(4),
                  borderBottom: '1px solid currentColor',
                }}
              >
                Shop the look
              </a>
            </div>

            {/* ring cursor */}
            <div
              ref={ringRef}
              className="ring absolute z-[4] pointer-events-none opacity-0"
              style={{
                left: 0, top: 0,
                width: U(46), height: U(46),
                margin: `${U(-23)} 0 0 ${U(-23)}`,
                border: `${U(2.5)} solid #16191f`,
                borderRadius: '99px',
                transition:
                  'width .22s cubic-bezier(.2,.8,.2,1),' +
                  'height .22s cubic-bezier(.2,.8,.2,1),' +
                  'margin .22s cubic-bezier(.2,.8,.2,1),' +
                  'opacity .2s',
              }}
            />
          </section>

          {/* ---------- PRODUCT RAIL ---------- */}
          <aside
            ref={railRef}
            aria-label="Pieces in this look"
            className="relative overflow-hidden bg-[#f3f6fa] min-h-0"
          >
            {ITEMS.map(([a, b, c, d, name, price], i) => (
              <article
                key={i}
                ref={(el) => (cardRefs.current[i] = el)}
                className={`card absolute left-0 top-0 flex flex-col max-[820px]:w-[160px] max-[820px]:p-3 ${i % 2 ? 'bg-white' : 'bg-[#f3f6fa]'}`}
                style={{ width: '100%', padding: `${U(18)} ${U(24)}`, willChange: 'transform' }}
              >
                <button
                  className="fav absolute z-[1]"
                  style={{ left: U(22), top: U(18), width: U(22), height: U(22), color: '#16191f' }}
                  aria-pressed={!!favorites[i]}
                  aria-label={`Save ${name}`}
                  onClick={() => toggleFav(i)}
                >
                  <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, transition: 'fill .2s' }}>
                    <path d="M12 20S3.5 15 3.5 9A4.6 4.6 0 0 1 12 6.6 4.6 4.6 0 0 1 20.5 9C20.5 15 12 20 12 20Z" />
                  </svg>
                </button>

                <span className="flex-1 min-h-0 block">
                  <Crop href={PIECES} x0={a} y0={c} w={b - a} h={d - c} sheetW={960} sheetH={720} />
                </span>

                <div className="grid grid-cols-[1fr_auto] items-end" style={{ marginTop: U(8) }}>
                  <h3 style={{ ...WIDE, fontWeight: 400, fontSize: U(9.5), letterSpacing: '.14em' }}>
                    {name}
                  </h3>
                  <span className="block col-start-1" style={{ marginTop: U(6), fontSize: U(12.5), color: '#737b86', letterSpacing: '.03em' }}>
                    {price}
                  </span>
                  <button
                    className="add col-start-2 row-span-2 relative"
                    style={{ width: U(26), height: U(26), transition: 'transform .2s' }}
                    aria-label={`Add ${name} to cart`}
                    onClick={() => setCart((c) => c + 1)}
                  />
                </div>
              </article>
            ))}
          </aside>
        </main>

        {/* ================= WAIT COVER ================= */}
        <div
          className={`wait fixed inset-0 z-[9] bg-[#f1f5fa] pointer-events-none ${loaded ? 'gone' : ''}`}
        />
      </div>
    </>
  );
}