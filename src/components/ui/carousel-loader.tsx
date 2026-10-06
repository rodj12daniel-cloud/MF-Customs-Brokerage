import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import brandLogo from '../../../assets/mflogo-display.png';

const Loader = () => {
  const [progress, setProgress] = useState(0);
  const completionNotified = useRef(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setProgress(document.readyState === 'complete' ? 100 : 92);
      const completeProgress = () => setProgress(100);
      window.addEventListener('load', completeProgress, { once: true });
      return () => window.removeEventListener('load', completeProgress);
    }

    let frame = 0;
    let isLoaded = document.readyState === 'complete';
    let completionStartedAt: number | null = null;
    const startedAt = performance.now();
    const progressDuration = 1900;
    const completionDuration = 400;

    const markLoaded = () => { isLoaded = true; };
    const animateProgress = (now: number) => {
      const elapsed = now - startedAt;
      const loadingProgress = Math.min(elapsed / progressDuration, 1) * 92;

      if (isLoaded && elapsed >= progressDuration) {
        if (completionStartedAt === null) completionStartedAt = now;
        const completion = Math.min((now - completionStartedAt) / completionDuration, 1);
        setProgress(92 + 8 * completion);
      } else {
        setProgress(loadingProgress);
      }

      if (!isLoaded || elapsed < progressDuration || completionStartedAt === null || now - completionStartedAt < completionDuration) {
        frame = window.requestAnimationFrame(animateProgress);
      }
    };

    window.addEventListener('load', markLoaded, { once: true });
    frame = window.requestAnimationFrame(animateProgress);

    return () => {
      window.removeEventListener('load', markLoaded);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const percentage = Math.round(progress);
  const isReady = percentage === 100;

  useEffect(() => {
    if (!isReady || completionNotified.current) return;
    completionNotified.current = true;
    window.dispatchEvent(new Event('mf-loader-complete'));
  }, [isReady]);

  return (
    <StyledWrapper>
      <div className="shipment-loader">
        <img className="loader-logo" src={brandLogo} alt="MF Customs Brokerage" />
        <span className="loader-caption">CUSTOMS BROKERAGE &amp; LOGISTICS</span>
        <div
          className="loader-runway"
          role="progressbar"
          aria-label="Preparing your shipment"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
        >
          <span className="runway-centerline" aria-hidden="true" />
          <span className="runway-progress" style={{ width: `${progress}%` }} aria-hidden="true" />
          <svg
            className="cargo-plane"
            style={{ left: `${Math.min(progress, 91)}%` }}
            viewBox="0 0 72 46"
            aria-hidden="true"
          >
            <path d="M44 21H28L8 2l10-2 26 21ZM44 25H28L8 44l10 2 26-21ZM8 21 2 14h4l6 7Zm0 4-6 7h4l6-7Z" fill="currentColor" />
            <ellipse cx="34" cy="23" rx="29" ry="7" fill="currentColor" />
            <path d="M61 19.5C66 21.5 67.5 23 67 23c.5 0-1 1.5-6 3.5L58 23Z" fill="currentColor" />
          </svg>
        </div>
        <div className="loader-status">
          <span className="loader-percentage" aria-hidden="true">{percentage}%</span>
          <span className="loader-message" role="status" aria-live="polite">
            {isReady ? 'Shipment ready' : 'Preparing your shipment'}
          </span>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .shipment-loader {
    display: flex;
    width: min(440px, calc(100vw - 48px));
    flex-direction: column;
    align-items: center;
  }

  .loader-logo {
    display: block;
    width: 84px;
    height: 56px;
    margin-bottom: 12px;
    object-fit: contain;
    filter: brightness(0) saturate(100%) invert(11%) sepia(87%) saturate(4582%) hue-rotate(341deg) brightness(94%) contrast(104%);
  }

  .loader-caption {
    margin-bottom: 25px;
    color: var(--dim);
    font-family: var(--sans);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 2px;
    text-align: center;
  }

  .loader-runway {
    position: relative;
    width: 100%;
    height: 48px;
    overflow: visible;
    border: 1px solid rgba(128, 128, 128, .18);
    border-radius: 999px;
    background: linear-gradient(180deg, #565656, #303030);
    box-shadow: inset 0 4px 12px rgba(0, 0, 0, .55), 0 2px 8px rgba(0, 0, 0, .2);
  }

  .runway-centerline {
    position: absolute;
    top: 50%;
    right: 18px;
    left: 18px;
    height: 2px;
    transform: translateY(-50%);
    background-image: repeating-linear-gradient(to right, rgba(255, 255, 255, .4) 0 10px, transparent 10px 24px);
  }

  .runway-progress {
    position: absolute;
    inset: 0 auto 0 0;
    max-width: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #6b0000, #be1c1c 55%, #e03030);
    box-shadow: inset 0 1px 3px rgba(255, 255, 255, .15);
    transition: width .08s linear;
  }

  .cargo-plane {
    position: absolute;
    top: 50%;
    z-index: 1;
    width: 52px;
    height: auto;
    color: #f5f5f3;
    filter: drop-shadow(0 3px 7px rgba(0, 0, 0, .55));
    transform: translate(-50%, -50%);
    transition: left .08s linear, opacity .2s ease;
  }

  .loader-status {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    margin-top: 17px;
    font-family: var(--sans);
  }

  .loader-percentage {
    color: var(--ink);
    font-size: 26px;
    font-variant-numeric: tabular-nums;
    font-weight: 700;
  }

  .loader-message {
    color: var(--dim);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.4px;
    text-transform: uppercase;
  }

  html[data-theme="dark"] .loader-logo {
    filter: brightness(0) invert(1);
  }

  @media (max-width: 480px) {
    .loader-runway {
      height: 42px;
    }

    .cargo-plane {
      width: 44px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .runway-progress,
    .cargo-plane {
      transition: none;
    }
  }
`;

export default Loader;
