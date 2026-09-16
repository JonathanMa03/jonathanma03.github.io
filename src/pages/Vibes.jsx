import vibes from '../data/vibes';
import './Vibes.css';

function SpotifyEmbed({ selection, title }) {
  return (
    <iframe
      className="vibes-spotify-embed"
      title={title}
      src={selection.embedUrl}
      width="100%"
      height={selection.height}
      frameBorder="0"
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}

function VibeCard({ selection, className = '', index, children }) {
  return (
    <article
      className={`vibes-card ${className}`}
      style={{ '--vibes-delay': `${index * 110}ms` }}
    >
      <div className="vibes-card-copy">
        <span className="vibes-card-number" aria-hidden="true">
          0{index + 1}
        </span>
        <div>
          <p className="eyebrow">{selection.label}</p>
          <p className="vibes-description">{selection.description}</p>
        </div>
        {children}
      </div>

      <SpotifyEmbed selection={selection} title={selection.label} />
    </article>
  );
}

function Vibes() {
  const base = import.meta.env.BASE_URL;

  return (
    <section className="section vibes-page">
      <div className="vibes-ambient" aria-hidden="true">
        <span />
        <span />
      </div>

      <header className="vibes-intro">
        <div>
          <p className="eyebrow">06. Vibes</p>
          <h1 className="section-heading">Impeccable Vibes</h1>
          <p className="vibes-lede">
            A small widget for what has been shaping my vibes lately—current
            favorites, repeat listens, and one very discerning cat&apos;s pick.
          </p>
        </div>

        <div className="vibes-equalizer" aria-hidden="true">
          {Array.from({ length: 9 }, (_, index) => (
            <span key={index} style={{ '--bar': index }} />
          ))}
        </div>
      </header>

      <div className="vibes-grid">
        <VibeCard
          selection={vibes.currentRotation}
          className="vibes-card-rotation"
          index={0}
        />

        <VibeCard
          selection={vibes.featuredTrack}
          className="vibes-card-track"
          index={1}
        />

        <VibeCard
          selection={vibes.tofuPick}
          className="vibes-card-tofu"
          index={2}
        >
          <div className="vibes-tofu" aria-hidden="true">
            <div className="vibes-tofu-bubble">This one has purr-fect vibes.</div>
            <img src={`${base}avatar/tofu.png`} alt="" />
          </div>
        </VibeCard>

        <VibeCard
          selection={vibes.featuredArtist}
          className="vibes-card-artist"
          index={3}
        />
      </div>
    </section>
  );
}

export default Vibes;
