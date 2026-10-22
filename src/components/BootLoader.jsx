import { useEffect, useState } from 'react';
import './BootLoader.css';

const FULL_DURATION = 3000;
const REDUCED_DURATION = 500;
const GRAPH_DURATION = 2550;

function BootLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reducedMotion ? REDUCED_DURATION : FULL_DURATION;
    const graphDuration = reducedMotion ? 1 : GRAPH_DURATION;
    const startedAt = performance.now();
    let animationFrame;

    const updateProgress = (now) => {
      const nextProgress = Math.min((now - startedAt) / graphDuration, 1);
      setProgress(nextProgress);

      if (nextProgress < 1) {
        animationFrame = window.requestAnimationFrame(updateProgress);
      }
    };

    animationFrame = window.requestAnimationFrame(updateProgress);
    const completionTimer = window.setTimeout(onComplete, duration);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(completionTimer);
    };
  }, [onComplete]);

  const epoch = Math.round(progress * 100);
  const trainingLoss = 1.05 * Math.exp(-4.2 * progress) + 0.025;
  const validationLoss = 0.88 * Math.exp(-3.35 * progress)
    + 0.065
    + Math.sin(progress * 18) * 0.008;

  return (
    <div className="boot-loader" role="status" aria-live="polite">
      <div className="boot-loader-panel">
        <header className="boot-loader-header">
          <div>
            <p className="boot-loader-kicker">SYSTEM BOOT // MODEL TRAINING</p>
            <h1>Optimizing neural network</h1>
          </div>
          <span className="boot-loader-status">RUNNING</span>
        </header>

        <div className="boot-loader-metrics" aria-hidden="true">
          <span>optimizer: adam</span>
          <span>lr: 3e-4</span>
          <span>batch: 64</span>
        </div>

        <div className="boot-chart-wrap">
          <svg
            className="boot-chart"
            viewBox="0 0 720 330"
            role="img"
            aria-label="Animated training and validation loss curves decreasing over one hundred epochs"
          >
            <g className="boot-grid" aria-hidden="true">
              <line x1="76" y1="42" x2="76" y2="274" />
              <line x1="76" y1="274" x2="680" y2="274" />
              <line x1="76" y1="216" x2="680" y2="216" />
              <line x1="76" y1="158" x2="680" y2="158" />
              <line x1="76" y1="100" x2="680" y2="100" />
              <line x1="227" y1="42" x2="227" y2="274" />
              <line x1="378" y1="42" x2="378" y2="274" />
              <line x1="529" y1="42" x2="529" y2="274" />
              <line x1="680" y1="42" x2="680" y2="274" />
            </g>

            <g className="boot-axis-labels" aria-hidden="true">
              <text x="59" y="278">0</text>
              <text x="45" y="220">0.25</text>
              <text x="45" y="162">0.50</text>
              <text x="45" y="104">0.75</text>
              <text x="51" y="47">1.0</text>
              <text x="72" y="300">0</text>
              <text x="218" y="300">25</text>
              <text x="369" y="300">50</text>
              <text x="520" y="300">75</text>
              <text x="666" y="300">100</text>
              <text className="boot-axis-title" x="351" y="324">EPOCH</text>
              <text className="boot-axis-title" x="18" y="177" transform="rotate(-90 18 177)">LOSS</text>
            </g>

            <path
              className="boot-curve boot-curve-training"
              pathLength="1"
              d="M76 54 C108 83 123 119 151 145 S198 176 227 193 S281 220 318 230 S382 245 425 250 S501 259 552 262 S632 266 680 267"
            />
            <path
              className="boot-curve boot-curve-validation"
              pathLength="1"
              d="M76 68 C112 91 129 126 157 151 S203 181 231 194 S280 217 321 224 S377 234 419 238 S469 241 510 244 S557 247 599 246 S650 249 680 248"
            />
            <circle className="boot-endpoint boot-endpoint-training" cx="680" cy="267" r="5" />
            <circle className="boot-endpoint boot-endpoint-validation" cx="680" cy="248" r="5" />
          </svg>
        </div>

        <div className="boot-loader-footer">
          <div className="boot-live-metric">
            <span>epoch</span>
            <strong>{String(epoch).padStart(3, '0')} / 100</strong>
          </div>
          <div className="boot-live-metric">
            <span>train_loss</span>
            <strong>{trainingLoss.toFixed(4)}</strong>
          </div>
          <div className="boot-live-metric">
            <span>val_loss</span>
            <strong>{validationLoss.toFixed(4)}</strong>
          </div>
        </div>

        <div
          className="boot-progress"
          role="progressbar"
          aria-label="Loading website"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={epoch}
        >
          <span />
        </div>
      </div>
    </div>
  );
}

export default BootLoader;
