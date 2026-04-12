import { useEffect, useState } from 'react';

function Home() {
  const base = import.meta.env.BASE_URL;
  const [flipped, setFlipped] = useState(false);

  const CARD_FRONT = 'business-card-front.png';
  const CARD_BACK = 'business-card-back.png';
  const CARD_PDF = 'business-card.pdf';

  const phrases = ['Finance', 'Economics', 'Clinical Data Science', 'AI'];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const typingSpeed = isDeleting ? 45 : 90;
    const pauseTime = 1200;

    let timeout;

    if (!isDeleting && displayedText === currentPhrase) {
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && displayedText === '') {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    } else {
      timeout = setTimeout(() => {
        setDisplayedText((prev) =>
          isDeleting
            ? currentPhrase.slice(0, prev.length - 1)
            : currentPhrase.slice(0, prev.length + 1)
        );
      }, typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, phraseIndex]);

  return (
    <section className="section section-narrow">
      <p className="eyebrow">Hi, my name is</p>

      <h1
        style={{
          fontSize: 'clamp(2.8rem, 8vw, 5rem)',
          marginBottom: '0.35rem',
        }}
      >
        Jonathan Y. Ma.
      </h1>

      <h2
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(1.2rem, 3vw, 2rem)',
          color: 'var(--color-text-muted)',
          fontWeight: 600,
          maxWidth: '850px',
          marginBottom: '1.5rem',
          minHeight: '3.2rem',
        }}
      >
        I build quantitative tools for {' '}
        <span style={{ color: 'var(--color-accent)' }}>
          {displayedText}
          <span
            style={{
              display: 'inline-block',
              marginLeft: '2px',
              animation: 'blink 1s step-end infinite',
            }}
          >
            |
          </span>
        </span>
        .
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: '2rem',
          alignItems: 'center',
          marginTop: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src={`${base}me.jpg`}
            alt="Jonathan Y. Ma"
            style={{
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              border: '3px solid var(--color-accent)',
              objectFit: 'cover',
              boxShadow: 'var(--shadow-md)',
            }}
          />
        </div>

        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <p style={{ fontSize: '1.05rem' }}>
            I’m a Finance and Economics graduate with a strong foundation in
            Applied Mathematics, currently pursuing a Master’s in Engineering at
            Johns Hopkins. My work bridges Industrial Engineering, Applied
            Statistics, and Optimization, focused on solving real-world problems
            through empirical robustness, modeling, and optimization.
          </p>

          <p style={{ fontSize: '1.05rem' }}>
            <strong style={{ color: 'var(--color-heading)' }}>Interests:</strong>{' '}
            Probabilistic Foundations of Machine Learning, Bayesian Modeling and
            Computation, Macro-Econometrics, LLMs and Agentic AI
          </p>
        </div>
      </div>

      <div
        className="hover-lift"
        style={{
          marginTop: '3rem',
          padding: '1.5rem',
          border: 'var(--border-thin)',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(255,255,255,0.03)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <p
          className="eyebrow"
          style={{ marginBottom: '0.75rem', textAlign: 'left' }}
        >
          Featured
        </p>

        <h3
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1.4rem',
            marginBottom: '0.75rem',
          }}
        >
          Personal AI Assistant
        </h3>

        <p style={{ maxWidth: '720px' }}>
          I built a beta AI assistant with access to my resume, course notes,
          and research materials. It can answer questions about my academic
          background, technical interests, projects, and ongoing work.
        </p>

        <div style={{ marginTop: '1rem' }}>
          <a
            href="https://agentic-jym.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="site-resume-btn"
          >
            Chat with my AI Assistant →
          </a>
        </div>
      </div>

      <div style={{ marginTop: '4rem' }}>
        <p className="eyebrow">Identity</p>
        <h2 className="section-heading" style={{ marginBottom: '1.25rem' }}>
          Business Card
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: '520px',
              maxWidth: '92vw',
              aspectRatio: '1050 / 600',
              perspective: '1200px',
            }}
          >
            <div
              onClick={() => setFlipped((v) => !v)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setFlipped((v) => !v);
              }}
              aria-label="Flip business card"
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                transformStyle: 'preserve-3d',
                WebkitTransformStyle: 'preserve-3d',
                transition: 'transform 650ms ease',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                borderRadius: '14px',
                cursor: 'pointer',
                boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
                border: '1px solid rgba(255,255,255,0.14)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '14px',
                  overflow: 'hidden',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'translateZ(0)',
                }}
              >
                <img
                  src={`${base}${CARD_FRONT}`}
                  alt="Business card front"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '14px',
                  overflow: 'hidden',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg) translateZ(0)',
                }}
              >
                <img
                  src={`${base}${CARD_BACK}`}
                  alt="Business card back"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: '0.85rem',
            color: 'var(--color-text-muted)',
            fontSize: '0.95rem',
          }}
        >
          Click the card to flip
        </div>

        <div style={{ marginTop: '1rem' }}>
          <a
            href={`${base}${CARD_PDF}`}
            download
            className="site-resume-btn"
          >
            Download Business Card (PDF)
          </a>
        </div>
      </div>
    </section>
  );
}

export default Home;