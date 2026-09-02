import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './TofuGuide.css';

const ANIMATIONS = {
  idle: { file: 'tofu-idle.png', frames: 6, duration: 2200 },
  walk: { file: 'tofu-walk.png', frames: 8, duration: 1050 },
  wave: { file: 'tofu-wave.png', frames: 6, duration: 1200 },
  sleep: { file: 'tofu-sleep.png', frames: 6, duration: 2800 },
  play: { file: 'tofu-play.png', frames: 10, duration: 1800 },
};

const TOUR_STEPS = [
  {
    target: '[data-tofu-tour="about"]',
    message: 'Click “About” for Jonathan’s background, education, interests, and technical toolkit.',
  },
  {
    target: '[data-tofu-tour="projects"]',
    message: 'Click “Projects” to explore what he has built across research, AI, and data science.',
  },
  {
    target: '[data-tofu-tour="experience"]',
    message: 'Click “Experience” to follow his academic, research, and professional journey.',
  },
  {
    target: '[data-tofu-tour="blog"]',
    message: 'Click “Blog” for technical notes, research ideas, and things he is learning. That’s the tour!',
  },
];

const REACTIONS = [
  'That tickles my whiskers.',
  'My bell says hello!',
  'I’m supervising the website.',
];

function TofuGuide() {
  const base = import.meta.env.BASE_URL;
  const [animation, setAnimation] = useState('wave');
  const [animationRun, setAnimationRun] = useState(0);
  const [bubble, setBubble] = useState(null);
  const [tourStep, setTourStep] = useState(-1);
  const [reactionMessage, setReactionMessage] = useState('');
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const reactionIndex = useRef(0);
  const animationTimer = useRef(null);
  const sleepTimer = useRef(null);

  const playOnce = (name, next = 'idle') => {
    window.clearTimeout(animationTimer.current);
    setAnimation(name);
    setAnimationRun((run) => run + 1);
    animationTimer.current = window.setTimeout(
      () => setAnimation(next),
      ANIMATIONS[name].duration
    );
  };

  useEffect(() => {
    const hasAnswered = window.localStorage.getItem('tofu-tour-prompted');
    playOnce('wave');

    if (!hasAnswered) {
      const promptTimer = window.setTimeout(() => {
        setBubble('tour-prompt');
      }, 700);
      return () => window.clearTimeout(promptTimer);
    }
  }, []);

  useEffect(() => {
    const activityEvents = ['pointerdown', 'keydown', 'scroll'];
    const resetSleepTimer = () => {
      window.clearTimeout(sleepTimer.current);
      if (tourStep >= 0) return;
      sleepTimer.current = window.setTimeout(() => {
        setBubble(null);
        setAnimation('sleep');
      }, 30000);
    };

    activityEvents.forEach((event) =>
      window.addEventListener(event, resetSleepTimer, { passive: true })
    );
    resetSleepTimer();

    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetSleepTimer)
      );
      window.clearTimeout(sleepTimer.current);
    };
  }, [tourStep]);

  useEffect(
    () => () => window.clearTimeout(animationTimer.current),
    []
  );

  const moveToTourStep = (index) => {
    const step = TOUR_STEPS[index];
    const target = document.querySelector(step.target);
    document.querySelectorAll('.tofu-tour-target').forEach((element) =>
      element.classList.remove('tofu-tour-target')
    );
    target?.classList.add('tofu-tour-target');
    setTourStep(index);
    setBubble('tour');
    playOnce(index === 0 ? 'wave' : 'walk');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startTour = () => {
    window.localStorage.setItem('tofu-tour-prompted', 'yes');
    moveToTourStep(0);
  };

  const stopTour = () => {
    window.localStorage.setItem('tofu-tour-prompted', 'yes');
    document.querySelectorAll('.tofu-tour-target').forEach((element) =>
      element.classList.remove('tofu-tour-target')
    );
    setTourStep(-1);
    setBubble(null);
    playOnce('wave');
  };

  const nextTourStep = () => {
    if (tourStep === TOUR_STEPS.length - 1) {
      stopTour();
      return;
    }
    moveToTourStep(tourStep + 1);
  };

  const dismissPrompt = () => {
    window.localStorage.setItem('tofu-tour-prompted', 'yes');
    setBubble(null);
    playOnce('idle');
  };

  const reactToClick = () => {
    if (tourStep >= 0) return;
    const message = REACTIONS[reactionIndex.current % REACTIONS.length];
    reactionIndex.current += 1;
    setReactionMessage(message);
    setBubble('reaction');
    playOnce('play');
    window.clearTimeout(animationTimer.current);
    animationTimer.current = window.setTimeout(() => {
      setAnimation('idle');
      setBubble(null);
    }, ANIMATIONS.play.duration);
  };

  const current = ANIMATIONS[animation];
  const message = tourStep >= 0
    ? TOUR_STEPS[tourStep].message
    : bubble === 'reaction'
      ? reactionMessage
      : 'Welcome to Jonathan’s website! I’m Tofu, his spiritual mascot and your guide around here. Want a quick tour?';

  useEffect(() => {
    if (!bubble) {
      setDisplayedMessage('');
      setTypingComplete(false);
      return undefined;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayedMessage(message);
      setTypingComplete(true);
      return undefined;
    }

    let character = 0;
    let typingTimer;
    setDisplayedMessage('');
    setTypingComplete(false);

    const entranceTimer = window.setTimeout(() => {
      typingTimer = window.setInterval(() => {
        character += 1;
        setDisplayedMessage(message.slice(0, character));
        if (character >= message.length) {
          window.clearInterval(typingTimer);
          setTypingComplete(true);
        }
      }, 24);
    }, 260);

    return () => {
      window.clearTimeout(entranceTimer);
      window.clearInterval(typingTimer);
    };
  }, [bubble, message]);

  return createPortal(
    <aside className="tofu-guide" aria-label="Tofu, the website guide">
      {bubble && (
        <div className="tofu-bubble" role="status" aria-live="polite">
          <span className="tofu-sr-only">{message}</span>
          <p
            className={`tofu-bubble-message ${typingComplete ? '' : 'is-typing'}`}
            aria-hidden="true"
          >
            {displayedMessage}
          </p>

          {bubble === 'tour-prompt' && typingComplete && (
            <div className="tofu-actions">
              <button type="button" onClick={startTour}>Show me around</button>
              <button type="button" className="tofu-action-muted" onClick={dismissPrompt}>
                Maybe later
              </button>
            </div>
          )}

          {bubble === 'tour' && typingComplete && (
            <div className="tofu-actions">
              <button type="button" onClick={nextTourStep}>
                {tourStep === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
              </button>
              <button type="button" className="tofu-action-muted" onClick={stopTour}>
                End tour
              </button>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        className={`tofu-character tofu-character-${animation}`}
        onClick={reactToClick}
        aria-label={animation === 'sleep' ? 'Wake Tofu' : 'Play with Tofu'}
        title="Play with Tofu"
        style={{
          '--tofu-frames': current.frames,
          '--tofu-steps': current.frames - 1,
          '--tofu-shift': `${-((current.frames - 1) / current.frames) * 100}%`,
          '--tofu-duration': `${current.duration}ms`,
        }}
      >
        <span className="tofu-sprite" aria-hidden="true">
          <img
            key={`${animation}-${animationRun}`}
            src={`${base}avatar/optimized/${current.file}`}
            alt=""
          />
        </span>
      </button>

      <div className="tofu-quick-actions" aria-label="Tofu controls">
        <button type="button" onClick={startTour} disabled={tourStep >= 0}>
          Tour
        </button>
        <button type="button" onClick={reactToClick} disabled={tourStep >= 0}>
          Play
        </button>
      </div>
    </aside>,
    document.body
  );
}

export default TofuGuide;
