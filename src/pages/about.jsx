export default function About() {
  return (
    <main style={{ padding: '80px 48px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '24px' }}>
        About <span style={{ color: 'var(--accent)' }}>Me</span>
      </h1>
      <p style={{ fontSize: '0.9rem', lineHeight: '1.9', color: 'var(--muted)', marginBottom: '20px' }}>
        I'm a builder who turns startup concepts into functional prototypes. 
        This site is my public lab where I ship early versions, test ideas, 
        and iterate quickly.
      </p>
      <p style={{ fontSize: '0.9rem', lineHeight: '1.9', color: 'var(--muted)' }}>
        Every project below started as a weekend experiment. Some grow, some pivot, 
        but all get built — because ideas deserve to exist, not just live in notes.
      </p>
    </main>
  );
}
