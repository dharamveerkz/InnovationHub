// 🔹 IMPORT YOUR IDEAS HERE — they auto-appear with stars
import HealthScanAI from '../ideas/HealthScan-AI';
import ArtBridge from '../ideas/ArtBridge';

export default function MainSection() {
  return (
    <>
      {/* HERO */}
      <section className="hero-strip">
        <div className="fade-in delay-1">
          <div className="hero-tag">Startup Lab</div>
          <h1>Every <em>idea</em><br />gets a<br />prototype.</h1>
        </div>
        <div className="fade-in delay-2">
          <p className="hero-desc">
            I build working prototypes for every startup idea I have — shipped fast, iterated publicly. 
            Each project below is a real, functioning product. No mockups, no decks.
          </p>
          <div className="hero-stat">
            <div>
              <div className="stat-num">02</div>
              <div className="stat-label">Prototypes</div>
            </div>
            <div>
              <div className="stat-num">∞</div>
              <div className="stat-label">Ideas</div>
            </div>
            <div>
              <div className="stat-num">01</div>
              <div className="stat-label">Builder</div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          <span className="ticker-item">HealthScan AI <span className="ticker-dot">◆</span></span>
          <span className="ticker-item">ArtBridge <span className="ticker-dot">◆</span></span>
          <span className="ticker-item">DropRoute <span className="ticker-dot">◆</span></span>
          <span className="ticker-item">NoteStack <span className="ticker-dot">◆</span></span>
          <span className="ticker-item">PriceLens <span className="ticker-dot">◆</span></span>
          <span className="ticker-item">FlowMail <span className="ticker-dot">◆</span></span>
          {/* duplicated for seamless loop */}
          <span className="ticker-item">HealthScan AI <span className="ticker-dot">◆</span></span>
          <span className="ticker-item">ArtBridge <span className="ticker-dot">◆</span></span>
          <span className="ticker-item">DropRoute <span className="ticker-dot">◆</span></span>
          <span className="ticker-item">NoteStack <span className="ticker-dot">◆</span></span>
          <span className="ticker-item">PriceLens <span className="ticker-dot">◆</span></span>
          <span className="ticker-item">FlowMail <span className="ticker-dot">◆</span></span>
        </div>
      </div>

      {/* PROJECTS GRID */}
      <main id="projects">
        <div className="section-header">
          <span className="section-title">// Prototypes</span>
          <span className="section-count">02 Projects</span>
        </div>
        <div className="projects">
          <HealthScanAI />
          <ArtBridge />
          {/* 🔹 ADD NEW IDEAS HERE — just import & drop in */}
        </div>
      </main>
    </>
  );
}
