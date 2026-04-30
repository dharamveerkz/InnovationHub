
import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
  blue: "#2563EB", blueDark: "#1E40AF", blueLight: "#DBEAFE",
  orange: "#F97316", orangeSoft: "#FFEDD5",
  white: "#FFFFFF", bgSoft: "#F8FAFC",
  border: "#E5E7EB", textMain: "#111827", textSec: "#6B7280",
  green: "#10B981", red: "#EF4444", yellow: "#F59E0B",
};

// ─── INLINE STYLES (Tailwind-compatible approach) ────────────────────────────
const s = {
  app: { fontFamily: "'DM Sans', 'Inter', sans-serif", background: T.bgSoft, minHeight: "100vh", display: "flex", flexDirection: "column", color: T.textMain },
  navbar: { background: T.white, borderBottom: `1px solid ${T.border}`, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" },
  navLogo: { display: "flex", alignItems: "center", gap: 10, fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 20, color: T.blueDark },
  chatWrap: { flex: 1, maxWidth: 760, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", padding: "0 16px 16px" },
  msgList: { flex: 1, overflowY: "auto", padding: "16px 0", display: "flex", flexDirection: "column", gap: 12 },
  botMsg: { display: "flex", gap: 10, alignItems: "flex-start", animation: "fadeUp 0.3s ease-out" },
  botBubble: { background: T.white, border: `1px solid ${T.border}`, borderRadius: "4px 18px 18px 18px", padding: "12px 16px", maxWidth: "85%", fontSize: 14.5, lineHeight: 1.6, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" },
  userMsg: { display: "flex", justifyContent: "flex-end", animation: "fadeUp 0.2s ease-out" },
  userBubble: { background: T.blue, color: T.white, borderRadius: "18px 18px 4px 18px", padding: "12px 16px", maxWidth: "75%", fontSize: 14.5, lineHeight: 1.6 },
  inputBar: { background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", transition: "border-color 0.2s" },
  input: { flex: 1, border: "none", outline: "none", fontSize: 15, color: T.textMain, background: "transparent", resize: "none", fontFamily: "inherit" },
  sendBtn: { background: T.blue, color: T.white, border: "none", borderRadius: 12, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", flexShrink: 0 },
  chip: { display: "inline-flex", alignItems: "center", background: T.blueLight, color: T.blueDark, border: `1px solid #BFDBFE`, borderRadius: 20, padding: "5px 14px", fontSize: 13, cursor: "pointer", fontWeight: 500, transition: "all 0.15s", margin: "3px 4px 3px 0" },
  progress: { background: T.blueLight, borderRadius: 99, height: 6, overflow: "hidden", margin: "8px 0 4px" },
  progressBar: { height: "100%", background: `linear-gradient(90deg, ${T.blue}, #60A5FA)`, borderRadius: 99, transition: "width 0.5s ease" },
  card: { background: T.white, border: `1px solid ${T.border}`, borderRadius: 20, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" },
  badge: (color) => ({ background: color + "18", color: color, border: `1px solid ${color}30`, borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600, display: "inline-block" }),
  redFlag: { background: "#FEF2F2", border: `1.5px solid #FECACA`, borderRadius: 14, padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start" },
  section: { marginBottom: 24 },
  sectionTitle: { fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 15, color: T.blueDark, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 },
  btn: (bg, color = "#fff") => ({ background: bg, color, border: "none", borderRadius: 12, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 6 }),
  avatar: { width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${T.blue}, ${T.blueDark})`, display: "flex", alignItems: "center", justifyContent: "center", color: T.white, fontSize: 16, flexShrink: 0 },
};

// ─── RULE ENGINE ─────────────────────────────────────────────────────────────
const CONDITION_RULES = [
  {
    name: "Viral Upper Respiratory Infection",
    icd: "J06.9",
    keywords: ["fever", "cough", "cold", "sore throat", "runny nose", "body ache", "fatigue", "headache", "congestion"],
    weight: 3,
    specialist: "General Physician",
    tests: ["CBC", "CRP", "Throat Swab Culture"],
    care: ["Rest adequately", "Stay hydrated (2–3L water/day)", "Steam inhalation for congestion", "Paracetamol for fever (consult physician)"],
  },
  {
    name: "Dengue Fever",
    icd: "A90",
    keywords: ["fever", "rash", "bleeding", "platelet", "joint pain", "eye pain", "headache", "dengue"],
    weight: 4,
    specialist: "Infectious Disease / General Physician",
    tests: ["CBC with Platelet Count", "Dengue NS1 Antigen", "Dengue IgM/IgG"],
    care: ["Strict bed rest", "Oral rehydration", "Monitor platelet count daily", "Avoid aspirin/ibuprofen"],
    redFlag: true,
  },
  {
    name: "Iron Deficiency Anemia",
    icd: "D50.9",
    keywords: ["fatigue", "weakness", "pale", "breathless", "dizzy", "anemia", "hemoglobin", "hb"],
    weight: 3,
    specialist: "Hematologist / General Physician",
    tests: ["CBC", "Serum Ferritin", "Peripheral Blood Smear", "Serum Iron + TIBC"],
    care: ["Iron-rich diet (spinach, lentils, meat)", "Vitamin C with meals enhances absorption", "Avoid tea/coffee with meals"],
  },
  {
    name: "Hypertensive Episode",
    icd: "I10",
    keywords: ["blood pressure", "bp high", "hypertension", "headache", "blurred vision", "chest", "dizzy", "nausea"],
    weight: 3,
    specialist: "Cardiologist / General Physician",
    tests: ["BP Monitoring (serial)", "ECG", "Renal Function Test", "Fundoscopy"],
    care: ["Low sodium diet", "Reduce caffeine", "Stress management techniques", "Regular BP monitoring"],
    redFlag: true,
  },
  {
    name: "Type 2 Diabetes Mellitus",
    icd: "E11",
    keywords: ["sugar", "diabetes", "thirst", "urination", "weight loss", "blurred", "fatigue", "glucose", "hba1c"],
    weight: 3,
    specialist: "Endocrinologist / Diabetologist",
    tests: ["Fasting Blood Glucose", "HbA1c", "Postprandial Blood Glucose", "Urine Routine"],
    care: ["Low glycemic index diet", "Regular physical activity", "Monitor blood sugar daily", "Foot care routine"],
  },
  {
    name: "Acute Gastroenteritis",
    icd: "K59.1",
    keywords: ["diarrhea", "vomiting", "nausea", "stomach", "loose stools", "cramps", "abdomen", "food poisoning"],
    weight: 3,
    specialist: "Gastroenterologist / General Physician",
    tests: ["Stool Culture", "CBC", "Electrolytes", "Stool Routine & Microscopy"],
    care: ["ORS every 2 hours", "BRAT diet (banana, rice, applesauce, toast)", "Avoid dairy temporarily"],
  },
  {
    name: "Anxiety / Panic Disorder",
    icd: "F41.1",
    keywords: ["anxiety", "panic", "worry", "heart racing", "palpitations", "chest tight", "stress", "nervous", "fear"],
    weight: 3,
    specialist: "Psychiatrist / Clinical Psychologist",
    tests: ["TSH (rule out thyroid)", "ECG (rule out cardiac)", "Psychiatric evaluation"],
    care: ["Diaphragmatic breathing exercises", "Limit caffeine", "Regular sleep schedule", "Mindfulness / meditation"],
  },
  {
    name: "Migraine",
    icd: "G43.9",
    keywords: ["migraine", "headache", "throbbing", "nausea", "light sensitive", "aura", "one side", "pulsating"],
    weight: 3,
    specialist: "Neurologist",
    tests: ["MRI Brain (if new onset)", "Ophthalmic evaluation"],
    care: ["Lie in a dark, quiet room", "Cold compress on forehead", "Hydration", "Track triggers in a diary"],
  },
];

const RED_FLAG_TRIGGERS = [
  { pattern: ["chest pain", "sweating", "radiating", "left arm"], msg: "⚠️ CARDIAC EMERGENCY: Symptoms suggest possible cardiac event. Call emergency services immediately.", severity: "critical" },
  { pattern: ["suicidal", "self harm", "want to die", "end my life"], msg: "💙 You're not alone. Please contact iCall: 9152987821 or Vandrevala Foundation: 1860-2662-345 immediately.", severity: "mental" },
  { pattern: ["fever", "rash", "bleeding", "platelet"], msg: "🦟 Dengue alert: Fever + rash + bleeding risk. Seek medical attention urgently for platelet count.", severity: "urgent" },
  { pattern: ["stroke", "face drooping", "arm weakness", "speech slurred"], msg: "🧠 STROKE WARNING: FAST signs detected. Call emergency services immediately.", severity: "critical" },
];

function runRuleEngine(profile, entries) {
  const allText = entries.map(e => e.text?.toLowerCase() || "").join(" ");
  const scored = CONDITION_RULES.map(rule => {
    const matches = rule.keywords.filter(k => allText.includes(k));
    const score = matches.length * rule.weight;
    const total = rule.keywords.length * rule.weight;
    const pct = Math.min(100, Math.round((score / total) * 100));

    let confidence = "Low", confColor = T.yellow;
    if (matches.length >= 4) { confidence = "High"; confColor = T.green; }
    else if (matches.length >= 2) { confidence = "Medium"; confColor = T.orange; }

    const reasoning = [];
    if (matches.length > 0) reasoning.push(`Matched symptoms: ${matches.join(", ")}`);
    if (profile.age > 50) reasoning.push("Age >50 increases likelihood of chronic conditions");
    if (profile.diabetes === "yes") reasoning.push("Diabetic status noted — metabolic risk elevated");
    if (profile.bp === "high") reasoning.push("Hypertension history raises cardiovascular consideration");

    return { ...rule, matches, score, likelihood: pct, confidence, confColor, reasoning };
  }).filter(r => r.matches.length > 0).sort((a, b) => b.likelihood - a.likelihood);

  const redFlags = [];
  RED_FLAG_TRIGGERS.forEach(rf => {
    if (rf.pattern.some(p => allText.includes(p))) redFlags.push(rf);
  });

  const completeness = Math.min(100, Math.round(
    (entries.length * 12) + (profile.name ? 10 : 0) + (profile.age ? 10 : 0) + (profile.gender ? 8 : 0)
  ));

  return { conditions: scored.slice(0, 4), redFlags, completeness };
}

// ─── ONBOARDING QUESTIONS ─────────────────────────────────────────────────────
const ONBOARDING = [
  { key: "name", q: "Hello! 👋 I'm HealthScan AI — your pre-screening assistant.\n\nI'll guide you step-by-step through a structured health intake. **What's your name?**", type: "text", placeholder: "Enter your name..." },
  { key: "age", q: "Nice to meet you, {name}! 😊\n\nHow old are you?", type: "text", placeholder: "e.g. 28" },
  { key: "gender", q: "What is your **gender**?", type: "chips", options: ["Male", "Female", "Other", "Prefer not to say"] },
  { key: "blood_group", q: "What is your **blood group**? (Skip if unknown)", type: "chips", options: ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−", "Unknown"] },
  { key: "height", q: "What is your **height** in centimeters?", type: "text", placeholder: "e.g. 168" },
  { key: "weight", q: "What is your **weight** in kilograms?", type: "text", placeholder: "e.g. 65" },
  { key: "bp", q: "Do you have a **blood pressure** condition?", type: "chips", options: ["Normal", "High (Hypertension)", "Low (Hypotension)", "Unknown"] },
  { key: "diabetes", q: "Do you have **diabetes** or pre-diabetes?", type: "chips", options: ["No", "Type 1", "Type 2", "Pre-diabetic", "Unknown"] },
  { key: "smoking", q: "Do you **smoke**?", type: "chips", options: ["Never", "Former smoker", "Occasional", "Daily"] },
  { key: "alcohol", q: "Do you consume **alcohol**?", type: "chips", options: ["Never", "Occasionally", "Regularly"] },
  { key: "chronic", q: "Any **chronic conditions or allergies**? (e.g. asthma, thyroid, penicillin allergy)", type: "text", placeholder: "Type 'None' if not applicable..." },
];

// ─── TYPING INDICATOR ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "10px 14px", background: T.white, border: `1px solid ${T.border}`, borderRadius: "4px 18px 18px 18px", width: "fit-content" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: T.blue, animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
    </div>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function Progress({ step, total, label }) {
  return (
    <div style={{ padding: "6px 14px", background: T.blueLight, borderRadius: 12, margin: "4px 0 8px", fontSize: 12, color: T.blueDark, fontWeight: 500 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span>📋 Profile Setup</span>
        <span>Step {step}/{total}</span>
      </div>
      <div style={s.progress}><div style={{ ...s.progressBar, width: `${(step / total) * 100}%` }} /></div>
    </div>
  );
}

// ─── CONDITION CARD ───────────────────────────────────────────────────────────
function ConditionCard({ cond, rank }) {
  const [open, setOpen] = useState(false);
  const color = cond.likelihood > 65 ? T.orange : cond.likelihood > 35 ? T.blue : T.textSec;
  return (
    <div style={{ ...s.card, marginBottom: 10, cursor: "pointer", borderLeft: `4px solid ${color}` }} onClick={() => setOpen(!open)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: T.textMain }}>
            {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "📌"} {cond.name}
          </div>
          <div style={{ fontSize: 12, color: T.textSec, marginTop: 2 }}>ICD-10: {cond.icd}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 22, color }}>{cond.likelihood}%</div>
          <div style={s.badge(cond.confColor)}>{cond.confidence} Confidence</div>
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <div style={{ background: T.border, borderRadius: 99, height: 6, overflow: "hidden" }}>
          <div style={{ width: `${cond.likelihood}%`, height: "100%", background: `linear-gradient(90deg, ${color}80, ${color})`, borderRadius: 99, transition: "width 1s ease" }} />
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 14, borderTop: `1px solid ${T.border}`, paddingTop: 12, animation: "fadeUp 0.2s ease-out" }}>
          <div style={s.sectionTitle}>🧠 XAI Reasoning</div>
          {cond.reasoning.map((r, i) => (
            <div key={i} style={{ fontSize: 13, color: T.textSec, marginBottom: 5, display: "flex", gap: 6 }}>
              <span style={{ color: T.blue }}>›</span> {r}
            </div>
          ))}

          <div style={{ marginTop: 12 }}>
            <div style={s.sectionTitle}>💊 Supportive Care</div>
            {cond.care.map((c, i) => <div key={i} style={{ fontSize: 13, color: T.textMain, marginBottom: 4, display: "flex", gap: 6 }}><span style={{ color: T.green }}>✓</span>{c}</div>)}
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={s.sectionTitle}>🔬 Recommended Tests</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {cond.tests.map((t, i) => <span key={i} style={{ ...s.badge(T.blue), fontSize: 12 }}>{t}</span>)}
            </div>
          </div>

          <div style={{ marginTop: 12, background: T.bgSoft, borderRadius: 10, padding: "8px 12px", fontSize: 13, color: T.textSec }}>
            👨‍⚕️ <strong>Refer to:</strong> {cond.specialist}
          </div>
        </div>
      )}

      <div style={{ marginTop: 8, fontSize: 12, color: T.blue, textAlign: "right" }}>
        {open ? "▲ Hide details" : "▼ View reasoning & care"}
      </div>
    </div>
  );
}

// ─── REPORT DASHBOARD ─────────────────────────────────────────────────────────
function ReportDashboard({ profile, entries, result, onReset }) {
  const [view, setView] = useState("patient");
  const bmi = profile.height && profile.weight ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1) : null;

  const bmiStatus = bmi
    ? bmi < 18.5 ? { label: "Underweight", color: T.yellow }
    : bmi < 25 ? { label: "Normal", color: T.green }
    : bmi < 30 ? { label: "Overweight", color: T.orange }
    : { label: "Obese", color: T.red }
    : null;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "16px" }}>
      {/* Header */}
      <div style={{ ...s.card, background: `linear-gradient(135deg, ${T.blueDark} 0%, ${T.blue} 100%)`, color: T.white, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 22 }}>🩺 HealthScan AI Report</div>
            <div style={{ opacity: 0.85, fontSize: 13, marginTop: 4 }}>Generated {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })} · Session #{Math.random().toString(36).slice(2, 8).toUpperCase()}</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["patient", "doctor"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{ ...s.btn(view === v ? T.white : "transparent", view === v ? T.blue : "rgba(255,255,255,0.7)"), padding: "6px 14px", fontSize: 13, borderRadius: 20 }}>
                {v === "patient" ? "👤 Patient" : "👨‍⚕️ Clinical"} View
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
          {[["Name", profile.name], ["Age", profile.age + " yrs"], ["Gender", profile.gender], ["Blood Group", profile.blood_group]].map(([k, v]) => (
            <div key={k} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "6px 14px" }}>
              <div style={{ fontSize: 11, opacity: 0.7 }}>{k}</div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{v || "—"}</div>
            </div>
          ))}
          {bmi && <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "6px 14px" }}>
            <div style={{ fontSize: 11, opacity: 0.7 }}>BMI</div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{bmi} <span style={{ fontSize: 11, opacity: 0.8 }}>({bmiStatus?.label})</span></div>
          </div>}
        </div>
      </div>

      {/* Data Completeness */}
      <div style={{ ...s.card, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: T.textMain }}>📊 Data Completeness</div>
          <span style={s.badge(result.completeness > 70 ? T.green : T.orange)}>{result.completeness}%</span>
        </div>
        <div style={s.progress}><div style={{ ...s.progressBar, width: `${result.completeness}%` }} /></div>
        <div style={{ fontSize: 12, color: T.textSec, marginTop: 6 }}>{entries.length} symptom entr{entries.length === 1 ? "y" : "ies"} · Model: rule-v1.0 · {view === "doctor" ? "ICD-10 mapped" : "AI-assisted screening"}</div>
      </div>

      {/* Red Flags */}
      {result.redFlags.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {result.redFlags.map((rf, i) => (
            <div key={i} style={{ ...s.redFlag, marginBottom: 8 }}>
              <div style={{ fontSize: 20 }}>🚨</div>
              <div>
                <div style={{ fontWeight: 700, color: T.red, fontSize: 14, marginBottom: 4 }}>Red Flag Detected</div>
                <div style={{ fontSize: 13.5, color: T.textMain }}>{rf.msg}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Conditions */}
      <div style={s.section}>
        <div style={s.sectionTitle}>📋 Condition Likelihood Mapping</div>
        <div style={{ fontSize: 12, color: T.textSec, marginBottom: 12, background: T.orangeSoft, padding: "8px 12px", borderRadius: 10, borderLeft: `3px solid ${T.orange}` }}>
          ⚠️ <strong>Disclaimer:</strong> This is a pre-screening tool only. Results are not diagnoses. Always consult a licensed healthcare professional.
        </div>
        {result.conditions.length === 0
          ? <div style={{ ...s.card, textAlign: "center", color: T.textSec, padding: 30 }}>No clear condition pattern detected from provided symptoms.</div>
          : result.conditions.map((c, i) => <ConditionCard key={c.name} cond={c} rank={i + 1} />)
        }
      </div>

      {/* Doctor-only SOAP */}
      {view === "doctor" && (
        <div style={{ ...s.card, marginBottom: 16, borderLeft: `4px solid ${T.blueDark}` }}>
          <div style={s.sectionTitle}>📝 SOAP Summary (Clinical)</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.8 }}>
            <strong>S (Subjective):</strong> Patient {profile.name}, {profile.age}y {profile.gender}, presents with: {entries.map(e => e.text).join("; ")}.<br />
            <strong>O (Objective):</strong> BMI {bmi || "N/A"} ({bmiStatus?.label || "N/A"}). BP Status: {profile.bp}. Diabetes: {profile.diabetes}. Smoking: {profile.smoking}.<br />
            <strong>A (Assessment):</strong> {result.conditions.length > 0 ? result.conditions.map(c => `${c.name} [${c.icd}] (${c.likelihood}% likelihood, ${c.confidence} confidence)`).join("; ") : "Insufficient data for assessment"}.<br />
            <strong>P (Plan):</strong> Recommend {result.conditions[0]?.tests?.join(", ") || "further workup"}. Refer to {result.conditions[0]?.specialist || "appropriate specialist"}.
          </div>
        </div>
      )}

      {/* Patient Entry Log */}
      <div style={s.section}>
        <div style={s.sectionTitle}>📝 Reported Symptoms & Entries</div>
        <div style={s.card}>
          {entries.map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", borderBottom: i < entries.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <span style={{ background: T.blueLight, color: T.blue, borderRadius: 6, padding: "2px 8px", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>#{i + 1}</span>
              <div style={{ fontSize: 14, color: T.textMain }}>{e.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 24 }}>
        <button style={{ ...s.btn(T.blue), boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }} onClick={() => alert("PDF export would download here in production.")}>
          📄 Download PDF
        </button>
        <button style={s.btn(T.bgSoft, T.textMain)} onClick={onReset}>
          🔄 New Assessment
        </button>
        <button style={s.btn("#F0FDF4", T.green)} onClick={() => alert("Share via secure link — available in production.")}>
          📤 Share with Doctor
        </button>
      </div>

      <div style={{ textAlign: "center", fontSize: 12, color: T.textSec, marginTop: 16, padding: "12px", borderTop: `1px solid ${T.border}` }}>
        Raw uploads auto-deleted in 72h · Anonymized logs only · TLS 1.3 + AES-256 encrypted<br />
        <strong style={{ color: T.red }}>This tool does not replace professional medical advice.</strong>
      </div>
    </div>
  );
}

// ─── DISCLAIMER MODAL ─────────────────────────────────────────────────────────
function DisclaimerModal({ onAccept }) {
  const [checked, setChecked] = useState(false);
  const [seconds, setSeconds] = useState(4);
  const timerStarted = useRef(false);

  // Start countdown immediately on mount
  useEffect(() => {
    const t = setInterval(() => setSeconds(s => {
      if (s <= 1) { clearInterval(t); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, []);

  const canProceed = checked && seconds === 0;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(17,24,39,0.75)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: T.white, borderRadius: 24, maxWidth: 480, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.35)", display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${T.blueDark}, ${T.blue})`, padding: "18px 22px", color: T.white, borderRadius: "24px 24px 0 0", flexShrink: 0 }}>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 17 }}>⚠️ Medical Disclaimer</div>
          <div style={{ fontSize: 12.5, opacity: 0.85, marginTop: 3 }}>Please read carefully before viewing your results</div>
        </div>

        {/* Body — scrollable */}
        <div style={{ padding: "18px 20px", overflowY: "auto", fontSize: 13.5, lineHeight: 1.75, color: T.textMain, flex: 1 }}>
          <p style={{ margin: "0 0 10px" }}><strong>HealthScan AI is a pre-screening and triage tool only.</strong></p>
          <p style={{ margin: "0 0 10px" }}>This system does <strong>NOT</strong> provide medical diagnoses. Results are based on pattern recognition from reported symptoms and are not a substitute for professional medical evaluation, diagnosis, or treatment.</p>
          <p style={{ margin: "0 0 10px" }}>Condition likelihoods shown are <strong>indicative probabilities only</strong>. Confidence levels reflect data completeness, not clinical certainty.</p>
          <p style={{ margin: "0 0 10px" }}>Always consult a licensed healthcare professional before making any health decisions. In case of emergency, contact emergency services immediately <strong>(India: 112)</strong>.</p>
          <p style={{ margin: "0 0 10px" }}>Your data is processed securely. Raw uploads are auto-deleted within <strong>72 hours</strong>. Anonymized session data may be retained for system improvement.</p>
          <p style={{ margin: 0 }}>By proceeding, you acknowledge that you have read and understood these limitations.</p>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 20px 18px", borderTop: `1px solid ${T.border}`, background: T.bgSoft, borderRadius: "0 0 24px 24px", flexShrink: 0 }}>
          {/* Checkbox */}
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 14 }}>
            <input
              type="checkbox"
              checked={checked}
              onChange={e => setChecked(e.target.checked)}
              style={{ width: 18, height: 18, marginTop: 2, accentColor: T.blue, cursor: "pointer", flexShrink: 0 }}
            />
            <span style={{ fontSize: 13, color: T.textMain, lineHeight: 1.5 }}>
              I understand this is a <strong>screening tool only</strong>, not a medical diagnosis. I will consult a physician for any health decisions.
            </span>
          </label>

          {/* Button */}
          <button
            onClick={canProceed ? onAccept : undefined}
            style={{
              ...s.btn(canProceed ? T.blue : "#D1D5DB", canProceed ? T.white : "#9CA3AF"),
              width: "100%",
              justifyContent: "center",
              cursor: canProceed ? "pointer" : "not-allowed",
              boxShadow: canProceed ? "0 4px 14px rgba(37,99,235,0.3)" : "none",
              fontSize: 14,
              padding: "12px 20px",
              transition: "all 0.3s",
            }}
          >
            {seconds > 0
              ? `Please wait… (${seconds}s)`
              : !checked
              ? "☝️ Check the box above to continue"
              : "✅ I Understand — View My Report"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function HealthScanAI() {
  const [phase, setPhase] = useState("onboarding"); // onboarding | symptoms | disclaimer | report
  const [stepIdx, setStepIdx] = useState(0);
  const [profile, setProfile] = useState({});
  const [entries, setEntries] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [typing, setTyping] = useState(false);
  const [result, setResult] = useState(null);
  const messagesEnd = useRef(null);

  const scrollToBottom = () => messagesEnd.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { scrollToBottom(); }, [messages, typing]);

  const addBotMsg = useCallback((text, chips = [], delay = 600) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: "bot", text, chips }]);
    }, delay);
  }, []);

  // Init
  useEffect(() => {
    const q = ONBOARDING[0];
    setMessages([{ from: "bot", text: q.q, chips: q.options || [] }]);
  }, []);

  const handleSend = useCallback((val) => {
    const text = val || inputVal.trim();
    if (!text) return;
    setInputVal("");

    if (phase === "onboarding") {
      setMessages(prev => [...prev, { from: "user", text }]);
      const key = ONBOARDING[stepIdx].key;
      const newProfile = { ...profile, [key]: text };
      setProfile(newProfile);

      const nextIdx = stepIdx + 1;
      if (nextIdx < ONBOARDING.length) {
        setStepIdx(nextIdx);
        const next = ONBOARDING[nextIdx];
        let q = next.q.replace("{name}", newProfile.name || "");
        addBotMsg(q, next.options || []);
      } else {
        // Done with onboarding
        setPhase("symptoms");
        const bmi = newProfile.height && newProfile.weight ? (newProfile.weight / ((newProfile.height / 100) ** 2)).toFixed(1) : null;
        addBotMsg(
          `✅ **Profile saved!** ${bmi ? `Your BMI is **${bmi}**.` : ""}\n\nNow let's document your symptoms.\n\n📝 Please describe **one symptom at a time** — in your own words. You can also mention medicines you're taking or paste lab values.\n\nWhenever you're ready, click **"Take Diagnosis"** to generate your report.`,
          ["Take Diagnosis ›", "+ Add Symptom"]
        );
      }
    } else if (phase === "symptoms") {
      if (text === "Take Diagnosis ›" || text === "Take Diagnosis") {
        if (entries.length === 0) {
          setMessages(prev => [...prev, { from: "user", text }]);
          addBotMsg("Please add at least one symptom before taking the diagnosis.");
          return;
        }
        setMessages(prev => [...prev, { from: "user", text }]);
        setPhase("disclaimer");
        const r = runRuleEngine(profile, entries);
        setResult(r);
        return;
      }
      if (text === "+ Add Symptom") {
        addBotMsg("Sure! Describe your next symptom:", []);
        return;
      }
      setMessages(prev => [...prev, { from: "user", text }]);
      const newEntry = { text, type: "symptom" };
      const newEntries = [...entries, newEntry];
      setEntries(newEntries);
      addBotMsg(
        `📌 **Noted:** "${text}"\n\n*(${newEntries.length} entr${newEntries.length === 1 ? "y" : "ies"} recorded)*\n\nWhat else? Or are you ready to see your report?`,
        ["Take Diagnosis ›", "+ Add Another"]
      );
    }
  }, [phase, stepIdx, profile, entries, inputVal, addBotMsg]);

  const handleReset = () => {
    setPhase("onboarding");
    setStepIdx(0);
    setProfile({});
    setEntries([]);
    setResult(null);
    setInputVal("");
    const q = ONBOARDING[0];
    setMessages([{ from: "bot", text: q.q, chips: q.options || [] }]);
  };

  const formatMsg = (text) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return <p key={i} style={{ margin: "2px 0" }}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}</p>;
    });
  };

  const isOnboarding = phase === "onboarding";

  const navLabel = phase === "onboarding"
    ? `Profile Setup · Step ${stepIdx + 1}/${ONBOARDING.length}`
    : phase === "symptoms" ? `Symptom Intake · ${entries.length} recorded`
    : phase === "report" ? "Pre-Screening Report"
    : "Processing…";

  return (
    <div style={s.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce { 0%,80%,100%{ transform:translateY(0); } 40%{ transform:translateY(-6px); } }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#F1F5F9; }
        ::-webkit-scrollbar-thumb { background:#CBD5E1; border-radius:99px; }
        button:hover { filter:brightness(1.08); transform:translateY(-1px); }
      `}</style>

      {/* Disclaimer renders as a fixed overlay on top of everything */}
      {phase === "disclaimer" && <DisclaimerModal onAccept={() => setPhase("report")} />}

      {/* Navbar — always visible */}
      <nav style={s.navbar}>
        <div style={s.navLogo}>
          <span style={{ background: `linear-gradient(135deg, ${T.blue}, ${T.blueDark})`, borderRadius: 10, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", color: T.white, fontSize: 18 }}>🩺</span>
          HealthScan AI
        </div>
        <div style={{ fontSize: 12, color: T.textSec, background: T.blueLight, padding: "4px 12px", borderRadius: 20 }}>
          {navLabel}
        </div>
      </nav>

      {/* Report view */}
      {phase === "report" && (
        <ReportDashboard profile={profile} entries={entries} result={result} onReset={handleReset} />
      )}

      {/* Chat view — shown during onboarding, symptoms, disclaimer (disclaimer sits on top as overlay) */}
      {phase !== "report" && (
        <div style={s.chatWrap}>
          {isOnboarding && <Progress step={stepIdx + 1} total={ONBOARDING.length} />}

          <div style={s.msgList}>
            {messages.map((m, i) => (
              <div key={i}>
                {m.from === "bot" ? (
                  <div style={s.botMsg}>
                    <div style={s.avatar}>🩺</div>
                    <div>
                      <div style={s.botBubble}>{formatMsg(m.text)}</div>
                      {m.chips?.length > 0 && (
                        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap" }}>
                          {m.chips.map((c, ci) => (
                            <button key={ci} style={s.chip} onClick={() => handleSend(c)}>{c}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={s.userMsg}>
                    <div style={s.userBubble}>{m.text}</div>
                  </div>
                )}
              </div>
            ))}
            {typing && <div style={s.botMsg}><div style={s.avatar}>🩺</div><TypingDots /></div>}
            <div ref={messagesEnd} />
          </div>

          {/* Input bar — hidden while disclaimer modal is showing */}
          {phase !== "disclaimer" && (
            <>
              <div style={s.inputBar}>
                <input
                  style={s.input}
                  placeholder={phase === "symptoms" ? "Describe one symptom..." : ONBOARDING[stepIdx]?.placeholder || "Type here..."}
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                />
                {phase === "symptoms" && (
                  <button
                    style={{ ...s.btn(T.orangeSoft, T.orange), padding: "6px 12px", fontSize: 12, borderRadius: 10 }}
                    onClick={() => alert("File upload available in production (PDF/JPG lab reports, medicine photos)")}>
                    📎
                  </button>
                )}
                <button style={s.sendBtn} onClick={() => handleSend()}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
              <div style={{ textAlign: "center", fontSize: 11.5, color: T.textSec, marginTop: 10 }}>
                🔒 Encrypted · Not a diagnostic tool · Consult a physician for medical decisions
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
