import { useState, useRef, useCallback } from "react";

const TOOLS = [
  {
    id: "img-convert",
    label: "Image Convert",
    icon: "⇄",
    tag: "INSTANT",
    tagColor: "#00ff9d",
    desc: "JPG ↔ PNG ↔ WEBP",
    category: "image",
    accept: "image/*",
  },
  {
    id: "img-resize",
    label: "Resize & Crop",
    icon: "⊡",
    tag: "INSTANT",
    tagColor: "#00ff9d",
    desc: "Resize, crop, compress",
    category: "image",
    accept: "image/*",
  },
  {
    id: "img-bg",
    label: "Remove Background",
    icon: "✦",
    tag: "AI API",
    tagColor: "#ff6b35",
    desc: "remove.bg / ClipDrop",
    category: "ai",
    accept: "image/*",
  },
  {
    id: "img-upscale",
    label: "AI Upscale",
    icon: "↑↑",
    tag: "AI API",
    tagColor: "#ff6b35",
    desc: "Replicate / TensorFlow",
    category: "ai",
    accept: "image/*",
  },
  {
    id: "pdf-img",
    label: "PDF → Image",
    icon: "⬡",
    tag: "NODE.JS",
    tagColor: "#7c6fcd",
    desc: "Extract pages as images",
    category: "pdf",
    accept: ".pdf",
  },
  {
    id: "img-pdf",
    label: "Image → PDF",
    icon: "⬢",
    tag: "INSTANT",
    tagColor: "#00ff9d",
    desc: "Combine images to PDF",
    category: "pdf",
    accept: "image/*",
  },
  {
    id: "docx-pdf",
    label: "DOCX → PDF",
    icon: "⬛",
    tag: "BACKEND",
    tagColor: "#7c6fcd",
    desc: "LibreOffice / Puppeteer",
    category: "doc",
    accept: ".docx,.doc",
  },
  {
    id: "ai-analyze",
    label: "AI Analyze",
    icon: "◈",
    tag: "AI",
    tagColor: "#ff6b35",
    desc: "Describe & analyze file",
    category: "ai",
    accept: "image/*",
  },
];

const CATEGORY_COLORS = {
  image: "#00ff9d",
  ai: "#ff6b35",
  pdf: "#7c6fcd",
  doc: "#4ecdc4",
};

function useImageConvert() {
  return useCallback((file, targetFormat) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (targetFormat === "jpeg") {
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        const mimeType =
          targetFormat === "webp"
            ? "image/webp"
            : targetFormat === "jpeg"
            ? "image/jpeg"
            : "image/png";
        canvas.toBlob((blob) => {
          if (blob) resolve({ blob, mimeType, ext: targetFormat === "jpeg" ? "jpg" : targetFormat });
          else reject(new Error("Conversion failed"));
        }, mimeType, 0.92);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = url;
    });
  }, []);
}

function useImageResize() {
  return useCallback((file, width, height, quality) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ratio = img.width / img.height;
        if (width && !height) height = Math.round(width / ratio);
        if (height && !width) width = Math.round(height * ratio);
        canvas.width = width || img.width;
        canvas.height = height || img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        canvas.toBlob((blob) => {
          if (blob) resolve({ blob, mimeType: "image/jpeg", ext: "jpg" });
          else reject(new Error("Resize failed"));
        }, "image/jpeg", quality / 100);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = url;
    });
  }, []);
}

function useImageToPDF() {
  return useCallback(async (files) => {
    const { jsPDF } = await import("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js").then(
      () => window.jspdf
    ).catch(() => {
      throw new Error("jsPDF not available — using canvas fallback");
    });
    const doc = new jsPDF();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const dataUrl = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      if (i > 0) doc.addPage();
      const img = new Image();
      await new Promise((res) => {
        img.onload = res;
        img.src = dataUrl;
      });
      const pw = doc.internal.pageSize.getWidth();
      const ph = doc.internal.pageSize.getHeight();
      const ratio = Math.min(pw / img.width, ph / img.height);
      const w = img.width * ratio;
      const h = img.height * ratio;
      const x = (pw - w) / 2;
      const y = (ph - h) / 2;
      doc.addImage(dataUrl, "JPEG", x, y, w, h);
    }
    const blob = doc.output("blob");
    return { blob, mimeType: "application/pdf", ext: "pdf" };
  }, []);
}

function useAIAnalyze() {
  return useCallback(async (file) => {
    const toBase64 = (f) =>
      new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.onerror = rej;
        r.readAsDataURL(f);
      });
    
    const base64 = await toBase64(file);
    const mediaType = file.type;

    // 🔁 OpenAI API Call (replaces Anthropic)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this image thoroughly. Describe: 1) What you see, 2) Colors & composition, 3) Quality assessment, 4) Suggested improvements or use cases. Be concise but insightful." },
              { type: "image_url", image_url: { url: `data:${mediaType};base64,${base64}` } }
            ]
          }
        ],
        max_tokens: 1000
      })
    });

    const data = await response.json();
    
    // 🔁 OpenAI response structure (different from Anthropic)
    return data.choices?.[0]?.message?.content || "No analysis available.";
  }, []);
}

function DropZone({ tool, onFiles }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles(files);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${dragging ? CATEGORY_COLORS[tool.category] : "#2a2a3a"}`,
        borderRadius: 12,
        padding: "32px 24px",
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.2s",
        background: dragging ? `${CATEGORY_COLORS[tool.category]}0a` : "transparent",
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.5 }}>📂</div>
      <div style={{ color: "#888", fontSize: 13 }}>
        Drop file here or <span style={{ color: CATEGORY_COLORS[tool.category] }}>click to browse</span>
      </div>
      <div style={{ color: "#555", fontSize: 11, marginTop: 4 }}>Accepts: {tool.accept}</div>
      <input
        ref={inputRef}
        type="file"
        accept={tool.accept}
        multiple={tool.id === "img-pdf"}
        style={{ display: "none" }}
        onChange={(e) => onFiles(Array.from(e.target.files))}
      />
    </div>
  );
}

function ToolPanel({ tool, onClose }) {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | processing | done | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [config, setConfig] = useState({ format: "png", width: "", height: "", quality: 85 });
  const [aiText, setAiText] = useState("");

  const convertImage = useImageConvert();
  const resizeImage = useImageResize();
  const imagesToPDF = useImageToPDF();
  const aiAnalyze = useAIAnalyze();

  const preview = files[0] && files[0].type.startsWith("image/")
    ? URL.createObjectURL(files[0])
    : null;

  const handleProcess = async () => {
    if (!files.length) return;
    setStatus("processing");
    setError("");
    setAiText("");
    try {
      if (tool.id === "img-convert") {
        const out = await convertImage(files[0], config.format);
        setResult(out);
      } else if (tool.id === "img-resize") {
        const out = await resizeImage(files[0], parseInt(config.width) || 0, parseInt(config.height) || 0, config.quality);
        setResult(out);
      } else if (tool.id === "img-pdf") {
        const out = await imagesToPDF(files);
        setResult(out);
      } else if (tool.id === "ai-analyze") {
        const text = await aiAnalyze(files[0]);
        setAiText(text);
      } else {
        await new Promise((r) => setTimeout(r, 1200));
        setError(`"${tool.label}" requires a ${tool.tag} setup. In a real app, this would call your Node.js backend or external API.`);
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch (e) {
      setError(e.message);
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    const baseName = files[0]?.name.split(".")[0] || "output";
    a.href = url;
    a.download = `${baseName}_converted.${result.ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const accent = CATEGORY_COLORS[tool.category];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16,
    }}>
      <div style={{
        background: "#0e0e18", border: `1px solid ${accent}30`, borderRadius: 20,
        width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto",
        boxShadow: `0 0 60px ${accent}20`,
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #1a1a2e", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10, background: `${accent}18`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, color: accent, border: `1px solid ${accent}30`,
          }}>{tool.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, fontFamily: "monospace" }}>{tool.label}</div>
            <div style={{ color: "#555", fontSize: 12 }}>{tool.desc}</div>
          </div>
          <div style={{
            padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700,
            background: `${accent}20`, color: accent, border: `1px solid ${accent}40`, fontFamily: "monospace",
          }}>{tool.tag}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 18, padding: 4 }}>✕</button>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Drop Zone */}
          <DropZone tool={tool} onFiles={setFiles} />

          {/* Preview */}
          {preview && (
            <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #1a1a2e", maxHeight: 200 }}>
              <img src={preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", background: "#080810" }} />
            </div>
          )}

          {files.length > 0 && (
            <div style={{ color: "#555", fontSize: 12, fontFamily: "monospace" }}>
              {files.length === 1 ? files[0].name : `${files.length} files selected`}
            </div>
          )}

          {/* Config */}
          {tool.id === "img-convert" && (
            <div style={{ display: "flex", gap: 8 }}>
              {["png", "jpeg", "webp"].map((f) => (
                <button key={f} onClick={() => setConfig((c) => ({ ...c, format: f }))} style={{
                  flex: 1, padding: "8px 0", borderRadius: 8, border: `1px solid ${config.format === f ? accent : "#2a2a3a"}`,
                  background: config.format === f ? `${accent}15` : "transparent",
                  color: config.format === f ? accent : "#555", cursor: "pointer", fontSize: 12, fontFamily: "monospace", fontWeight: 700,
                }}>{f.toUpperCase()}</button>
              ))}
            </div>
          )}

          {tool.id === "img-resize" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 10 }}>
                {[{ key: "width", label: "Width (px)" }, { key: "height", label: "Height (px)" }].map(({ key, label }) => (
                  <div key={key} style={{ flex: 1 }}>
                    <label style={{ color: "#555", fontSize: 11, display: "block", marginBottom: 4, fontFamily: "monospace" }}>{label}</label>
                    <input
                      type="number" value={config[key]}
                      onChange={(e) => setConfig((c) => ({ ...c, [key]: e.target.value }))}
                      placeholder="auto"
                      style={{
                        width: "100%", padding: "8px 10px", borderRadius: 8,
                        border: "1px solid #2a2a3a", background: "#080810", color: "#ddd",
                        fontSize: 13, fontFamily: "monospace", boxSizing: "border-box",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ color: "#555", fontSize: 11, display: "block", marginBottom: 4, fontFamily: "monospace" }}>Quality: {config.quality}%</label>
                <input type="range" min={10} max={100} value={config.quality}
                  onChange={(e) => setConfig((c) => ({ ...c, quality: +e.target.value }))}
                  style={{ width: "100%", accentColor: accent }}
                />
              </div>
            </div>
          )}

          {/* Process Button */}
          <button onClick={handleProcess} disabled={!files.length || status === "processing"} style={{
            padding: "12px 0", borderRadius: 10, border: "none",
            background: !files.length ? "#1a1a2e" : `linear-gradient(135deg, ${accent}, ${accent}aa)`,
            color: !files.length ? "#333" : "#000", cursor: !files.length ? "not-allowed" : "pointer",
            fontWeight: 800, fontSize: 13, fontFamily: "monospace", letterSpacing: 1,
            transition: "all 0.2s",
          }}>
            {status === "processing" ? "⟳ PROCESSING..." : `▶ RUN ${tool.label.toUpperCase()}`}
          </button>

          {/* Result */}
          {status === "done" && result && (
            <div style={{ background: "#00ff9d0a", border: "1px solid #00ff9d30", borderRadius: 10, padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ color: "#00ff9d", fontWeight: 700, fontSize: 13, fontFamily: "monospace" }}>✓ DONE</div>
                <div style={{ color: "#555", fontSize: 11, marginTop: 2 }}>{(result.blob.size / 1024).toFixed(1)} KB · .{result.ext}</div>
              </div>
              <button onClick={handleDownload} style={{
                padding: "8px 16px", borderRadius: 8, border: "1px solid #00ff9d40",
                background: "#00ff9d15", color: "#00ff9d", cursor: "pointer", fontSize: 12, fontFamily: "monospace", fontWeight: 700,
              }}>↓ DOWNLOAD</button>
            </div>
          )}

          {status === "done" && aiText && (
            <div style={{ background: "#ff6b350a", border: "1px solid #ff6b3530", borderRadius: 10, padding: 16 }}>
              <div style={{ color: "#ff6b35", fontWeight: 700, fontSize: 12, fontFamily: "monospace", marginBottom: 8 }}>◈ AI ANALYSIS</div>
              <div style={{ color: "#aaa", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{aiText}</div>
            </div>
          )}

          {status === "error" && (
            <div style={{ background: "#ff4d4d0a", border: "1px solid #ff4d4d30", borderRadius: 10, padding: 16 }}>
              <div style={{ color: "#ff4d4d", fontWeight: 700, fontSize: 12, fontFamily: "monospace", marginBottom: 4 }}>⚠ NOTE</div>
              <div style={{ color: "#888", fontSize: 12, lineHeight: 1.5 }}>{error}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FileForge() {
  const [activeTool, setActiveTool] = useState(null);
  const [filter, setFilter] = useState("all");

  const categories = [
    { id: "all", label: "ALL" },
    { id: "image", label: "IMAGE" },
    { id: "pdf", label: "PDF" },
    { id: "doc", label: "DOC" },
    { id: "ai", label: "AI" },
  ];

  const filtered = filter === "all" ? TOOLS : TOOLS.filter((t) => t.category === filter);

  return (
    <div style={{
      minHeight: "100vh", background: "#080810",
      fontFamily: "'Courier New', monospace",
      padding: "32px 20px",
    }}>
      {/* BG grid */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(#1a1a2e 1px, transparent 1px), linear-gradient(90deg, #1a1a2e 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        opacity: 0.4,
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: "linear-gradient(135deg, #00ff9d, #4ecdc4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, boxShadow: "0 0 24px #00ff9d40",
            }}>⚙</div>
            <h1 style={{
              margin: 0, fontSize: 32, fontWeight: 900, letterSpacing: -1,
              background: "linear-gradient(135deg, #fff, #00ff9d)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>FileForge</h1>
          </div>
          <p style={{ color: "#444", fontSize: 13, margin: 0, letterSpacing: 1 }}>
            IMAGE · PDF · DOCUMENT · AI CONVERSION TOOLKIT
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {categories.map((c) => (
            <button key={c.id} onClick={() => setFilter(c.id)} style={{
              padding: "6px 14px", borderRadius: 20, border: `1px solid ${filter === c.id ? "#00ff9d" : "#1a1a2e"}`,
              background: filter === c.id ? "#00ff9d15" : "transparent",
              color: filter === c.id ? "#00ff9d" : "#444", cursor: "pointer",
              fontSize: 11, fontFamily: "monospace", fontWeight: 700, letterSpacing: 1,
              transition: "all 0.15s",
            }}>{c.label}</button>
          ))}
        </div>

        {/* Tool Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {filtered.map((tool) => {
            const accent = CATEGORY_COLORS[tool.category];
            return (
              <button key={tool.id} onClick={() => setActiveTool(tool)} style={{
                background: "#0d0d1a", border: `1px solid #1a1a2e`,
                borderRadius: 14, padding: 20, textAlign: "left", cursor: "pointer",
                transition: "all 0.2s", display: "flex", flexDirection: "column", gap: 10,
                position: "relative", overflow: "hidden",
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = `1px solid ${accent}50`;
                  e.currentTarget.style.boxShadow = `0 0 20px ${accent}15`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = "1px solid #1a1a2e";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 8, background: `${accent}15`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, color: accent, border: `1px solid ${accent}25`,
                  }}>{tool.icon}</div>
                  <div style={{
                    padding: "2px 7px", borderRadius: 20, fontSize: 9, fontWeight: 700,
                    background: `${accent}15`, color: accent, border: `1px solid ${accent}30`,
                  }}>{tool.tag}</div>
                </div>
                <div>
                  <div style={{ color: "#ddd", fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{tool.label}</div>
                  <div style={{ color: "#444", fontSize: 11 }}>{tool.desc}</div>
                </div>
                <div style={{
                  position: "absolute", bottom: -10, right: -10, width: 60, height: 60,
                  borderRadius: "50%", background: `${accent}08`,
                }} />
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { tag: "INSTANT", color: "#00ff9d", desc: "Runs in browser" },
            { tag: "NODE.JS", color: "#7c6fcd", desc: "Needs backend" },
            { tag: "AI API", color: "#ff6b35", desc: "External AI API" },
            { tag: "BACKEND", color: "#7c6fcd", desc: "Server required" },
          ].map(({ tag, color, desc }) => (
            <div key={tag} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
              <span style={{ color: color, fontSize: 10, fontWeight: 700 }}>{tag}</span>
              <span style={{ color: "#333", fontSize: 10 }}>— {desc}</span>
            </div>
          ))}
        </div>
      </div>

      {activeTool && <ToolPanel tool={activeTool} onClose={() => setActiveTool(null)} />}
    </div>
  );
}