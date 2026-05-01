import { useState, useCallback, useRef, useEffect } from "react";

/* ============================================================
   crafix — Full Platform
   Flow: Landing → Product Select → Editor → Review → Checkout → Success → Gallery
   ============================================================ */

// ─── MOCK DATA ───────────────────────────────────────────────
const FEATURED_DESIGNS = [
  { id: "f1", name: "Tokyo Nights", designer: "Kai M.", likes: 2847, color: "#1A1A2E", elements: [{ type: "text", content: "東京", x: 200, y: 250, fontSize: 52, color: "#E94560", font: "serif", rotation: 0, opacity: 100 }, { type: "text", content: "NIGHTS", x: 200, y: 300, fontSize: 18, color: "#FFFFFF", font: "monospace", rotation: 0, opacity: 80 }], tag: "Trending" },
  { id: "f2", name: "Minimal Arc", designer: "Sara L.", likes: 1923, color: "#F5F0E8", elements: [{ type: "shape", content: "◯", x: 200, y: 255, fontSize: 72, color: "#2D2D2D", rotation: 0, opacity: 100 }, { type: "text", content: "ARC", x: 200, y: 256, fontSize: 20, color: "#2D2D2D", font: "serif", rotation: 0, opacity: 100 }], tag: "Minimal" },
  { id: "f3", name: "Cosmic Wave", designer: "Dev R.", likes: 3201, color: "#0D1B2A", elements: [{ type: "shape", content: "〜", x: 200, y: 240, fontSize: 60, color: "#4ECDC4", rotation: 15, opacity: 90 }, { type: "text", content: "COSMIC", x: 200, y: 290, fontSize: 22, color: "#FFFFFF", font: "monospace", rotation: 0, opacity: 100 }], tag: "Trending" },
  { id: "f4", name: "Desert Sun", designer: "Mia K.", likes: 1456, color: "#E8D5B0", elements: [{ type: "shape", content: "☀", x: 200, y: 245, fontSize: 55, color: "#C65B00", rotation: 0, opacity: 100 }, { type: "text", content: "DESERT", x: 200, y: 298, fontSize: 18, color: "#5C3D11", font: "serif", rotation: 0, opacity: 100 }], tag: "New" },
  { id: "f5", name: "Street Code", designer: "Alex P.", likes: 2109, color: "#111111", elements: [{ type: "text", content: "> RUN", x: 200, y: 245, fontSize: 28, color: "#00FF41", font: "monospace", rotation: 0, opacity: 100 }, { type: "text", content: "0x4LIFE", x: 200, y: 280, fontSize: 16, color: "#666666", font: "monospace", rotation: 0, opacity: 100 }], tag: "Trending" },
  { id: "f6", name: "Bloom", designer: "Yuki S.", likes: 987, color: "#FFF0F3", elements: [{ type: "shape", content: "✿", x: 200, y: 248, fontSize: 64, color: "#FF6B9D", rotation: -10, opacity: 100 }, { type: "text", content: "bloom", x: 200, y: 300, fontSize: 16, color: "#D63E7A", font: "serif", rotation: 0, opacity: 80 }], tag: "New" },
];

const TSHIRT_COLORS = [
  { name: "Chalk", hex: "#FAFAFA" }, { name: "Onyx", hex: "#1A1A1A" },
  { name: "Navy", hex: "#1B2A4A" }, { name: "Ash", hex: "#9CA3AF" },
  { name: "Sage", hex: "#87A878" }, { name: "Rust", hex: "#C4622D" },
  { name: "Blush", hex: "#F4B8C1" }, { name: "Cobalt", hex: "#2563EB" },
  { name: "Midnight", hex: "#0F172A" }, { name: "Sand", hex: "#D4B896" },
  { name: "Forest", hex: "#2D4A35" }, { name: "Crimson", hex: "#9B1C1C" },
];
const SIZES = ["XS", "S", "M", "L", "XL", "2XL"];
const FONTS = ["Helvetica Neue", "Georgia", "Courier New", "Playfair Display", "Bebas Neue", "Montserrat"];
const SHAPES = ["★", "●", "◯", "▲", "♦", "✦", "☀", "✿", "⬡", "〜", "⊕", "⬭"];
const TEMPLATES = [
  { name: "Bold Type", elements: [{ type: "text", content: "YOUR TEXT", x: 200, y: 260, fontSize: 28, color: "#1A1A1A", font: "Helvetica Neue", rotation: 0, opacity: 100 }] },
  { name: "Star Drop", elements: [{ type: "shape", content: "★", x: 200, y: 250, fontSize: 48, color: "#F59E0B", rotation: 0, opacity: 100 }, { type: "text", content: "RISE", x: 200, y: 295, fontSize: 18, color: "#1A1A1A", font: "Helvetica Neue", rotation: 0, opacity: 100 }] },
  { name: "Circle Co.", elements: [{ type: "shape", content: "◯", x: 200, y: 255, fontSize: 72, color: "#6366F1", rotation: 0, opacity: 100 }, { type: "text", content: "EST. 2025", x: 200, y: 256, fontSize: 14, color: "#6366F1", font: "Courier New", rotation: 0, opacity: 100 }] },
];

// ─── UTILITY ─────────────────────────────────────────────────
const genId = () => Math.random().toString(36).slice(2, 9);
const isDarkColor = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
};
const formatPrice = (n) => `$${n.toFixed(2)}`;

// ─── ICONS ───────────────────────────────────────────────────
const Ic = ({ p, s = 16, sw = 1.75, f = "none", c = "currentColor" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={f} stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={p} />
  </svg>
);
const ic = {
  arrow_r: "M5 12h14M12 5l7 7-7 7", arrow_l: "M19 12H5M12 19l-7-7 7-7",
  check: "M20 6L9 17l-5-5", heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  eye_off: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22",
  lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  plus: "M12 5v14M5 12h14", close: "M18 6L6 18M6 6l12 12",
  undo: "M3 7v6h6M3 13A9 9 0 1 0 5.27 6.27", redo: "M21 7v6h-6M21 13A9 9 0 1 1 18.73 6.27",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  zoom_in: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35M11 8v6M8 11h6",
  zoom_out: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35M8 11h6",
  menu: "M3 12h18M3 6h18M3 18h18", share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13",
  package: "M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12",
  sparkle: "M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z",
  camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  truck: "M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  flag: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7",
  rotate: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  type: "M4 7V4h16v3M9 20h6M12 4v16",
  image_icon: "M21 15l-5-5L5 21M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  chevron_d: "M6 9l6 6 6-6", chevron_r: "M9 18l6-6-6-6",
  ai: "M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 0 2h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1 0-2h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z",
};

// ─── BASE COMPONENTS ─────────────────────────────────────────
const Btn = ({ ch, v = "ghost", sz = "md", onClick, cls = "", disabled, full }) => {
  const base = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap";
  const vs = {
    primary: "bg-gray-900 text-white hover:bg-gray-700 active:scale-95 shadow-lg shadow-gray-900/20",
    accent: "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-600/30",
    secondary: "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 active:scale-95 shadow-sm",
    ghost: "text-gray-600 hover:bg-gray-100 active:bg-gray-200",
    danger: "text-red-600 hover:bg-red-50",
    outline: "border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white active:scale-95",
  };
  const ss = { xs: "h-6 px-2.5 text-[11px] rounded-lg", sm: "h-8 px-3 text-xs rounded-xl", md: "h-10 px-5 text-sm rounded-xl", lg: "h-12 px-8 text-base rounded-2xl", xl: "h-14 px-10 text-base rounded-2xl", icon: "h-9 w-9 rounded-xl", "icon-sm": "h-7 w-7 rounded-lg" };
  return <button onClick={onClick} disabled={disabled} className={`${base} ${vs[v]} ${ss[sz]} ${full ? "w-full" : ""} ${cls}`}>{ch}</button>;
};

const Tag = ({ ch, color = "gray" }) => {
  const cs = { gray: "bg-gray-100 text-gray-600", indigo: "bg-indigo-50 text-indigo-700", amber: "bg-amber-50 text-amber-700", green: "bg-green-50 text-green-700", rose: "bg-rose-50 text-rose-700" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-widest ${cs[color]}`}>{ch}</span>;
};

const Toast = ({ msg, type = "success", onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
  return (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold animate-slide-up ${type === "success" ? "bg-gray-900" : "bg-red-600"}`}>
      <Ic p={type === "success" ? ic.check : ic.close} s={16} sw={2.5} />
      {msg}
    </div>
  );
};

// ─── T-SHIRT SVG ─────────────────────────────────────────────
const TShirt = ({ color = "#FAFAFA", elements = [], selectedId, onSelect, showGrid, scale = 1 }) => {
  const dark = isDarkColor(color);
  return (
    <div className="relative w-full max-w-[380px] mx-auto select-none">
      <svg viewBox="0 0 400 440" className="w-full drop-shadow-2xl">
        <defs>
          <filter id="sh"><feDropShadow dx="0" dy="12" stdDeviation="20" floodOpacity="0.15" /></filter>
          <clipPath id="tc"><path d="M145 28 L58 82 L28 162 L82 174 L82 402 L318 402 L318 174 L372 162 L342 82 L255 28 Q228 56 200 56 Q172 56 145 28Z" /></clipPath>
        </defs>
        <g filter="url(#sh)">
          <path d="M145 28 L58 82 L28 162 L82 174 L82 402 L318 402 L318 174 L372 162 L342 82 L255 28 Q228 56 200 56 Q172 56 145 28Z" fill={color} stroke={dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"} strokeWidth="1.5" />
          {/* Collar */}
          <path d="M145 28 Q172 56 200 56 Q228 56 255 28" fill="none" stroke={dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"} strokeWidth="2" />
          {/* Seams */}
          <path d="M82 174 L318 174" fill="none" stroke={dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"} strokeWidth="1" />
          <path d="M82 174 L82 402M318 174 L318 402" fill="none" stroke={dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"} strokeWidth="1" />
          {/* Fabric sheen */}
          <ellipse cx="150" cy="100" rx="40" ry="80" fill={dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.4)"} />
        </g>
        {/* Grid */}
        {showGrid && <g clipPath="url(#tc)" opacity="0.1"><>{Array.from({ length: 20 }).map((_, i) => <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="440" stroke="#6366F1" strokeWidth="0.5" />)}{Array.from({ length: 22 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 20} x2="400" y2={i * 20} stroke="#6366F1" strokeWidth="0.5" />)}</></g>}
        {/* Print boundary */}
        <rect x="122" y="183" width="156" height="175" rx="6" fill="none" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="7 4" opacity="0.5" />
        <text x="200" y="370" textAnchor="middle" fontSize="8.5" fill="#6366F1" opacity="0.5" fontFamily="system-ui" fontWeight="600">PRINT AREA</text>
        {/* Elements */}
        {elements.map(el => (
          <g key={el.id} transform={`translate(${el.x},${el.y}) rotate(${el.rotation || 0})`} onClick={e => { e.stopPropagation(); onSelect && onSelect(el.id); }} style={{ cursor: onSelect ? "pointer" : "default" }}>
            {(el.type === "text" || el.type === "shape") && (
              <text fontSize={el.fontSize || 22} fill={el.color || (dark ? "#fff" : "#111")} fontFamily={el.font || "Helvetica Neue"} fontWeight={el.bold ? "bold" : "600"} textAnchor="middle" dominantBaseline="middle" opacity={(el.opacity || 100) / 100} style={{ letterSpacing: el.type === "text" ? "0.05em" : 0 }}>{el.content}</text>
            )}
            {selectedId === el.id && <rect x="-65" y="-28" width="130" height="56" fill="none" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="5 3" rx="4" />}
          </g>
        ))}
      </svg>
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-gray-100 text-[10px] font-bold text-indigo-600 px-2.5 py-1.5 rounded-full shadow-sm">
        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />Print Safe
      </div>
    </div>
  );
};

// ─── DESIGN EDITOR PANELS ────────────────────────────────────
const LeftPanel = ({ onAddText, onAddShape, onLoadTemplate, tColor, onColor, isOpen, onClose }) => {
  const [sec, setSec] = useState({ text: true, upload: false, shapes: false, templates: false, color: true });
  const [txt, setTxt] = useState("YOUR TEXT");
  const [fSize, setFSize] = useState(24);
  const [tCol, setTCol] = useState("#1A1A1A");
  const [font, setFont] = useState("Helvetica Neue");
  const tog = k => setSec(s => ({ ...s, [k]: !s[k] }));

  const SecH = ({ k, label }) => (
    <button onClick={() => tog(k)} className="w-full flex items-center justify-between py-2.5 group">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">{label}</span>
      <Ic p={sec[k] ? ic.chevron_d : ic.chevron_r} s={12} c="#9CA3AF" />
    </button>
  );

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-[260px] bg-white border-r border-gray-100 flex flex-col overflow-hidden transition-transform duration-300 lg:relative lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="lg:hidden flex justify-between items-center p-4 border-b border-gray-100">
        <span className="text-sm font-bold text-gray-900">Tools</span>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><Ic p={ic.close} s={15} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-0.5">
        {/* TEXT */}
        <div className="border-b border-gray-50 pb-3">
          <SecH k="text" label="Add Text" />
          {sec.text && <div className="space-y-3 pt-1">
            <input value={txt} onChange={e => setTxt(e.target.value)} className="w-full h-9 px-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all" />
            <select value={font} onChange={e => setFont(e.target.value)} className="w-full h-9 px-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none appearance-none">
              {FONTS.map(f => <option key={f}>{f}</option>)}
            </select>
            <div className="flex gap-2 items-center">
              <div className="flex-1 space-y-1">
                <div className="flex justify-between"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Size</span><span className="text-[11px] font-bold text-gray-700">{fSize}px</span></div>
                <input type="range" min={10} max={64} value={fSize} onChange={e => setFSize(+e.target.value)} className="w-full accent-indigo-600 h-1.5" />
              </div>
              <input type="color" value={tCol} onChange={e => setTCol(e.target.value)} className="w-9 h-9 rounded-xl border border-gray-200 cursor-pointer p-0.5 flex-shrink-0 bg-white" />
            </div>
            <Btn v="accent" sz="sm" full onClick={() => onAddText({ content: txt, fontSize: fSize, color: tCol, font })} ch={<><Ic p={ic.plus} s={13} />Add Text</>} />
          </div>}
        </div>
        {/* UPLOAD */}
        <div className="border-b border-gray-50 pb-3">
          <SecH k="upload" label="Upload Image" />
          {sec.upload && <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 text-center hover:border-indigo-300 hover:bg-indigo-50/40 transition-all cursor-pointer">
            <Ic p={ic.image_icon} s={22} c="#D1D5DB" />
            <p className="text-xs font-semibold text-gray-500 mt-2">Drop image here</p>
            <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG, SVG • 10MB</p>
          </div>}
        </div>
        {/* SHAPES */}
        <div className="border-b border-gray-50 pb-3">
          <SecH k="shapes" label="Shapes & Icons" />
          {sec.shapes && <div className="grid grid-cols-6 gap-1 pt-1">
            {SHAPES.map(sh => <button key={sh} onClick={() => onAddShape(sh)} className="h-9 text-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all border border-transparent hover:border-indigo-200">{sh}</button>)}
          </div>}
        </div>
        {/* TEMPLATES */}
        <div className="border-b border-gray-50 pb-3">
          <SecH k="templates" label="Templates" />
          {sec.templates && <div className="space-y-1.5 pt-1">
            {TEMPLATES.map(t => <button key={t.name} onClick={() => onLoadTemplate(t.elements)} className="w-full text-left px-3 py-2.5 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 border border-transparent hover:border-indigo-200 rounded-xl text-xs font-semibold transition-all">{t.name}</button>)}
          </div>}
        </div>
        {/* T-SHIRT COLOR */}
        <div>
          <SecH k="color" label="Shirt Color" />
          {sec.color && <div className="grid grid-cols-6 gap-2 pt-1">
            {TSHIRT_COLORS.map(c => <button key={c.hex} title={c.name} onClick={() => onColor(c.hex)} style={{ backgroundColor: c.hex }} className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${tColor === c.hex ? "border-indigo-500 scale-110 shadow-md" : "border-gray-200"}`} />)}
          </div>}
        </div>
        {/* AI Button */}
        <div className="pt-3">
          <button className="w-full flex items-center justify-center gap-2 h-10 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-600 hover:from-indigo-100 hover:to-purple-100 transition-all">
            <Ic p={ic.sparkle} s={14} c="#6366F1" f="#6366F1" />✨ AI Design Suggestions
          </button>
        </div>
      </div>
    </aside>
  );
};

const RightPanel = ({ elements, selectedId, onSelect, onToggleVis, onLock, onDelete, onUpdate, isOpen, onClose }) => {
  const [tab, setTab] = useState("layers");
  const sel = elements.find(e => e.id === selectedId);
  return (
    <aside className={`fixed inset-y-0 right-0 z-40 w-[240px] bg-white border-l border-gray-100 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
      <div className="lg:hidden flex justify-between items-center p-4 border-b border-gray-100">
        <span className="text-sm font-bold">Panels</span>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><Ic p={ic.close} s={15} /></button>
      </div>
      <div className="p-3 border-b border-gray-100">
        <div className="flex bg-gray-100 rounded-xl p-0.5">
          {["layers", "props"].map(t => <button key={t} onClick={() => setTab(t)} className={`flex-1 h-8 text-[11px] font-bold rounded-[10px] transition-all capitalize ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>{t === "props" ? "Properties" : "Layers"}</button>)}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {tab === "layers" && (<div className="space-y-1">
          {elements.length === 0 ? <div className="text-center py-10"><Ic p={ic.layers} s={28} c="#E5E7EB" /><p className="text-xs text-gray-400 font-medium mt-3">No layers yet</p></div>
            : [...elements].reverse().map(el => (
              <div key={el.id} onClick={() => onSelect(el.id)} className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all group ${selectedId === el.id ? "bg-indigo-50 border border-indigo-200" : "hover:bg-gray-50 border border-transparent"}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 font-bold ${selectedId === el.id ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}>{el.type === "text" ? "T" : el.content?.slice(0, 1)}</div>
                <div className="flex-1 min-w-0"><p className="text-[11px] font-bold text-gray-800 truncate">{el.content}</p><p className="text-[10px] text-gray-400 capitalize">{el.type}</p></div>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={e => { e.stopPropagation(); onToggleVis(el.id); }} className="w-6 h-6 rounded flex items-center justify-center hover:bg-white transition-colors"><Ic p={el.visible !== false ? ic.eye : ic.eye_off} s={11} c="#9CA3AF" /></button>
                  <button onClick={e => { e.stopPropagation(); onDelete(el.id); }} className="w-6 h-6 rounded flex items-center justify-center hover:bg-red-50 transition-colors"><Ic p={ic.trash} s={11} c="#F87171" /></button>
                </div>
              </div>
            ))}
        </div>)}
        {tab === "props" && <div className="space-y-4">
          {!sel ? <div className="text-center py-10"><p className="text-xs text-gray-400 font-medium">Select an element</p></div>
            : <>
              <div className="grid grid-cols-2 gap-2">
                {[["X", "x"], ["Y", "y"]].map(([l, k]) => (
                  <div key={k}><label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">{l}</label>
                    <input type="number" value={sel[k] || 0} onChange={e => onUpdate(sel.id, { [k]: +e.target.value })} className="w-full h-8 px-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none text-center font-mono" /></div>
                ))}
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between"><span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Rotation</span><span className="text-[11px] font-mono text-gray-600">{sel.rotation || 0}°</span></div>
                <input type="range" min={-180} max={180} value={sel.rotation || 0} onChange={e => onUpdate(sel.id, { rotation: +e.target.value })} className="w-full accent-indigo-600 h-1.5" />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between"><span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Opacity</span><span className="text-[11px] font-mono text-gray-600">{sel.opacity || 100}%</span></div>
                <input type="range" min={0} max={100} value={sel.opacity || 100} onChange={e => onUpdate(sel.id, { opacity: +e.target.value })} className="w-full accent-indigo-600 h-1.5" />
              </div>
              {sel.type === "text" && <div className="space-y-1.5">
                <div className="flex justify-between"><span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Font Size</span><span className="text-[11px] font-mono text-gray-600">{sel.fontSize || 24}px</span></div>
                <input type="range" min={10} max={72} value={sel.fontSize || 24} onChange={e => onUpdate(sel.id, { fontSize: +e.target.value })} className="w-full accent-indigo-600 h-1.5" />
              </div>}
            </>}
        </div>}
      </div>
    </aside>
  );
};

// ═══════════════════════════════════════════════════════════════
//  PAGE COMPONENTS
// ═══════════════════════════════════════════════════════════════

// ─── LANDING PAGE ─────────────────────────────────────────────
const LandingPage = ({ onNavigate }) => {
  const [liked, setLiked] = useState({});
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Trending", "New", "Minimal"];
  const filtered = activeFilter === "All" ? FEATURED_DESIGNS : FEATURED_DESIGNS.filter(d => d.tag === activeFilter);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#FAFAF8]/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center"><span className="text-white text-xs font-black tracking-tight">TC</span></div>
            <span className="font-black text-gray-900 tracking-tight text-lg">ThreadCraft</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {["Explore", "How It Works", "Pricing"].map(l => <button key={l} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">{l}</button>)}
          </div>
          <div className="flex items-center gap-2">
            <Btn v="ghost" sz="sm" ch="Sign In" />
            <Btn v="primary" sz="sm" ch="Get Started" onClick={() => onNavigate("select")} />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.12),transparent)]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center relative">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-2 mb-8">
            <Ic p={ic.sparkle} s={13} c="#6366F1" f="#6366F1" />
            <span className="text-xs font-bold text-indigo-600">Premium Custom Apparel Platform</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight mb-6">
            Design the shirt<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">only you could make.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">Create, customize, and order premium t-shirts with an editor built for creatives. Your design, your rules.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Btn v="primary" sz="lg" ch={<>Start Designing <Ic p={ic.arrow_r} s={16} /></>} onClick={() => onNavigate("select")} />
            <Btn v="secondary" sz="lg" ch="Explore Community" onClick={() => onNavigate("gallery")} />
          </div>
          {/* Stats */}
          <div className="flex justify-center gap-10 mt-14 pt-8 border-t border-gray-100">
            {[["12,400+", "Designs Created"], ["98%", "Happy Customers"], ["3–5 days", "Delivery"]].map(([n, l]) => (
              <div key={l} className="text-center"><p className="text-2xl font-black text-gray-900">{n}</p><p className="text-xs text-gray-400 font-medium mt-0.5">{l}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Community Spotlight</h2>
            <p className="text-gray-400 text-sm mt-1">Top designs from the ThreadCraft community</p>
          </div>
          <div className="flex gap-1.5 bg-gray-100 rounded-2xl p-1">
            {filters.map(f => <button key={f} onClick={() => setActiveFilter(f)} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeFilter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{f}</button>)}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {filtered.map((d, i) => (
            <div key={d.id} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="aspect-square relative overflow-hidden" style={{ backgroundColor: d.color + "20" }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <TShirt color={d.color} elements={d.elements} scale={0.6} />
                </div>
                <div className="absolute top-3 left-3"><Tag ch={d.tag} color={d.tag === "Trending" ? "amber" : d.tag === "New" ? "green" : "indigo"} /></div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div><p className="font-bold text-gray-900 text-sm">{d.name}</p><p className="text-[11px] text-gray-400 mt-0.5">by {d.designer}</p></div>
                  <button onClick={() => setLiked(l => ({ ...l, [d.id]: !l[d.id] }))} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${liked[d.id] ? "bg-rose-50 text-rose-600" : "bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-600"}`}>
                    <Ic p={ic.heart} s={13} f={liked[d.id] ? "#F43F5E" : "none"} c={liked[d.id] ? "#F43F5E" : "currentColor"} />
                    {d.likes + (liked[d.id] ? 1 : 0)}
                  </button>
                </div>
                <Btn v="outline" sz="xs" full ch="Use This Design →" onClick={() => onNavigate("editor", { elements: d.elements, color: d.color })} />
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Btn v="secondary" sz="md" ch="View All Designs →" onClick={() => onNavigate("gallery")} />
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-black text-white mb-2">From idea to doorstep</h2>
          <p className="text-gray-400 mb-12 text-sm">Four simple steps to your perfect shirt</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[["01", "Choose", "Pick your size and base color"], ["02", "Design", "Use our editor to create something unique"], ["03", "Order", "Review and place your order securely"], ["04", "Receive", "Get your shirt in 3–5 business days"]].map(([n, title, desc]) => (
              <div key={n} className="text-left">
                <div className="text-[10px] font-black text-indigo-400 tracking-widest mb-3">{n}</div>
                <h3 className="text-white font-black text-lg mb-1.5">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <Btn v="accent" sz="lg" cls="mt-12" ch={<>Start Creating <Ic p={ic.arrow_r} s={16} /></>} onClick={() => onNavigate("select")} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2"><div className="w-6 h-6 bg-gray-900 rounded-lg flex items-center justify-center"><span className="text-white text-[9px] font-black">TC</span></div><span className="font-black text-gray-900 text-sm">ThreadCraft</span></div>
          <p className="text-xs text-gray-400">© 2025 ThreadCraft. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// ─── PRODUCT SELECTION ────────────────────────────────────────
const SelectPage = ({ onNavigate }) => {
  const [size, setSize] = useState("M");
  const [color, setColor] = useState("#FAFAFA");
  const colorName = TSHIRT_COLORS.find(c => c.hex === color)?.name;

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <button onClick={() => onNavigate("landing")} className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors mb-8">
          <Ic p={ic.arrow_l} s={16} />Back to Home
        </button>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Preview */}
          <div className="sticky top-8">
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <TShirt color={color} elements={[]} />
              <div className="mt-4 flex items-center justify-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-gray-300" style={{ backgroundColor: color }} />
                <span className="text-sm font-semibold text-gray-700">{colorName}</span>
                <span className="text-gray-300">·</span>
                <span className="text-sm font-semibold text-gray-700">Size {size}</span>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Step 1 of 2</div>
              <h1 className="text-4xl font-black text-gray-900 leading-tight">Choose your canvas.</h1>
              <p className="text-gray-400 mt-2">Start by picking a size and color. You'll design next.</p>
            </div>

            {/* Size */}
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(s => (
                  <button key={s} onClick={() => setSize(s)} className={`w-16 h-16 rounded-2xl text-sm font-black border-2 transition-all ${size === s ? "border-gray-900 bg-gray-900 text-white shadow-lg scale-105" : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"}`}>{s}</button>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-3">All garments are 100% premium combed cotton, true-to-size fit. <span className="underline cursor-pointer">Size Guide →</span></p>
            </div>

            {/* Color */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Select Color</p>
                <span className="text-xs font-semibold text-gray-500">{colorName}</span>
              </div>
              <div className="grid grid-cols-6 gap-2.5">
                {TSHIRT_COLORS.map(c => (
                  <button key={c.hex} title={c.name} onClick={() => setColor(c.hex)} style={{ backgroundColor: c.hex }} className={`w-11 h-11 rounded-full border-2 transition-all hover:scale-110 ${color === c.hex ? "border-indigo-500 scale-110 shadow-lg ring-2 ring-indigo-200" : "border-gray-200"}`}>
                    {color === c.hex && <span className="flex items-center justify-center w-full h-full"><Ic p={ic.check} s={14} c={isDarkColor(c.hex) ? "#fff" : "#111"} sw={3} /></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
              <div><p className="text-xs text-gray-400 font-medium">Base Price</p><p className="text-2xl font-black text-gray-900">$29.99</p></div>
              <div className="text-right text-xs text-gray-400">
                <p>Free shipping over $60</p><p>Returns within 30 days</p>
              </div>
            </div>

            <Btn v="primary" sz="xl" full ch={<>Customize Now <Ic p={ic.arrow_r} s={18} /></>} onClick={() => onNavigate("editor", { size, color })} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── DESIGN EDITOR ────────────────────────────────────────────
const EditorPage = ({ state, onNavigate, showToast }) => {
  const [elements, setElements] = useState(state?.elements || []);
  const [selId, setSelId] = useState(null);
  const [face, setFace] = useState("front");
  const [tColor, setTColor] = useState(state?.color || "#FAFAFA");
  const [zoom, setZoom] = useState(100);
  const [grid, setGrid] = useState(false);
  const [history, setHistory] = useState([state?.elements || []]);
  const [hIdx, setHIdx] = useState(0);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  const push = (els) => { const h = history.slice(0, hIdx + 1); h.push(els); setHistory(h); setHIdx(h.length - 1); };
  const addText = (props) => { const el = { id: genId(), type: "text", x: 200, y: 260, rotation: 0, opacity: 100, visible: true, ...props }; const n = [...elements, el]; setElements(n); push(n); setSelId(el.id); };
  const addShape = (s) => { const el = { id: genId(), type: "shape", content: s, x: 200, y: 265, fontSize: 36, color: "#6366F1", rotation: 0, opacity: 100, visible: true }; const n = [...elements, el]; setElements(n); push(n); setSelId(el.id); };
  const loadTpl = (els) => { const mapped = els.map(e => ({ ...e, id: genId() })); const n = [...elements, ...mapped]; setElements(n); push(n); showToast("Template loaded!"); };
  const undo = () => { if (hIdx > 0) { setHIdx(hIdx - 1); setElements(history[hIdx - 1]); } };
  const redo = () => { if (hIdx < history.length - 1) { setHIdx(hIdx + 1); setElements(history[hIdx + 1]); } };

  const finalize = () => {
    if (elements.length === 0) { showToast("Add at least one element before finalizing!", "error"); return; }
    onNavigate("review", { elements, color: tColor, size: state?.size || "M" });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Editor Header */}
      <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-5 flex-shrink-0 z-30 relative">
        <div className="flex items-center gap-2">
          <button onClick={() => setLeftOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"><Ic p={ic.menu} s={18} /></button>
          <button onClick={() => onNavigate("select")} className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors">
            <Ic p={ic.arrow_l} s={15} /><span className="hidden sm:block">Back</span>
          </button>
          <div className="w-px h-5 bg-gray-200 mx-2 hidden sm:block" />
          <div className="flex items-center gap-2 hidden sm:flex">
            <div className="w-6 h-6 bg-gray-900 rounded-lg flex items-center justify-center"><span className="text-white text-[9px] font-black">TC</span></div>
            <span className="font-black text-gray-900 text-sm">Editor</span>
          </div>
        </div>
        {/* Face toggle */}
        <div className="bg-gray-100 rounded-full p-1 flex">
          {["Front", "Back"].map(f => <button key={f} onClick={() => setFace(f.toLowerCase())} className={`h-7 px-4 rounded-full text-xs font-bold transition-all ${face === f.toLowerCase() ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>{f}</button>)}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setRightOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"><Ic p={ic.layers} s={18} /></button>
          <Btn v="ghost" sz="sm" ch="Save Draft" onClick={() => showToast("Draft saved!")} cls="hidden sm:flex" />
          <Btn v="accent" sz="sm" ch={<>Finalize <Ic p={ic.check} s={13} /></>} onClick={finalize} />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <LeftPanel onAddText={addText} onAddShape={addShape} onLoadTemplate={loadTpl} tColor={tColor} onColor={setTColor} isOpen={leftOpen} onClose={() => setLeftOpen(false)} />

        {/* Overlay */}
        {(leftOpen || rightOpen) && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => { setLeftOpen(false); setRightOpen(false); }} />}

        {/* Canvas */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto flex items-center justify-center p-6 lg:p-10" onClick={() => setSelId(null)}>
            <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center center", transition: "transform 0.2s ease" }} className="w-full max-w-[360px]">
              <TShirt color={tColor} elements={elements.filter(e => e.visible !== false)} selectedId={selId} onSelect={setSelId} showGrid={grid} />
            </div>
          </div>
          {/* Context bar */}
          {selId && <div className="mx-auto mb-2 flex items-center gap-1 bg-white rounded-2xl shadow-sm border border-gray-100 px-3 py-2">
            <span className="text-[11px] text-gray-400 mr-1">Element:</span>
            <Btn v="ghost" sz="icon-sm" ch={<Ic p={ic.rotate} s={13} />} onClick={() => { const el = elements.find(e => e.id === selId); if (el) setElements(elements.map(e => e.id === selId ? { ...e, rotation: (e.rotation || 0) + 15 } : e)); }} />
            <Btn v="danger" sz="icon-sm" ch={<Ic p={ic.trash} s={13} />} onClick={() => { setElements(elements.filter(e => e.id !== selId)); setSelId(null); }} />
          </div>}
          {/* Bottom bar */}
          <div className="h-14 bg-white border-t border-gray-100 flex items-center justify-between px-4 gap-3 flex-shrink-0">
            <div className="flex items-center gap-1">
              <Btn v="ghost" sz="icon-sm" ch={<Ic p={ic.undo} s={14} />} onClick={undo} disabled={hIdx === 0} />
              <Btn v="ghost" sz="icon-sm" ch={<Ic p={ic.redo} s={14} />} onClick={redo} disabled={hIdx >= history.length - 1} />
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <button onClick={() => setGrid(g => !g)} className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ${grid ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100 text-gray-500"}`}><Ic p={ic.grid} s={13} /></button>
              <button onClick={() => { setElements([]); setSelId(null); push([]); }} className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-500">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="h-7 w-7 rounded-lg hover:bg-gray-100 flex items-center justify-center"><Ic p={ic.zoom_out} s={13} c="#6B7280" /></button>
              <span className="text-xs font-bold text-gray-600 w-8 text-center tabular-nums">{zoom}%</span>
              <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="h-7 w-7 rounded-lg hover:bg-gray-100 flex items-center justify-center"><Ic p={ic.zoom_in} s={13} c="#6B7280" /></button>
            </div>
            <Btn v="primary" sz="sm" ch="Finalize Design →" onClick={finalize} cls="hidden sm:flex" />
          </div>
        </main>

        {/* Right panel */}
        <RightPanel elements={elements} selectedId={selId} onSelect={setSelId}
          onToggleVis={id => setElements(elements.map(e => e.id === id ? { ...e, visible: e.visible === false ? true : false } : e))}
          onLock={id => setElements(elements.map(e => e.id === id ? { ...e, locked: !e.locked } : e))}
          onDelete={id => { setElements(elements.filter(e => e.id !== id)); setSelId(null); }}
          onUpdate={(id, props) => setElements(elements.map(e => e.id === id ? { ...e, ...props } : e))}
          isOpen={rightOpen} onClose={() => setRightOpen(false)} />
      </div>
    </div>
  );
};

// ─── REVIEW PAGE ──────────────────────────────────────────────
const ReviewPage = ({ state, onNavigate }) => {
  const [agreed, setAgreed] = useState(false);
  const [face, setFace] = useState("front");

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <button onClick={() => onNavigate("editor", state)} className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors mb-8">
          <Ic p={ic.arrow_l} s={16} />Back to Editor
        </button>
        <div className="grid lg:grid-cols-[1fr_420px] gap-10">
          {/* Preview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-black text-gray-900">Review Your Design</h1>
              <div className="bg-gray-100 rounded-full p-1 flex">
                {["Front", "Back"].map(f => <button key={f} onClick={() => setFace(f.toLowerCase())} className={`h-7 px-4 rounded-full text-xs font-bold transition-all ${face === f.toLowerCase() ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>{f}</button>)}
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <TShirt color={state?.color} elements={face === "front" ? (state?.elements || []) : []} />
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Tag ch={`Size: ${state?.size || "M"}`} color="gray" />
              <Tag ch={TSHIRT_COLORS.find(c => c.hex === state?.color)?.name || "White"} color="indigo" />
              <Tag ch={`${(state?.elements || []).length} Elements`} color="gray" />
            </div>
          </div>
          {/* Details */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 mb-4">Design Summary</h3>
              <div className="space-y-3">
                {[["Product", "Premium Custom T-Shirt"], ["Size", state?.size || "M"], ["Color", TSHIRT_COLORS.find(c => c.hex === state?.color)?.name || "White"], ["Elements", `${(state?.elements || []).length} layers`], ["Print Method", "Direct-to-Garment (DTG)"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-gray-400">{k}</span>
                    <span className="font-semibold text-gray-900">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 mb-4">Pricing</h3>
              <div className="space-y-2">
                {[["Base Shirt", "$24.99"], ["DTG Printing", "$5.00"], ["Design Fee", "Free"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm"><span className="text-gray-400">{k}</span><span className="font-medium text-gray-700">{v}</span></div>
                ))}
                <div className="border-t border-gray-100 pt-2 flex justify-between text-sm font-black text-gray-900"><span>Total (1 item)</span><span>$29.99</span></div>
              </div>
            </div>

            <label className="flex items-start gap-3 bg-indigo-50 border border-indigo-200 rounded-2xl p-4 cursor-pointer hover:bg-indigo-100 transition-colors">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 accent-indigo-600 flex-shrink-0" />
              <span className="text-xs text-gray-700 leading-relaxed font-medium">I confirm this design is my original creation or I have rights to use all elements. I accept ThreadCraft's <span className="text-indigo-600 underline">Terms of Service</span>.</span>
            </label>

            <div className="flex gap-3">
              <Btn v="secondary" sz="md" ch={<><Ic p={ic.edit} s={14} />Edit</>} onClick={() => onNavigate("editor", state)} cls="flex-1" />
              <Btn v="primary" sz="md" ch="Proceed to Order →" disabled={!agreed} onClick={() => onNavigate("checkout", state)} cls="flex-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── CHECKOUT PAGE ────────────────────────────────────────────
const CheckoutPage = ({ state, onNavigate, showToast }) => {
  const [qty, setQty] = useState(1);
  const [step, setStep] = useState("address"); // address | payment
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", state_: "", zip: "", country: "United States" });
  const [payment, setPayment] = useState({ card: "", expiry: "", cvv: "", name: "" });
  const base = 29.99;
  const shipping = qty >= 2 ? 0 : 4.99;
  const discount = qty >= 3 ? base * qty * 0.1 : 0;
  const total = base * qty + shipping - discount;

  const placeOrder = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); showToast("Order placed successfully!"); onNavigate("success", { ...state, orderId: "TC-" + Math.random().toString(36).slice(2, 8).toUpperCase(), qty, total }); }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <button onClick={() => onNavigate("review", state)} className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors mb-8">
          <Ic p={ic.arrow_l} s={16} />Back to Review
        </button>
        <div className="grid lg:grid-cols-[1fr_360px] gap-10">
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-gray-900">Checkout</h1>
            {/* Steps */}
            <div className="flex gap-2">
              {["Address", "Payment"].map((s, i) => (
                <div key={s} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${(i === 0 && step === "address") || (i === 1 && step === "payment") ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${(i === 0 && step === "address") || (i === 1 && step === "payment") ? "bg-white text-gray-900" : "bg-gray-300 text-white"}`}>{i + 1}</span>{s}
                </div>
              ))}
            </div>

            {step === "address" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                <h3 className="font-black text-gray-900">Delivery Address</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[["Full Name", "name", "John Doe"], ["Email", "email", "john@example.com"], ["Phone", "phone", "+1 (555) 000-0000"], ["Address", "address", "123 Main St"], ["City", "city", "San Francisco"], ["State", "state_", "CA"], ["ZIP Code", "zip", "94102"], ["Country", "country", "United States"]].map(([l, k, ph]) => (
                    <div key={k} className={k === "address" || k === "country" ? "sm:col-span-2" : ""}>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">{l}</label>
                      <input value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} placeholder={ph}
                        className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all" />
                    </div>
                  ))}
                </div>
                <Btn v="primary" sz="md" full ch="Continue to Payment →" onClick={() => setStep("payment")} />
              </div>
            )}

            {step === "payment" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-gray-900">Payment Details</h3>
                  <div className="flex gap-1.5">
                    {["VISA", "MC", "AMEX"].map(c => <span key={c} className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-500">{c}</span>)}
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">Card Number</label>
                    <input value={payment.card} onChange={e => setPayment(p => ({ ...p, card: e.target.value }))} placeholder="1234 5678 9012 3456"
                      className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all font-mono" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">Expiry</label>
                      <input value={payment.expiry} onChange={e => setPayment(p => ({ ...p, expiry: e.target.value }))} placeholder="MM / YY" className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none font-mono" /></div>
                    <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">CVV</label>
                      <input value={payment.cvv} onChange={e => setPayment(p => ({ ...p, cvv: e.target.value }))} placeholder="···" className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none font-mono" /></div>
                  </div>
                  <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">Name on Card</label>
                    <input value={payment.name} onChange={e => setPayment(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none" /></div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  256-bit SSL encryption. Your payment info is secure.
                </div>
                <div className="flex gap-3">
                  <Btn v="secondary" sz="md" ch="← Back" onClick={() => setStep("address")} />
                  <Btn v="primary" sz="md" ch={loading ? "Processing…" : `Place Order · ${formatPrice(total)}`} disabled={loading} onClick={placeOrder} cls="flex-1" />
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-black text-gray-900 mb-4">Order Summary</h3>
              <div className="bg-gray-50 rounded-xl p-3 mb-4">
                <TShirt color={state?.color} elements={state?.elements || []} />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0" style={{ backgroundColor: state?.color }} />
                <span className="text-xs font-semibold text-gray-700">{TSHIRT_COLORS.find(c => c.hex === state?.color)?.name} · Size {state?.size}</span>
              </div>
              {/* Qty */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Quantity</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-bold flex items-center justify-center transition-colors">−</button>
                  <span className="w-8 text-center text-sm font-black">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-bold flex items-center justify-center transition-colors">+</button>
                </div>
              </div>
              {qty >= 3 && <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2 mb-4"><Ic p={ic.check} s={13} c="#16A34A" /><span className="text-xs font-bold text-green-700">10% bulk discount applied!</span></div>}
              <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
                {[["Subtotal", formatPrice(base * qty)], ["Shipping", qty >= 2 ? "Free" : formatPrice(shipping)], discount > 0 && ["Bulk Discount (10%)", `-${formatPrice(discount)}`]].filter(Boolean).map(([k, v]) => (
                  <div key={k} className="flex justify-between"><span className="text-gray-400">{k}</span><span className={`font-medium ${k.includes("Discount") ? "text-green-600" : "text-gray-700"}`}>{v}</span></div>
                ))}
                <div className="flex justify-between font-black text-gray-900 border-t border-gray-100 pt-2"><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-700 font-medium">
              <p className="font-bold mb-1">📦 Estimated Delivery</p>
              <p>3–5 business days after production (2–3 days)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SUCCESS PAGE ─────────────────────────────────────────────
const SuccessPage = ({ state, onNavigate, showToast }) => {
  const [submitted, setSubmitted] = useState(false);
  const delivery = new Date(); delivery.setDate(delivery.getDate() + 8);
  const deliveryStr = delivery.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center space-y-6">
        {/* Checkmark animation */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto border-4 border-green-200">
          <Ic p={ic.check} s={32} c="#16A34A" sw={3} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Order Confirmed! 🎉</h1>
          <p className="text-gray-500">Your custom shirt is in production. We'll email updates to your inbox.</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm text-left space-y-3">
          {[["Order ID", state?.orderId], ["Quantity", `${state?.qty || 1} shirt${(state?.qty || 1) > 1 ? "s" : ""}`], ["Amount Paid", formatPrice(state?.total || 29.99)], ["Est. Delivery", deliveryStr]].map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm"><span className="text-gray-400">{k}</span><span className="font-bold text-gray-900">{v}</span></div>
          ))}
        </div>

        {/* Design preview */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <TShirt color={state?.color} elements={state?.elements || []} />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm">
            <Ic p={ic.truck} s={20} c="#6366F1" />
            <span className="text-xs font-bold text-gray-700">Track Order</span>
          </button>
          <button onClick={() => showToast("Share link copied!")} className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm">
            <Ic p={ic.share} s={20} c="#6366F1" />
            <span className="text-xs font-bold text-gray-700">Share Design</span>
          </button>
          <button onClick={() => { setSubmitted(true); showToast("Design submitted to gallery! 🌟"); }} className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm">
            <Ic p={submitted ? ic.star : ic.sparkle} s={20} c={submitted ? "#F59E0B" : "#6366F1"} f={submitted ? "#F59E0B" : "none"} />
            <span className="text-xs font-bold text-gray-700">{submitted ? "Submitted!" : "Feature Me"}</span>
          </button>
        </div>

        {submitted && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm font-medium text-amber-800">
            ⭐ Your design has been submitted to the featured gallery for review. Top designs get featured for the whole community!
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Btn v="outline" sz="md" ch="Design Another" onClick={() => onNavigate("select")} />
          <Btn v="primary" sz="md" ch="Explore Gallery" onClick={() => onNavigate("gallery")} />
        </div>
      </div>
    </div>
  );
};

// ─── GALLERY PAGE ─────────────────────────────────────────────
const GalleryPage = ({ onNavigate }) => {
  const [liked, setLiked] = useState({});
  const [filter, setFilter] = useState("All");
  const [reported, setReported] = useState({});
  const filters = ["All", "Trending", "New", "Minimal", "Most Liked"];
  const sorted = filter === "Most Liked"
    ? [...FEATURED_DESIGNS].sort((a, b) => b.likes - a.likes)
    : filter === "All" ? FEATURED_DESIGNS : FEATURED_DESIGNS.filter(d => d.tag === filter);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <button onClick={() => onNavigate("landing")} className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors mb-8">
          <Ic p={ic.arrow_l} s={16} />Back to Home
        </button>
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Community Gallery</h1>
          <p className="text-gray-400">Discover designs from the ThreadCraft community. Get inspired, learn, and customize.</p>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map(f => <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all ${filter === f ? "bg-gray-900 text-white border-gray-900" : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"}`}>{f}</button>)}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sorted.map(d => (
            <div key={d.id} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="aspect-square relative overflow-hidden" style={{ backgroundColor: d.color + "18" }}>
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <TShirt color={d.color} elements={d.elements} />
                </div>
                <div className="absolute top-3 left-3"><Tag ch={d.tag} color={d.tag === "Trending" ? "amber" : d.tag === "New" ? "green" : "indigo"} /></div>
                {/* Report */}
                <button onClick={() => setReported(r => ({ ...r, [d.id]: true }))} className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all ${reported[d.id] ? "bg-red-100" : "bg-white/80"}`} title="Report design">
                  <Ic p={ic.flag} s={11} c={reported[d.id] ? "#DC2626" : "#9CA3AF"} />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div><p className="font-bold text-gray-900 text-sm">{d.name}</p><p className="text-[11px] text-gray-400">by {d.designer}</p></div>
                  <button onClick={() => setLiked(l => ({ ...l, [d.id]: !l[d.id] }))} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${liked[d.id] ? "bg-rose-50 text-rose-600" : "bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-500"}`}>
                    <Ic p={ic.heart} s={12} f={liked[d.id] ? "#F43F5E" : "none"} c={liked[d.id] ? "#F43F5E" : "currentColor"} />
                    {d.likes + (liked[d.id] ? 1 : 0)}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <Btn v="ghost" sz="xs" ch="Inspire →" cls="text-gray-500" onClick={() => onNavigate("editor", { elements: d.elements, color: d.color })} />
                  <Btn v="accent" sz="xs" ch="Use This" onClick={() => onNavigate("editor", { elements: d.elements, color: d.color })} />
                </div>
              </div>
            </div>
          ))}
          {/* Empty submit card */}
          <div onClick={() => onNavigate("select")} className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center aspect-square cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
              <Ic p={ic.plus} s={20} c="#6366F1" />
            </div>
            <p className="text-xs font-bold text-gray-600">Create & Submit</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Your design here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("landing");
  const [pageState, setPageState] = useState(null);
  const [toast, setToast] = useState(null);

  const navigate = useCallback((to, state = null) => {
    setPage(to);
    setPageState(state);
    window.scrollTo(0, 0);
  }, []);

  const showToast = (msg, type = "success") => setToast({ msg, type, id: Date.now() });

  return (
    <div className="font-sans antialiased">
      {page === "landing" && <LandingPage onNavigate={navigate} />}
      {page === "select" && <SelectPage onNavigate={navigate} />}
      {page === "editor" && <EditorPage state={pageState} onNavigate={navigate} showToast={showToast} />}
      {page === "review" && <ReviewPage state={pageState} onNavigate={navigate} />}
      {page === "checkout" && <CheckoutPage state={pageState} onNavigate={navigate} showToast={showToast} />}
      {page === "success" && <SuccessPage state={pageState} onNavigate={navigate} showToast={showToast} />}
      {page === "gallery" && <GalleryPage onNavigate={navigate} />}

      {toast && <Toast key={toast.id} msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'DM Sans', system-ui, -apple-system, sans-serif; }
        input[type=range] { -webkit-appearance: none; appearance: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #4F46E5; cursor: pointer; box-shadow: 0 1px 4px rgba(79,70,229,0.4); }
        input[type=range]::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: #4F46E5; cursor: pointer; border: none; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 4px; }
        @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.3s ease forwards; }
      `}</style>
    </div>
  );
}