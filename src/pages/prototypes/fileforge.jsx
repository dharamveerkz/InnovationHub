"use client";
import { useState, useRef, useCallback, useEffect } from "react";

// ── Pure-JS helpers (zero deps) ──────────────────────────────────────────────
function imgToEl(file) {
  return new Promise((res, rej) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { URL.revokeObjectURL(url); res(img); };
    img.onerror = () => rej(new Error("Cannot load image"));
    img.src = url;
  });
}

async function convertImage(file, fmt) {
  const img = await imgToEl(file);
  const c = document.createElement("canvas");
  c.width = img.width; c.height = img.height;
  const ctx = c.getContext("2d");
  if (fmt === "jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); }
  ctx.drawImage(img, 0, 0);
  const mime = fmt === "webp" ? "image/webp" : fmt === "jpeg" ? "image/jpeg" : "image/png";
  return new Promise((res, rej) =>
    c.toBlob(b => b ? res({ blob: b, ext: fmt === "jpeg" ? "jpg" : fmt }) : rej(new Error("Failed")), mime, 0.92)
  );
}

async function resizeImage(file, w, h, q) {
  const img = await imgToEl(file);
  const ratio = img.width / img.height;
  const fw = w || (h ? Math.round(h * ratio) : img.width);
  const fh = h || (w ? Math.round(w / ratio) : img.height);
  const c = document.createElement("canvas");
  c.width = fw; c.height = fh;
  c.getContext("2d").drawImage(img, 0, 0, fw, fh);
  return new Promise((res, rej) =>
    c.toBlob(b => b ? res({ blob: b, ext: "jpg", w: fw, h: fh }) : rej(new Error("Failed")), "image/jpeg", q / 100)
  );
}

async function imagesToPDF(files) {
  const enc = new TextEncoder();
  const parts = []; let pos = 0;
  const offsets = [];
  const write = s => { const b = enc.encode(s); parts.push(b); pos += b.length; };
  const writeRaw = b => { parts.push(b); pos += b.length; };
  write("%PDF-1.4\n");
  const pages = [];
  for (const f of files) {
    const img = await imgToEl(f);    const scale = Math.min(595 / img.width, 842 / img.height, 1);
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    const b64 = c.toDataURL("image/jpeg", 0.88).split(",")[1];
    pages.push({ raw: Uint8Array.from(atob(b64), x => x.charCodeAt(0)), w: c.width, h: c.height });
  }
  let id = 3;
  const imgIds = [], pageIds = [];
  for (let i = 0; i < pages.length; i++) {
    const { raw, w, h } = pages[i];
    offsets[id] = pos;
    write(`${id} 0 obj\n<</Type/XObject/Subtype/Image/Width ${w}/Height ${h}/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length ${raw.length}>>\nstream\n`);
    writeRaw(raw); write("\nendstream\nendobj\n");
    imgIds.push(id++);
    const cs = `q ${w} 0 0 ${h} 0 0 cm /Im${i} Do Q`;
    offsets[id] = pos;
    write(`${id} 0 obj\n<</Type/Page/Parent 2 0 R/MediaBox[0 0 ${w} ${h}]/Resources<</XObject<</Im${i} ${imgIds[i]} 0 R>>>>/Contents ${id + 1} 0 R>>\nendobj\n`);
    pageIds.push(id++);
    offsets[id] = pos;
    write(`${id} 0 obj\n<</Length ${cs.length}>>\nstream\n${cs}\nendstream\nendobj\n`);
    id++;
  }
  offsets[2] = pos;
  write(`2 0 obj\n<</Type/Pages/Kids[${pageIds.map(x => `${x} 0 R`).join(" ")}]/Count ${pages.length}>>\nendobj\n`);
  offsets[1] = pos;
  write(`1 0 obj\n<</Type/Catalog/Pages 2 0 R>>\nendobj\n`);
  const xp = pos;
  write(`xref\n0 ${id}\n0000000000 65535 f\n`);
  for (let i = 1; i < id; i++) write(`${String(offsets[i] || 0).padStart(10, "0")} 00000 n\n`);
  write(`trailer\n<</Size ${id}/Root 1 0 R>>\nstartxref\n${xp}\n%%EOF\n`);
  return { blob: new Blob(parts, { type: "application/pdf" }), ext: "pdf" };
}

async function aiAnalyze(file) {
  const b64 = await new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: [
          { type: "image_url", image_url: { url: `data:${file.type};base64,${b64}` } },
          { type: "text", text: "Analyze this image concisely: describe what you see, note colors and composition, assess quality, and give 2–3 practical suggestions." }
        ]
      }]
    })
  });

  const d = await resp.json();
  return d.choices?.[0]?.message?.content || "No analysis returned.";
}

function triggerDownload(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ── Tokens ───────────────────────────────────────────────────────────────────
const C = { bg: "#06060e", surface: "#0c0c1a", border: "#181828", text: "#e0e0f0", muted: "#44445e", green: "#1fffa0", orange: "#ff7a38", blue: "#3d9bff", purple: "#9168ff" };
const TAG_COL = { BROWSER: C.green, AI: C.orange, "NODE.JS": C.purple, BACKEND: C.purple, API: C.orange };
const TOOLS = [
  { id: "convert",  label: "Image Convert",  icon: "↔",  tag: "BROWSER",  accept: "image/*",    multi: false, desc: "JPG · PNG · WEBP" },
  { id: "resize",   label: "Resize / Crop",  icon: "⤡",  tag: "BROWSER",  accept: "image/*",    multi: false, desc: "Dimensions & quality" },
  { id: "img2pdf",  label: "Images → PDF",   icon: "⊞",  tag: "BROWSER",  accept: "image/*",    multi: true,  desc: "Pure-JS PDF writer" },
  { id: "analyze",  label: "AI Analyze",     icon: "◎",  tag: "AI",       accept: "image/*",    multi: false, desc: "GPT-4 Vision API" },
  { id: "pdf2img",  label: "PDF → Image",    icon: "⬡",  tag: "NODE.JS",  accept: ".pdf",       multi: false, desc: "pdf-poppler · pdfjs" },
  { id: "docx2pdf", label: "DOCX → PDF",     icon: "⬛",  tag: "BACKEND",  accept: ".docx,.doc", multi: false, desc: "LibreOffice · Puppeteer" },
  { id: "bg",       label: "Remove BG",      icon: "✦",  tag: "API",      accept: "image/*",    multi: false, desc: "remove.bg · ClipDrop" },
  { id: "upscale",  label: "AI Upscale",     icon: "⤴",  tag: "API",      accept: "image/*",    multi: false, desc: "Replicate · ESRGAN" },
];

// ── Components ──────────────────────────────────────────────────────────────
function Chip({ label }) {
  const col = TAG_COL[label] || C.muted;
  return <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.2, padding: "2px 8px", borderRadius: 20, border: `1px solid ${col}40`, color: col, background: `${col}12`, fontFamily: "monospace" }}>{label}</span>;
}

function PrimaryBtn({ children, onClick, disabled, col }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: "100%", padding: "11px 0", borderRadius: 9, border: `1px solid ${disabled ? C.border : h ? col : col + "55"}`,
        background: disabled ? C.border : h ? `${col}28` : `${col}12`,        color: disabled ? C.muted : col, cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "monospace", fontWeight: 800, fontSize: 12, letterSpacing: 1.2,
        transition: "all 0.15s",
      }}>{children}</button>
  );
}

function Drop({ accept, multi, onFiles, col }) {
  const [over, setOver] = useState(false);
  const ref = useRef();
  return (
    <div onClick={() => ref.current?.click()}
      onDragOver={e => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={e => { e.preventDefault(); setOver(false); const f = Array.from(e.dataTransfer.files); if (f.length) onFiles(f); }}
      style={{ border: `2px dashed ${over ? col : C.border}`, borderRadius: 10, padding: "26px 16px", textAlign: "center", cursor: "pointer", transition: "all 0.2s", background: over ? `${col}08` : "transparent" }}>
      <div style={{ fontSize: 26, opacity: 0.3, marginBottom: 6 }}>⬆</div>
      <div style={{ color: C.muted, fontSize: 12 }}>Drop {multi ? "files" : "file"} or <span style={{ color: col }}>browse</span></div>
      <div style={{ color: C.border, fontSize: 10, marginTop: 3 }}>{accept}</div>
      <input ref={ref} type="file" accept={accept} multiple={multi} style={{ display: "none" }} onChange={e => onFiles(Array.from(e.target.files))} />
    </div>
  );
}

function Modal({ tool, onClose }) {
  const col = TAG_COL[tool.tag] || C.green;
  const [files, setFiles] = useState([]);
  const [fmt, setFmt] = useState("png");
  const [w, setW] = useState(""); const [h, setH] = useState(""); const [q, setQ] = useState(85);
  const [phase, setPhase] = useState("idle");
  const [result, setResult] = useState(null);
  const [aiText, setAiText] = useState("");
  const [err, setErr] = useState("");
  const [preview, setPreview] = useState(null);
  
  useEffect(() => {
    if (!files[0]?.type?.startsWith("image/")) { setPreview(null); return; }
    const url = URL.createObjectURL(files[0]);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [files[0]]);
  
  const run = async () => {
    setPhase("working"); setErr(""); setAiText(""); setResult(null);
    try {
      if (tool.id === "convert")  { setResult(await convertImage(files[0], fmt)); setPhase("done"); }
      else if (tool.id === "resize")  { setResult(await resizeImage(files[0], parseInt(w)||0, parseInt(h)||0, q)); setPhase("done"); }
      else if (tool.id === "img2pdf") { setResult(await imagesToPDF(files)); setPhase("done"); }
      else if (tool.id === "analyze") {
        setPhase("ai");        setAiText(await aiAnalyze(files[0]));
        setPhase("done");
      } else {
        const hint = tool.id === "pdf2img" ? "Node.js + pdfjs-dist or pdf-poppler"
          : tool.id === "docx2pdf" ? "Node.js + LibreOffice CLI or Puppeteer"
            : "an external API such as remove.bg or Replicate";
        throw new Error(`"${tool.label}" requires ${hint} running on a backend server.`);
      }
    } catch (e) { setErr(e.message); setPhase("error"); }
  };
  
  const dl = () => {
    if (!result) return;
    const base = files[0]?.name.replace(/\.[^.]+$/, "") || "output";
    triggerDownload(result.blob, `${base}.${result.ext}`);
  };
  
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(3,3,10,0.93)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 12 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.surface, border: `1px solid ${col}35`, borderRadius: 18, width: "100%", maxWidth: 480, maxHeight: "92vh", overflowY: "auto", boxShadow: `0 0 60px ${col}18` }}>
        {/* header */}
        <div style={{ padding: "16px 18px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 9, background: `${col}18`, border: `1px solid ${col}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, color: col, flexShrink: 0 }}>{tool.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: C.text, fontWeight: 700, fontSize: 14, fontFamily: "monospace" }}>{tool.label}</div>
            <div style={{ color: C.muted, fontSize: 11 }}>{tool.desc}</div>
          </div>
          <Chip label={tool.tag} />
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 17, padding: 4, flexShrink: 0 }}>✕</button>
        </div>
        <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 13 }}>
          <Drop accept={tool.accept} multi={tool.multi} onFiles={setFiles} col={col} />
          {preview && (
            <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}`, maxHeight: 170, background: "#06060e", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={preview} alt="" style={{ maxWidth: "100%", maxHeight: 170, objectFit: "contain", display: "block" }} />
            </div>
          )}
          {files.length > 0 && (
            <div style={{ color: C.muted, fontSize: 11, fontFamily: "monospace" }}>
              {files.length === 1 ? `${files[0].name}  ·  ${(files[0].size/1024).toFixed(0)} KB` : `${files.length} files selected`}
            </div>
          )}
          {/* Format selector */}
          {tool.id === "convert" && (
            <div style={{ display: "flex", gap: 7 }}>
              {["png","jpeg","webp"].map(f => (
                <button key={f} onClick={() => setFmt(f)} style={{
                  flex: 1, padding: "8px 0", borderRadius: 8,
                  border: `1px solid ${fmt===f ? col : C.border}`,                  background: fmt===f ? `${col}15` : "transparent",
                  color: fmt===f ? col : C.muted,
                  cursor: "pointer", fontFamily: "monospace", fontWeight: 700, fontSize: 11, transition: "all 0.14s",
                }}>{f.toUpperCase()}</button>
              ))}
            </div>
          )}
          {/* Resize opts */}
          {tool.id === "resize" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 9 }}>
                {[["W px", w, setW],["H px", h, setH]].map(([lbl,val,set]) => (
                  <div key={lbl} style={{ flex: 1 }}>
                    <div style={{ color: C.muted, fontSize: 10, fontFamily: "monospace", marginBottom: 4 }}>{lbl}</div>
                    <input type="number" value={val} onChange={e => set(e.target.value)} placeholder="auto"
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 13, fontFamily: "monospace", boxSizing: "border-box", outline: "none" }} />
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", color: C.muted, fontSize: 10, fontFamily: "monospace", marginBottom: 5 }}>
                  <span>QUALITY</span><span style={{ color: col }}>{q}%</span>
                </div>
                <input type="range" min={10} max={100} value={q} onChange={e => setQ(+e.target.value)} style={{ width: "100%", accentColor: col }} />
              </div>
            </div>
          )}
          <PrimaryBtn onClick={run} disabled={!files.length || phase === "working" || phase === "ai"} col={col}>
            {phase === "working" || phase === "ai" ? "⟳  PROCESSING…" : `▶  RUN  ${tool.label.toUpperCase()}`}
          </PrimaryBtn>
          {/* AI result */}
          {(phase === "ai" || (phase === "done" && aiText)) && (
            <div style={{ background: `${C.orange}08`, border: `1px solid ${C.orange}22`, borderRadius: 10, padding: 14 }}>
              <div style={{ color: C.orange, fontSize: 10, fontFamily: "monospace", fontWeight: 800, marginBottom: 7 }}>◎ AI ANALYSIS</div>
              <div style={{ color: "#aaaac0", fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
                {aiText || <span style={{ opacity: 0.35 }}>Thinking…</span>}
              </div>
            </div>
          )}
          {/* Download */}
          {phase === "done" && result && (
            <div style={{ background: `${C.green}07`, border: `1px solid ${C.green}22`, borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div>
                <div style={{ color: C.green, fontFamily: "monospace", fontWeight: 700, fontSize: 13 }}>✓ COMPLETE</div>
                <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>
                  {(result.blob.size/1024).toFixed(1)} KB · .{result.ext}
                  {result.w ? `  ·  ${result.w}×${result.h}` : ""}
                </div>
              </div>
              <button onClick={dl} style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${C.green}40`, background: `${C.green}12`, color: C.green, cursor: "pointer", fontSize: 12, fontFamily: "monospace", fontWeight: 700, flexShrink: 0 }}>↓ SAVE</button>            </div>
          )}
          {/* Error */}
          {phase === "error" && (
            <div style={{ background: "#ff4d4d07", border: "1px solid #ff4d4d22", borderRadius: 10, padding: 13 }}>
              <div style={{ color: "#ff6a6a", fontSize: 10, fontFamily: "monospace", fontWeight: 800, marginBottom: 5 }}>⚠  BACKEND REQUIRED</div>
              <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>{err}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ tool, onClick }) {
  const col = TAG_COL[tool.tag] || C.muted;
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: h ? `${col}09` : "#0a0a17",
        border: `1px solid ${h ? col+"44" : C.border}`,
        borderRadius: 14, padding: "16px 14px",
        textAlign: "left", cursor: "pointer",
        transition: "all 0.17s",
        transform: h ? "translateY(-2px)" : "none",
        boxShadow: h ? `0 8px 28px ${col}14` : "none",
        display: "flex", flexDirection: "column", gap: 10,
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: `${col}14`, border: `1px solid ${col}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: col }}>{tool.icon}</div>
        <Chip label={tool.tag} />
      </div>
      <div>
        <div style={{ color: "#d8d8ee", fontWeight: 700, fontSize: 13, fontFamily: "monospace", marginBottom: 3 }}>{tool.label}</div>
        <div style={{ color: "#30304a", fontSize: 11 }}>{tool.desc}</div>
      </div>
    </button>
  );
}

// ── App ──────────────────────────────────────────────────────────────
export default function FileForge() {
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [winW, setWinW] = useState(typeof window !== "undefined" ? window.innerWidth : 800);
  
  useEffect(() => {    const fn = () => setWinW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  
  const isMobile = winW < 460;
  const cols = isMobile ? 1 : winW < 640 ? 2 : 2;
  const cats = ["ALL", "BROWSER", "AI", "BACKEND"];
  const filtered = filter === "ALL" ? TOOLS
    : filter === "BACKEND" ? TOOLS.filter(t => ["NODE.JS","BACKEND","API"].includes(t.tag))
      : TOOLS.filter(t => t.tag === filter);
  
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: `radial-gradient(${C.border} 1px, transparent 1px)`, backgroundSize: "26px 26px", opacity: 0.55 }} />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: isMobile ? "24px 14px 48px" : "44px 24px 64px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: 36, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: isMobile ? 42 : 50, height: isMobile ? 42 : 50, borderRadius: 13, flexShrink: 0, background: `conic-gradient(from 200deg, ${C.green}, ${C.blue}, ${C.purple}, ${C.green})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 20 : 24, boxShadow: `0 0 28px ${C.green}28` }}>⚙</div>
          <div>
            <h1 style={{ margin: 0, fontSize: isMobile ? 22 : 30, fontWeight: 900, fontFamily: "'Courier New', monospace", letterSpacing: -0.5, color: C.text }}>FileForge</h1>
            <div style={{ color: C.muted, fontSize: isMobile ? 9 : 10, fontFamily: "monospace", letterSpacing: 1.5, marginTop: 2 }}>FILE CONVERSION TOOLKIT · ZERO DEPENDENCIES</div>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
          {cats.map(c => {
            const on = filter === c;
            return (
              <button key={c} onClick={() => setFilter(c)} style={{
                padding: "5px 12px", borderRadius: 20, fontSize: 10, fontWeight: 800,
                letterSpacing: 1, fontFamily: "monospace",
                border: `1px solid ${on ? C.green : C.border}`,
                background: on ? `${C.green}14` : "transparent",
                color: on ? C.green : C.muted, cursor: "pointer", transition: "all 0.14s",
              }}>{c}</button>
            );
          })}
        </div>
        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 9 }}>
          {filtered.map(t => <Card key={t.id} tool={t} onClick={() => setActive(t)} />)}
        </div>
        {/* Legend */}
        <div style={{ marginTop: 30, display: "flex", gap: isMobile ? 10 : 20, flexWrap: "wrap", justifyContent: "center" }}>
          {[[C.green,"BROWSER","client-side"],[C.orange,"AI / API","external service"],[C.purple,"NODE.JS","server required"]].map(([col,lbl,note]) => (
            <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: col, boxShadow: `0 0 5px ${col}` }} />
              <span style={{ color: col, fontSize: 10, fontFamily: "monospace", fontWeight: 700 }}>{lbl}</span>
              <span style={{ color: "#1e1e30", fontSize: 10 }}>— {note}</span>            </div>
          ))}
        </div>
      </div>
      {active && <Modal tool={active} onClose={() => setActive(null)} />}
    </div>
  );
}