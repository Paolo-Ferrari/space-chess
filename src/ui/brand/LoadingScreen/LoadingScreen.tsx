import { useEffect, useState } from "react";

import { BRAND, BRAND_STATUS } from "../../../brand/brand.config";
import Logo from "../Logo/Logo";
import SystemBanner from "../SystemBanner/SystemBanner";

import "./LoadingScreen.css";

interface LoadingScreenProps {
  onComplete: () => void;
  /** Minimum display time (ms). */
  durationMs?: number;
}

const BOOT_STEPS = [
  BRAND_STATUS.systemReady,
  BRAND_STATUS.neuralLinkActive,
  BRAND_STATUS.overclockEnabled,
  BRAND_STATUS.bootComplete,
] as const;

function LoadingScreen({
  onComplete,
  durationMs = 2200,
}: LoadingScreenProps) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const started = Date.now();
    const tick = window.setInterval(() => {
      const elapsed = Date.now() - started;
      const ratio = Math.min(1, elapsed / durationMs);
      setProgress(Math.round(ratio * 100));
      setStep(Math.min(BOOT_STEPS.length - 1, Math.floor(ratio * BOOT_STEPS.length)));
      if (ratio >= 1) {
        window.clearInterval(tick);
        onComplete();
      }
    }, 40);
    return () => window.clearInterval(tick);
  }, [durationMs, onComplete]);

  return (
    <div
      className="loading-screen atmosphere-city"
      role="progressbar"
      aria-valuenow={progress}
    >
      <div className="loading-screen__grid" aria-hidden />
      <div className="loading-screen__skyline" aria-hidden />
      <div className="loading-screen__content">
        <Logo variant="full" size="hero" showProductTitle />
        <p className="loading-screen__tagline">{BRAND.taglineEn}</p>
        <SystemBanner message={BOOT_STEPS[step]} tone="warn" />
        <div className="loading-screen__bar">
          <span style={{ width: `${progress}%` }} />
        </div>
        <p className="loading-screen__pct">{progress}%</p>
      </div>
      <Logo variant="mono" size="sm" className="loading-screen__mono" />
    </div>
  );
}

export default LoadingScreen;
