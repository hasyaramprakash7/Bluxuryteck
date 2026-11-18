// src/components/ErrorWatch.jsx
import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────────
   ErrorWatch — dev-only floating error monitor.

   • Catches window.error, unhandledrejection, and failed <img> loads.
   • Attributes each error to a component via the nearest
     [data-component="…"] ancestor, so you immediately know
     who triggered the fetch / image.
   • Groups errors by component in the panel.
   • Zero deps, safe to leave in code (no-ops in prod).
   ───────────────────────────────────────────────────────────────── */

export function ErrorWatch({ enabled = import.meta.env?.DEV ?? false }) {
  const [entries, setEntries] = useState([]);
  const [open, setOpen] = useState(false);
  const nextId = useRef(1);

  useEffect(() => {
    if (!enabled) return;

    const push = (kind, payload) => {
      setEntries((prev) => {
        const item = { id: nextId.current++, kind, ...payload };
        return [...prev, item].slice(-200);
      });
    };

    /* 1) Uncaught JS errors */
    const onError = (e) => {
      // skip resource errors (handled separately below with attr'd component)
      if (e.target && e.target.tagName === "IMG") return;
      push("error", {
        message: e.message || "Unknown error",
        source: e.filename ? `${e.filename}:${e.lineno}` : "(inline)",
        stack: (e.error?.stack || "").split("\n").slice(0, 6).join("\n"),
        component: null,
      });
    };

    /* 2) Unhandled promise rejections (this includes your SW fetch failures) */
    const onRejection = (e) => {
      const reason = e.reason;
      push("rejection", {
        message: reason?.message || String(reason || "Unhandled rejection"),
        source: "promise",
        stack: (reason?.stack || "").split("\n").slice(0, 6).join("\n"),
        component: null,
      });
    };

    /* 3) Failed <img> / <link> / <script> loads — this is what fires for every
          cross-origin image whose SW fetch rejects. */
    const onResource = (e) => {
      const el = e.target;
      if (!el || el === window) return;
      const tag = el.tagName;
      if (!["IMG", "LINK", "SCRIPT", "AUDIO", "VIDEO", "SOURCE"].includes(tag)) return;

      const component = findComponentOwner(el);
      const url = el.currentSrc || el.src || el.href || "(no url)";

      push("resource", {
        message: `${tag} failed → ${url}`,
        source: component ? `<${component}>` : "(unknown component)",
        stack: "",
        component,
        tag,
        url,
      });
    };

    window.addEventListener("error", onError, true);
    window.addEventListener("unhandledrejection", onRejection);
    window.addEventListener("error", onResource, true);

    return () => {
      window.removeEventListener("error", onError, true);
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("error", onResource, true);
    };
  }, [enabled]);

  if (!enabled) return null;

  // Group by component (or "(unknown)") for the panel
  const grouped = entries.reduce((acc, e) => {
    const key = e.component || "(unattributed)";
    (acc[key] = acc[key] || []).push(e);
    return acc;
  }, {});

  const total = entries.length;
  const bad = total > 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title="ErrorWatch (dev only)"
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 2147483600,
          background: bad ? "#b91c1c" : "#111827",
          color: "#fff",
          border: "1px solid rgba(255,255,255,.2)",
          borderRadius: 999,
          padding: "10px 16px",
          font: "700 11px/1 system-ui,-apple-system,sans-serif",
          letterSpacing: ".08em",
          textTransform: "uppercase",
          cursor: "pointer",
          boxShadow: "0 12px 30px -10px rgba(0,0,0,.6)",
        }}
      >
        {bad ? `${total} error${total === 1 ? "" : "s"}` : "0 errors"}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 68,
            right: 16,
            width: "min(560px, calc(100vw - 32px))",
            maxHeight: "65vh",
            display: "flex",
            flexDirection: "column",
            zIndex: 2147483600,
            background: "#0b0b0f",
            color: "#e5e7eb",
            border: "1px solid rgba(255,255,255,.15)",
            borderRadius: 12,
            font: "12px/1.5 ui-monospace,Menlo,Consolas,monospace",
            boxShadow: "0 24px 60px -20px rgba(0,0,0,.9)",
            overflow: "hidden",
          }}
        >
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
            <strong style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase" }}>ErrorWatch</strong>
            <button
              onClick={() => setEntries([])}
              style={{ background: "transparent", border: 0, color: "#9ca3af", cursor: "pointer", fontSize: 11, padding: 0 }}
            >
              clear
            </button>
          </header>

          <div style={{ overflow: "auto", flex: 1 }}>
            {total === 0 && (
              <div style={{ padding: 16, color: "#6b7280" }}>No errors captured yet.</div>
            )}

            {Object.entries(grouped).map(([comp, list]) => (
              <section key={comp} style={{ borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                <div style={{ padding: "8px 14px", background: "rgba(255,255,255,.03)", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#93c5fd", fontWeight: 700 }}>{comp}</span>
                  <span style={{ color: "#6b7280", fontSize: 10 }}>{list.length}×</span>
                </div>
                {list.map((e) => (
                  <div key={e.id} style={{ padding: "8px 14px", borderTop: "1px solid rgba(255,255,255,.04)" }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 4, alignItems: "center" }}>
                      <span
                        style={{
                          fontSize: 9,
                          padding: "2px 6px",
                          borderRadius: 4,
                          fontWeight: 700,
                          letterSpacing: ".08em",
                          textTransform: "uppercase",
                          background:
                            e.kind === "resource" ? "#7c2d12" :
                            e.kind === "rejection" ? "#7f1d1d" :
                            "#1e3a8a",
                        }}
                      >
                        {e.kind}
                      </span>
                      {e.source && <span style={{ color: "#9ca3af", fontSize: 10 }}>{e.source}</span>}
                    </div>
                    <div style={{ color: "#f3f4f6", wordBreak: "break-word" }}>{e.message}</div>
                    {e.stack && (
                      <pre style={{ margin: "6px 0 0", whiteSpace: "pre-wrap", color: "#6b7280", fontSize: 10, lineHeight: 1.4 }}>
                        {e.stack}
                      </pre>
                    )}
                  </div>
                ))}
              </section>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* Walk up the DOM from an element, return the nearest
   [data-component="…"] ancestor (or null). */
function findComponentOwner(el) {
  let node = el;
  while (node && node !== document.body) {
    if (node.dataset && node.dataset.component) return node.dataset.component;
    node = node.parentElement;
  }
  return null;
}

/* ─────────────────────────────────────────────────────────────────
   ComponentScope — wrap any subtree so ErrorWatch can attribute
   failures to it by name.
   ───────────────────────────────────────────────────────────────── */
export function ComponentScope({ name, as: Tag = "div", children, ...rest }) {
  return (
    <Tag data-component={name} {...rest}>
      {children}
    </Tag>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TracedImg — drop-in <img> that:
   • tags itself with data-component
   • logs to ErrorWatch with a clean "component → src" message
   • still calls the caller's onError
   ───────────────────────────────────────────────────────────────── */
export function TracedImg({ component = "unknown", onError, alt = "", ...props }) {
  return (
    <img
      data-component={component}
      alt={alt}
      onError={(e) => {
        // eslint-disable-next-line no-console
        console.error(`[img-fail] <${component}> → ${e.currentTarget.currentSrc || e.currentTarget.src}`);
        onError?.(e);
      }}
      {...props}
    />
  );
}