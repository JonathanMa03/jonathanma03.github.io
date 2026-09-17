import { useEffect, useRef, useState } from 'react';
import vibes from '../data/vibes';
import './Vibes.css';

const spotifyControllers = new Set();
let spotifyIframeApiPromise;

function loadSpotifyIframeApi() {
  if (window.__spotifyIframeApi) {
    return Promise.resolve(window.__spotifyIframeApi);
  }

  if (!spotifyIframeApiPromise) {
    spotifyIframeApiPromise = new Promise((resolve, reject) => {
      const previousReadyHandler = window.onSpotifyIframeApiReady;

      window.onSpotifyIframeApiReady = (iframeApi) => {
        window.__spotifyIframeApi = iframeApi;
        previousReadyHandler?.(iframeApi);
        resolve(iframeApi);
      };

      if (!document.querySelector('script[data-spotify-iframe-api]')) {
        const script = document.createElement('script');
        script.src = 'https://open.spotify.com/embed/iframe-api/v1';
        script.async = true;
        script.dataset.spotifyIframeApi = 'true';
        script.addEventListener('error', () => {
          spotifyIframeApiPromise = undefined;
          reject(new Error('Spotify iframe API failed to load.'));
        });
        document.body.appendChild(script);
      }
    });
  }

  return spotifyIframeApiPromise;
}

function pauseOtherSpotifyPlayers(activeController) {
  spotifyControllers.forEach((controller) => {
    if (controller !== activeController) controller.pause();
  });
}

function getSpotifyEntityUrl(embedUrl) {
  const url = new URL(embedUrl);
  url.pathname = url.pathname.replace('/embed/', '/');
  return url.toString();
}

function SpotifyEmbed({ selection, title }) {
  const embedShell = useRef(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    let controller;
    let cancelled = false;
    const shell = embedShell.current;
    const target = document.createElement('div');

    shell?.replaceChildren(target);

    loadSpotifyIframeApi()
      .then((iframeApi) => {
        if (cancelled || !shell?.isConnected) return;

        iframeApi.createController(
          target,
          {
            url: getSpotifyEntityUrl(selection.embedUrl),
            width: '100%',
            height: selection.height,
          },
          (createdController) => {
            if (cancelled) {
              createdController.destroy();
              return;
            }

            controller = createdController;
            spotifyControllers.add(controller);
            controller.addListener('playback_started', () => {
              pauseOtherSpotifyPlayers(controller);
            });
          }
        );
      })
      .catch(() => {
        if (!cancelled) setUseFallback(true);
      });

    return () => {
      cancelled = true;
      if (controller) {
        spotifyControllers.delete(controller);
        controller.destroy();
      }
      shell?.replaceChildren();
    };
  }, [selection.embedUrl, selection.height]);

  if (useFallback) {
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

  return (
    <div
      className="vibes-spotify-embed-shell"
      style={{ '--spotify-embed-height': `${selection.height}px` }}
      role="group"
      aria-label={title}
      ref={embedShell}
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
