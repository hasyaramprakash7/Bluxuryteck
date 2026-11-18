import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261107_112151_ae5c9a8f-07da-4b83-8dd8-47c762a5dfc0.mp4";

const HOTSPOTS = [
  {
    x: 0.47,
    y: 0.22,
    title: "Two-way zip",
    text: "Silver two-way zip with a sculpted pull, up to a tall stand collar.",
  },
  {
    x: 0.38,
    y: 0.285,
    title: "Contour print",
    text: "A topographic map printed edge to edge, so every panel shows a different ridge.",
  },
  {
    x: 0.63,
    y: 0.385,
    title: "Hand-warmer pockets",
    text: "Deep fleece-lined pockets set high for hands-in-pockets wear.",
  },
];

const ACCORDION = [
  {
    label: "Description",
    text: "Oversized puffer jacket in a liquid-silver ripstop, printed all over with a topographic contour map. Stand collar, two-way zip and deep hand-warmer pockets. Boxy, cropped fit.",
  },
  {
    label: "Materials",
    text: "Shell: 100% recycled nylon with a metallic coating. Fill: 80/20 recycled down. Lining: 100% recycled polyester.",
  },
  {
    label: "Size guide",
    text: "XS/S: chest 124 cm. M/L: chest 132 cm. XL/2XL: chest 140 cm. Cut wide; take your usual size for the intended volume.",
  },
  {
    label: "Packaging",
    text: "Folded into a reusable drawstring sack and shipped in a recycled card box. No plastic.",
  },
  {
    label: "Shipping & returns",
    text: "Pre-orders ship in 4–6 weeks. Free returns within 30 days of delivery.",
  },
];

const SIZES = ["XS/S", "M/L", "XL/2XL"];

const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const GLOBAL_CSS = `
  html, body, #root { height: 100%; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { overflow: hidden; background: var(--bg, #e2e4e8); }
  body {
    font-family: 'IBM Plex Mono', ui-monospace, monospace;
    color: #111;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    user-select: none;
    -webkit-user-select: none;
  }
  button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }

  .pill {
    height: 35px;
    padding: 0 17px;
    background: #fff;
    border-radius: 4px;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: .03em;
    white-space: nowrap;
    display: flex;
    align-items: center;
    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
    transition: background .18s ease;
  }
  .pill:hover { background: #f6f6f7; }

  @keyframes hsPing {
    0%   { transform: scale(.6); opacity: .85; }
    100% { transform: scale(1.5); opacity: 0; }
  }

  .tip {
    clip-path: inset(0 100% 0 0);
    transition: clip-path .45s cubic-bezier(.65,0,.25,1);
  }
  .hs:hover .tip { clip-path: inset(0); }
`;

export default function SpinProduct() {
  /* ---------------------------------------------------------------- layout */
  const [vp, setVp] = useState({ w: 1500, h: 1000 });
  const [K, setK] = useState(1);
  const [bg, setBg] = useState("#e2e4e8");

  useEffect(() => {
    const onResize = () => {
      setVp({ w: window.innerWidth, h: window.innerHeight });
      setK(Math.min(window.innerWidth / 1500, window.innerHeight / 1000));
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ----------------------------------------------------------------- fonts */
  useEffect(() => {
    const href =
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter+Tight:wght@500&family=Tinos&display=swap";
    const p1 = document.createElement("link");
    p1.rel = "preconnect";
    p1.href = "https://fonts.googleapis.com";
    const p2 = document.createElement("link");
    p2.rel = "preconnect";
    p2.href = "https://fonts.gstatic.com";
    p2.crossOrigin = "anonymous";
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.append(p1, p2, l);
    return () => {
      p1.remove();
      p2.remove();
      l.remove();
    };
  }, []);

  /* ------------------------------------------------------------------ refs */
  const artRef = useRef(null);
  const stageRef = useRef(null);
  const vidRef = useRef(null);
  const cvRef = useRef(null);
  const dotRef = useRef(null);
  const degRef = useRef(null);

  const framesRef = useRef([]);
  const nfRef = useRef(1);
  const angRef = useRef(0);
  const velRef = useRef(0);
  const idleRef = useRef(0);
  const draggingRef = useRef(false);
  const tweenRef = useRef(null);
  const lastDrawnRef = useRef(-1);
  const pendingRef = useRef(null);
  const decodingRef = useRef(false);
  const readyRef = useRef(false);
  const fallbackRef = useRef(false);
  const frontRef = useRef(false);
  const dragState = useRef({ x: 0, t: 0, v: 0 });
  const apiRef = useRef({ spinTo: () => {} });

  const thumbRefs = useRef([null, null]);
  const frontThumbRef = useRef(null);
  const [look, setLook] = useState(0);

  const [dragging, setDragging] = useState(false);
  const [facingFront, setFacingFront] = useState(false);
  const [vidHidden, setVidHidden] = useState(false);

  const [count, setCount] = useState(0);
  const [added, setAdded] = useState(false);
  const countRef = useRef(null);
  const bagRef = useRef(null);
  const preorderRef = useRef(null);

  const [openRow, setOpenRow] = useState(0);
  const [size, setSize] = useState(1);
  const sizeRefs = useRef([]);
  const [hl, setHl] = useState({ left: 0, width: 0 });
  const [hlReady, setHlReady] = useState(false);
  const [saved, setSaved] = useState(false);

  /* -------------------------------------------------------- size highlight */
  useLayoutEffect(() => {
    const el = sizeRefs.current[size];
    if (el) setHl({ left: el.offsetLeft, width: el.offsetWidth });
    const t = setTimeout(() => setHlReady(true), 30);
    return () => clearTimeout(t);
  }, [size, vp.w, vp.h]);

  /* --------------------------------------------------------- draw helpers */
  const drawCover = (img) => {
    const cv = cvRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const cw = cv.width;
    const ch = cv.height;
    const iw = img.width || 1;
    const ih = img.height || 1;
    const s = Math.max(cw / iw, ch / ih);
    const dw = iw * s;
    const dh = ih * s;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  };

  const drawThumb = async (cv, blob) => {
    if (!cv || !blob) return;
    try {
      const bmp = await createImageBitmap(blob);
      const ctx = cv.getContext("2d");
      const fw = bmp.width;
      const fh = bmp.height;
      const side = fw * 0.62;
      const sx = (fw - side) / 2;
      const sy = fh * 0.07;
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.drawImage(bmp, sx, sy, side, side, 0, 0, cv.width, cv.height);
      if (bmp.close) bmp.close();
    } catch (e) {
      /* ignore */
    }
  };

  const blobToDataURL = (blob) =>
    new Promise((res) => {
      if (!blob) return res(null);
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.onerror = () => res(null);
      fr.readAsDataURL(blob);
    });

  /* ----------------------------------------------- turntable engine effect */
  useEffect(() => {
    const vid = vidRef.current;
    if (!vid) return;

    let cancelled = false;
    let raf = 0;
    let last = performance.now();

    /* ---------- frame decode / paint (one decode at a time) ---------- */
    const paint = async () => {
      decodingRef.current = true;
      while (pendingRef.current !== null) {
        const idx = pendingRef.current;
        pendingRef.current = null;
        const blob = framesRef.current[idx];
        if (!blob) continue;
        try {
          const bmp = await createImageBitmap(blob);
          drawCover(bmp);
          lastDrawnRef.current = idx;
          if (bmp.close) bmp.close();
        } catch (e) {
          /* ignore */
        }
      }
      decodingRef.current = false;
    };

    const show = () => {
      const NF = nfRef.current;
      if (!readyRef.current || NF < 2) return;

      if (fallbackRef.current) {
        // graceful degradation — seek the live video instead
        const d = vid.duration || 10.04;
        const i = ((Math.round(angRef.current * NF) % NF) + NF) % NF;
        const t = (i / NF) * d;
        if (Math.abs(vid.currentTime - t) > 0.03) {
          try {
            vid.currentTime = t;
          } catch (e) {
            /* ignore */
          }
        }
        return;
      }

      const idx = ((Math.round(angRef.current * NF) % NF) + NF) % NF;
      if (idx === lastDrawnRef.current && pendingRef.current === null) return;
      pendingRef.current = idx;
      if (decodingRef.current) return;
      paint();
    };

    /* ------------------------------ spinTo (shortest way round) ------- */
    const spinTo = (a) => {
      let d = a - angRef.current;
      d = d - Math.round(d);
      const dur = 900 + Math.abs(d) * 900;
      tweenRef.current = {
        from: angRef.current,
        to: angRef.current + d,
        start: performance.now(),
        dur,
      };
      velRef.current = 0;
      idleRef.current = 0;
    };
    apiRef.current.spinTo = spinTo;

    /* ------------------------------ rAF loop -------------------------- */
    const loop = (now) => {
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;

      const tw = tweenRef.current;
      if (tw) {
        const p = Math.min(1, (now - tw.start) / tw.dur);
        angRef.current = tw.from + (tw.to - tw.from) * easeInOutCubic(p);
        if (p >= 1) {
          tweenRef.current = null;
          velRef.current = 0;
        }
      } else if (!draggingRef.current) {
        idleRef.current += dt;
        const auto = idleRef.current > 3;
        const target = auto ? 0.045 : 0;
        const rate = auto ? 0.8 : 2.2;
        velRef.current += (target - velRef.current) * Math.min(1, dt * rate);
        angRef.current += velRef.current * dt;
      }

      show();

      /* readout */
      const f = ((angRef.current % 1) + 1) % 1;
      if (degRef.current) {
        degRef.current.textContent =
          String(Math.round(f * 360)).padStart(3, "0") + "\u00B0";
      }
      if (dotRef.current) dotRef.current.style.left = f * 100 + "%";

      /* facing-front detection */
      const front =
        Math.min(f, 1 - f) < 0.035 &&
        !draggingRef.current &&
        !tweenRef.current &&
        Math.abs(velRef.current) < 0.02;

      if (front !== frontRef.current) {
        frontRef.current = front;
        setFacingFront(front);
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    /* ------------------------------ frame cache ----------------------- */
    const capture = async () => {
      const dur = vid.duration;
      if (!dur || !isFinite(dur) || dur <= 0) return;

      const NF = Math.max(2, Math.round(dur * 24));
      const vw = vid.videoWidth || 732;
      const vh = vid.videoHeight || 1296;
      const W = Math.min(720, vw);
      const H = Math.round((W * vh) / vw);

      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const octx = off.getContext("2d");

      /* page background = the clip's own backdrop */
      try {
        octx.drawImage(vid, 0, 0, W, H);
        const px = octx.getImageData(6, 6, 1, 1).data;
        const c = `rgb(${px[0]},${px[1]},${px[2]})`;
        setBg(c);
        document.documentElement.style.setProperty("--bg", c);
      } catch (e) {
        /* tainted — keep default */
      }

      const frames = new Array(NF).fill(null);
      let inflight = 0;

      const grab = () => {
        inflight++;
        try {
          octx.drawImage(vid, 0, 0, W, H);
        } catch (e) {
          inflight--;
          return Promise.resolve(null);
        }
        return new Promise((res) => {
          try {
            off.toBlob(
              (b) => {
                inflight--;
                res(b);
              },
              "image/jpeg",
              0.88
            );
          } catch (e) {
            inflight--;
            res(null);
          }
        });
      };

      let finished = false;
      const finish = async () => {
        if (finished || cancelled) return;
        finished = true;

        await new Promise((r) => setTimeout(r, 150));

        let guard = 0;
        while (inflight > 0 && guard++ < 250) {
          await new Promise((r) => setTimeout(r, 20));
        }

        /* fill gaps from a neighbouring frame */
        for (let i = 0; i < NF; i++) {
          if (frames[i]) continue;
          for (let d = 1; d < NF; d++) {
            if (i - d >= 0 && frames[i - d]) {
              frames[i] = frames[i - d];
              break;
            }
            if (i + d < NF && frames[i + d]) {
              frames[i] = frames[i + d];
              break;
            }
          }
        }

        /* drop the last frame — it equals the first */
        frames.pop();

        if (frames.filter(Boolean).length < 2) {
          throw new Error("no frames captured");
        }

        framesRef.current = frames;
        nfRef.current = frames.length;
        readyRef.current = true;
        setVidHidden(true);

        const backIdx = Math.round(0.5 * frames.length) % frames.length;
        await drawThumb(thumbRefs.current[0], frames[0]);
        await drawThumb(thumbRefs.current[1], frames[backIdx]);
        frontThumbRef.current = await blobToDataURL(frames[0]);
        lastDrawnRef.current = -1;
        show();
      };

      try {
        if (typeof vid.requestVideoFrameCallback === "function") {
          vid.loop = false;
          vid.currentTime = 0;
          const onFrame = (_now, meta) => {
            if (cancelled) return;
            const i = Math.round(meta.mediaTime * 24);
            if (i >= 0 && i < NF && !frames[i]) {
              grab().then((b) => {
                if (b) frames[i] = b;
              });
            }
            if (!vid.ended) vid.requestVideoFrameCallback(onFrame);
          };
          vid.addEventListener("ended", finish, { once: true });
          vid.requestVideoFrameCallback(onFrame);
          try {
            await vid.play();
          } catch (e) {
            /* ignore */
          }
          setTimeout(() => {
            finish().catch(() => {});
          }, 30000);
        } else {
          /* seek-through fallback */
          vid.pause();
          vid.loop = false;
          for (let i = 0; i < NF; i++) {
            if (cancelled) return;
            await new Promise((res) => {
              const onSeek = () => {
                vid.removeEventListener("seeked", onSeek);
                res();
              };
              vid.addEventListener("seeked", onSeek);
              try {
                vid.currentTime = i / 24;
              } catch (e) {
                vid.removeEventListener("seeked", onSeek);
                res();
              }
            });
            const b = await grab();
            if (b) frames[i] = b;
          }
          await finish();
        }
      } catch (e) {
        /* fall back to the live video element */
        fallbackRef.current = true;
        readyRef.current = true;
        nfRef.current = Math.max(2, Math.round((vid.duration || 10.04) * 24) - 1);
        try {
          vid.pause();
        } catch (err) {
          /* ignore */
        }
      }
    };

    const start = () => {
      if (cancelled) return;
      capture().catch(() => {
        fallbackRef.current = true;
        readyRef.current = true;
      });
    };

    if (vid.readyState >= 2) start();
    else vid.addEventListener("loadeddata", start, { once: true });

    /* if CORS blocks the fetch, retry without the attribute */
    const onErr = () => {
      if (vid.hasAttribute("crossorigin")) {
        vid.removeAttribute("crossorigin");
        try {
          vid.load();
        } catch (e) {
          /* ignore */
        }
      }
    };
    vid.addEventListener("error", onErr);

    /* any pointer move resets the idle timer */
    const resetIdle = () => {
      idleRef.current = 0;
    };
    window.addEventListener("pointermove", resetIdle);
    window.addEventListener("pointerdown", resetIdle);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      vid.removeEventListener("loadeddata", start);
      vid.removeEventListener("error", onErr);
      window.removeEventListener("pointermove", resetIdle);
      window.removeEventListener("pointerdown", resetIdle);
    };
  }, []);

  /* --------------------------------------------------------- drag handlers */
  const onPointerDown = (e) => {
    if (!stageRef.current) return;
    try {
      stageRef.current.setPointerCapture(e.pointerId);
    } catch (err) {
      /* ignore */
    }
    draggingRef.current = true;
    setDragging(true);
    tweenRef.current = null;
    velRef.current = 0;
    idleRef.current = 0;
    dragState.current = { x: e.clientX, t: performance.now(), v: 0 };
  };

  const onPointerMove = (e) => {
    idleRef.current = 0;
    if (!draggingRef.current) return;

    const now = performance.now();
    const dx = e.clientX - dragState.current.x;
    const dt = Math.max(8, now - dragState.current.t);

    angRef.current += -dx / K / 900;

    const inst = (-dx / dt) * 1000 / (K * 900);
    dragState.current.v = inst * 0.6 + dragState.current.v * 0.4;
    dragState.current.x = e.clientX;
    dragState.current.t = now;
  };

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    velRef.current = clamp(dragState.current.v, -2.5, 2.5);
    idleRef.current = 0;
  };

  /* ------------------------------------------------------------- pre-order */
  const handlePreorder = () => {
    if (added) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);

    const art = artRef.current;
    const btn = preorderRef.current;
    const bag = bagRef.current;

    if (art && btn && bag) {
      const a = art.getBoundingClientRect();
      const b = btn.getBoundingClientRect();
      const g = bag.getBoundingClientRect();

      const sx = (b.left - a.left) / K + b.width / K / 2;
      const sy = (b.top - a.top) / K + b.height / K / 2;
      const ex = (g.left - a.left) / K + g.width / K / 2;
      const ey = (g.top - a.top) / K + g.height / K / 2;

      const el = document.createElement("div");
      el.style.cssText = [
        "position:absolute",
        "left:0",
        "top:0",
        "width:60px",
        "height:80px",
        "background:#fff",
        "background-size:cover",
        "background-position:center",
        "box-shadow:0 10px 30px rgba(0,0,0,.18)",
        "z-index:80",
        "pointer-events:none",
        "transform-origin:50% 50%",
      ].join(";");
      if (frontThumbRef.current) {
        el.style.backgroundImage = `url(${frontThumbRef.current})`;
      }
      art.appendChild(el);

      const mx = sx + (ex - sx) * 0.5;
      const my = sy + (ey - sy) * 0.5 - 140;

      el.animate(
        [
          { transform: `translate(${sx - 30}px, ${sy - 40}px) scale(1) rotate(0deg)` },
          {
            transform: `translate(${mx - 30}px, ${my - 40}px) scale(.8) rotate(-8deg)`,
            offset: 0.5,
          },
          { transform: `translate(${ex - 30}px, ${ey - 40}px) scale(.18) rotate(-14deg)` },
        ],
        {
          duration: 900,
          easing: "cubic-bezier(.5,0,.3,1)",
          fill: "forwards",
        }
      );

      setTimeout(() => el.remove(), 900);
    }

    setTimeout(() => {
      setCount((c) => c + 1);
      if (countRef.current && countRef.current.animate) {
        countRef.current.animate(
          [
            { transform: "translateY(-6px) scale(1.4)" },
            { transform: "translateY(0) scale(1)" },
          ],
          { duration: 500, easing: "cubic-bezier(.3,1.8,.5,1)" }
        );
      }
    }, 900);
  };

  /* ------------------------------------------------------------------ view */
  return (
    <div
      style={{ "--bg": bg, background: bg, position: "fixed", inset: 0, overflow: "hidden" }}
    >
      <style>{GLOBAL_CSS}</style>

      <div
        id="art"
        ref={artRef}
        style={{
          position: "absolute",
          width: 1500,
          height: 1000,
          transformOrigin: "0 0",
          left: vp.w / 2,
          top: vp.h / 2,
          transform: `scale(${K}) translate(-750px,-500px)`,
        }}
      >
        {/* ------------------------------------------------------- header */}
        <div
          id="logo"
          style={{
            position: "absolute",
            left: 28,
            top: 18,
            fontFamily: "'Inter Tight', sans-serif",
            fontWeight: 500,
            fontSize: 27,
            letterSpacing: "-.01em",
            lineHeight: 1,
          }}
        >
          OKTA/9
        </div>

        <div
          id="crumb"
          style={{
            position: "absolute",
            left: 28,
            top: 54,
            fontSize: 11,
            letterSpacing: ".03em",
            color: "var(--ink)",
          }}
        >
          HOME &gt; SHOP &gt; COATS &amp; JACKETS
        </div>

        <div
          id="nav"
          style={{
            position: "absolute",
            left: "50%",
            top: 16,
            transform: "translateX(-50%)",
            display: "flex",
            gap: 6,
          }}
        >
          {["Shop", "Collections", "Explore"].map((t) => (
            <button key={t} className="pill">
              {t}
            </button>
          ))}
        </div>

        <div
          id="acct"
          className="pill"
          style={{
            position: "absolute",
            right: 28,
            top: 16,
            gap: 12,
            padding: "0 17px",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 22 22"
            fill="none"
            stroke="#111"
            strokeWidth="2.6"
            aria-hidden="true"
          >
            <circle cx="9" cy="9" r="7" />
            <path d="M14.2 14.2 20 20" strokeLinecap="round" />
          </svg>
          <button style={{ letterSpacing: ".03em" }}>Log in</button>
          <button
            ref={bagRef}
            style={{ letterSpacing: ".03em", display: "flex", alignItems: "center" }}
          >
            Bag/
            <b
              id="count"
              ref={countRef}
              style={{ fontWeight: 500, display: "inline-block" }}
            >
              {count}
            </b>
          </button>
        </div>

        {/* ------------------------------------------- connector lines */}
        <svg
          width={1500}
          height={1000}
          viewBox="0 0 1500 1000"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            pointerEvents: "none",
            zIndex: 5,
          }}
        >
          <path
            d="M438 395H562L592 362H618"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            pathLength="1"
            style={{
              strokeDasharray: 1,
              strokeDashoffset: facingFront ? 0 : 1,
              transition: `stroke-dashoffset ${facingFront ? 0.7 : 0.35}s ease`,
            }}
          />
          <path
            d="M1105 600H962L937 478H900"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            pathLength="1"
            style={{
              strokeDasharray: 1,
              strokeDashoffset: facingFront ? 0 : 1,
              transition: `stroke-dashoffset ${facingFront ? 0.7 : 0.35}s ease`,
            }}
          />
        </svg>

        {/* ------------------------------------------------- turntable */}
        <div
          id="stage"
          ref={stageRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
          style={{
            position: "absolute",
            left: 480,
            top: 70,
            width: 540,
            height: 960,
            cursor: dragging ? "grabbing" : "grab",
            touchAction: "none",
            zIndex: 10,
          }}
        >
          <video
            id="vid"
            ref={vidRef}
            src={VIDEO_URL}
            muted
            playsInline
            loop
            autoPlay
            preload="auto"
            crossOrigin="anonymous"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: vidHidden ? "none" : "block",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)",
              maskImage:
                "linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)",
            }}
          />

          <canvas
            id="cv"
            ref={cvRef}
            width={1080}
            height={1920}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)",
              maskImage:
                "linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)",
            }}
          />

          {/* ------------------------------------------------ hotspots */}
          {HOTSPOTS.map((hs, i) => {
            const visible = facingFront && !dragging && !added;
            return (
              <div
                key={hs.title}
                className="hs"
                style={{
                  position: "absolute",
                  left: `${hs.x * 100}%`,
                  top: `${hs.y * 100}%`,
                  transform: "translate(-50%,-50%)",
                  zIndex: 40,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 22,
                    height: 22,
                    transform: visible ? "scale(1)" : "scale(0)",
                    transition: `transform .35s cubic-bezier(.3,1.6,.5,1) ${
                      visible ? i * 0.08 : 0
                    }s`,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      border: "1px solid #fff",
                      animation: "hsPing 2.2s infinite",
                      animationDelay: `${i * 0.3}s`,
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,.92)",
                      boxShadow:
                        "0 0 0 1px rgba(0,0,0,.07), 0 4px 14px rgba(0,0,0,.18)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      lineHeight: 1,
                      color: "#111",
                    }}
                  >
                    +
                  </span>
                </div>

                <div
                  className="tip"
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 210,
                    background: "#fff",
                    padding: "12px 14px",
                    fontSize: 11,
                    lineHeight: 1.45,
                    boxShadow: "0 8px 24px rgba(0,0,0,.10)",
                    ...(hs.x > 0.5 ? { left: 30 } : { right: 30 }),
                  }}
                >
                  <div
                    style={{
                      textTransform: "uppercase",
                      fontWeight: 500,
                      marginBottom: 4,
                    }}
                  >
                    {hs.title}
                  </div>
                  <div style={{ color: "var(--mute)" }}>{hs.text}</div>
                </div>
              </div>
            );
          })}

          {/* ------------------------------------------------- readout */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 62,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: ".06em",
                color: "var(--mute)",
                textTransform: "uppercase",
              }}
            >
              Drag to rotate
            </div>
            <div
              style={{
                position: "relative",
                width: 120,
                height: 1,
                background: "var(--line)",
                marginTop: 8,
              }}
            >
              <div
                ref={dotRef}
                style={{
                  position: "absolute",
                  top: -3,
                  left: "0%",
                  width: 7,
                  height: 7,
                  marginLeft: -3.5,
                  borderRadius: "50%",
                  background: "var(--ink)",
                }}
              />
            </div>
            <div
              ref={degRef}
              style={{
                marginTop: 8,
                fontSize: 11,
                letterSpacing: ".06em",
                color: "var(--ink)",
              }}
            >
              000°
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- info card */}
        <div
          id="info"
          style={{
            position: "absolute",
            left: 18,
            top: 300,
            width: 420,
            background: "#fff",
            padding: "36px 28px 26px 38px",
            clipPath:
              "polygon(0 0, 130px 0, 140px 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 290px) calc(100% - 8px), calc(100% - 300px) 100%, 10px 100%, 10px 120px, 0 112px)",
            zIndex: 20,
          }}
        >
          <h1
            style={{
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: ".05em",
              lineHeight: 1.45,
              fontWeight: 400,
            }}
          >
            The contour lines
            <br />
            metallic puffer
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 14,
            }}
          >
            <span style={{ fontSize: 13 }}>€ 1.120</span>
            <span
              style={{
                fontSize: 11,
                background: "var(--chip)",
                padding: "2px 4px",
                letterSpacing: ".03em",
              }}
            >
              PRE-ORDER
            </span>
          </div>

          <div style={{ marginTop: 22 }}>
            {ACCORDION.map((row, i) => {
              const open = openRow === i;
              return (
                <div key={row.label}>
                  <button
                    onClick={() => setOpenRow(open ? -1 : i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      fontSize: 13,
                      textTransform: "uppercase",
                      letterSpacing: ".03em",
                      padding: "8px 0",
                    }}
                  >
                    <span>{row.label}</span>
                    <span>{open ? "[−]" : "[+]"}</span>
                  </button>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateRows: open ? "1fr" : "0fr",
                      transition:
                        "grid-template-rows .45s cubic-bezier(.65,0,.25,1)",
                    }}
                  >
                    <div style={{ overflow: "hidden" }}>
                      <p
                        style={{
                          fontFamily: "Tinos, serif",
                          fontSize: 15.5,
                          lineHeight: 1.38,
                          padding: "4px 0 12px",
                          color: "var(--ink)",
                        }}
                      >
                        {row.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ----------------------------------------------------- buy card */}
        <div
          id="buy"
          style={{
            position: "absolute",
            left: 1105,
            top: 385,
            width: 375,
            background: "#fff",
            padding: "30px 26px 26px",
            clipPath:
              "polygon(0 8px, 265px 8px, 275px 0, 100% 0, 100% calc(100% - 8px), 300px calc(100% - 8px), 290px 100%, 10px 100%, 10px calc(100% - 40px), 0 calc(100% - 48px))",
            zIndex: 20,
          }}
        >
          <div
            style={{ fontSize: 13, letterSpacing: ".05em", textTransform: "uppercase" }}
          >
            SIZE
          </div>

          <div
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 6,
              marginTop: 8,
            }}
          >
            <div
              id="hl"
              style={{
                position: "absolute",
                top: 0,
                height: 36,
                left: hl.left,
                width: hl.width,
                background: "#111",
                zIndex: 1,
                transition: hlReady
                  ? "left .45s cubic-bezier(.65,0,.25,1), width .45s cubic-bezier(.65,0,.25,1)"
                  : "none",
              }}
            />
            {SIZES.map((s, i) => (
              <button
                key={s}
                ref={(el) => {
                  sizeRefs.current[i] = el;
                }}
                onClick={() => setSize(i)}
                style={{
                  position: "relative",
                  zIndex: 2,
                  height: 36,
                  fontSize: 13,
                  letterSpacing: ".03em",
                  background: size === i ? "transparent" : "var(--chip)",
                  color: size === i ? "#fff" : "#111",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <div
            style={{
              marginTop: 12,
              fontSize: 10.5,
              letterSpacing: ".03em",
              textTransform: "uppercase",
              color: "var(--mute)",
              lineHeight: 1.5,
            }}
          >
            Model is 172 cm &amp; wears size M/L.{" "}
            <span style={{ color: "var(--ink)", textDecoration: "underline" }}>
              Size guide
            </span>
          </div>

          <div style={{ display: "flex", gap: 6, marginTop: 22 }}>
            <button
              onClick={() => setSaved((s) => !s)}
              style={{
                width: 62,
                height: 36,
                background: saved ? "#3a3d44" : "#111",
                color: "#fff",
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: ".03em",
                transition: "background .25s ease",
              }}
            >
              {saved ? "Saved" : "Save"}
            </button>

            <button
              ref={preorderRef}
              onClick={handlePreorder}
              style={{
                position: "relative",
                flex: 1,
                height: 36,
                background: "#111",
                color: "#fff",
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: ".03em",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: added ? "translateY(-100%)" : "translateY(0)",
                  transition: "transform .45s cubic-bezier(.65,0,.25,1)",
                }}
              >
                Pre-order
              </span>
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: added ? "translateY(0)" : "translateY(100%)",
                  transition: "transform .45s cubic-bezier(.65,0,.25,1)",
                }}
              >
                Added to bag
              </span>
            </button>
          </div>

          <div
            style={{
              marginTop: 12,
              fontSize: 10.5,
              letterSpacing: ".03em",
              textTransform: "uppercase",
              color: "var(--mute)",
              lineHeight: 1.5,
            }}
          >
            Pay in 3 instalments at checkout.{" "}
            <span style={{ color: "var(--ink)", textDecoration: "underline" }}>
              Learn more
            </span>
          </div>
        </div>

        {/* -------------------------------------------------------- looks */}
        <div
          id="looks"
          style={{ position: "absolute", left: 38, top: 790, display: "flex", gap: 8 }}
        >
          {[0, 1].map((i) => (
            <button
              key={i}
              onClick={() => {
                setLook(i);
                apiRef.current.spinTo(i * 0.5);
              }}
              style={{ position: "relative", width: 56, height: 56, display: "block" }}
            >
              <canvas
                ref={(el) => {
                  thumbRefs.current[i] = el;
                }}
                width={96}
                height={96}
                style={{
                  width: 56,
                  height: 56,
                  display: "block",
                  filter: look === i ? "none" : "grayscale(1)",
                  opacity: look === i ? 1 : 0.7,
                  transition: "filter .3s ease, opacity .3s ease",
                }}
              />
              {look === i && (
                <>
                  <span
                    style={{
                      position: "absolute",
                      left: -3,
                      top: -3,
                      width: 7,
                      height: 7,
                      borderTop: "1.5px solid #111",
                      borderLeft: "1.5px solid #111",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: -3,
                      top: -3,
                      width: 7,
                      height: 7,
                      borderTop: "1.5px solid #111",
                      borderRight: "1.5px solid #111",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: -3,
                      bottom: -3,
                      width: 7,
                      height: 7,
                      borderBottom: "1.5px solid #111",
                      borderLeft: "1.5px solid #111",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: -3,
                      bottom: -3,
                      width: 7,
                      height: 7,
                      borderBottom: "1.5px solid #111",
                      borderRight: "1.5px solid #111",
                    }}
                  />
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}