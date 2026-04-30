// src/pages/mainsection.jsx
import Head from 'next/head';

// 🔹 IMPORT YOUR IDEAS HERE — just add new lines as you create them
import HealthScanAI from '../ideas/HealthScanAI';
import ArtBridge from '../ideas/ArtBridge';
import SchoolERP from '../ideas/SchoolERP';



const PROJECT_COUNT = 3; 
const PROTOTYPE_NAMES = ['HealthScan AI', 'ArtBridge', 'SchoolERP'];

export default function MainSection() {
  return (
    <>
      <Head>
        <title>Dharamveer — Startup Lab</title>
        <meta name="description" content="Every idea gets a prototype. Building in public." />
        <meta property="og:title" content="Dharamveer — Startup Lab" />
        <meta property="og:description" content="Working prototypes for every startup idea" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ── HERO STRIP ── */}
      <section className="hero-strip">
        <div className="fade-in delay-1">
          <div className="hero-tag">Startup Lab</div>
          <h1>
            Every <em>idea</em>
            <br />
            gets a
            <br />
            prototype.
          </h1>
        </div>
        <div className="fade-in delay-2">
          <p className="hero-desc">
            I build working prototypes for every startup idea I have — shipped fast, iterated publicly. 
            Each project below is a real, functioning product. No mockups, no decks.
          </p>
          <div className="hero-stat">
            <div>
              <div className="stat-num">{String(PROJECT_COUNT).padStart(2, '0')}</div>
              <div className="stat-label">Prototypes</div>
            </div>
            <div>              <div className="stat-num">∞</div>
              <div className="stat-label">Ideas</div>
            </div>
            <div>
              <div className="stat-num">01</div>
              <div className="stat-label">Builder</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ANIMATED TICKER ── */}
      <div className="ticker">
        <div className="ticker-track">
          {/* First set */}
          {PROTOTYPE_NAMES.map((name, i) => (
            <span className="ticker-item" key={`a-${i}`}>
              {name} <span className="ticker-dot">◆</span>
            </span>
          ))}
          {/* Duplicated set for seamless infinite loop */}
          {PROTOTYPE_NAMES.map((name, i) => (
            <span className="ticker-item" key={`b-${i}`}>
              {name} <span className="ticker-dot">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── PROJECTS GRID ── */}
      <main id="projects">
        <div className="section-header">
          <span className="section-title">// Prototypes</span>
          <span className="section-count">
            {String(PROJECT_COUNT).padStart(2, '0')} Projects
          </span>
        </div>

        <div className="projects">
          {/* 🔹 RENDER YOUR IDEAS HERE — order = display order */}
          <HealthScanAI />
          <ArtBridge />
          
          {/* 🔹 ADD NEW IDEAS BELOW — just import at top + add component here */}
          {/* <DropRoute /> */}
          {/* <NoteStack /> */}
          {/* <PriceLens /> */}
          {/* <FlowMail /> */}
        </div>
      </main>    </>
  );
}