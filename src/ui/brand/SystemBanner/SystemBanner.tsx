import { BRAND, BRAND_STATUS } from "../../../brand/brand.config";

import "./SystemBanner.css";

interface SystemBannerProps {
  message?: string;
  tone?: "ready" | "warn" | "critical" | "info";
  className?: string;
}

const DEFAULTS: Record<NonNullable<SystemBannerProps["tone"]>, string> = {
  ready: BRAND_STATUS.systemReady,
  warn: BRAND_STATUS.overclockEnabled,
  critical: BRAND_STATUS.coreTempCritical,
  info: BRAND_STATUS.neuralLinkActive,
};

/**
 * Branded HUD / notification strip for system messages.
 */
function SystemBanner({
  message,
  tone = "info",
  className = "",
}: SystemBannerProps) {
  return (
    <div
      className={`system-banner system-banner--${tone} ${className}`.trim()}
      role="status"
    >
      <span className="system-banner__tick" aria-hidden />
      <span className="system-banner__text">{message ?? DEFAULTS[tone]}</span>
      <span className="system-banner__brand">{BRAND.shortName}</span>
    </div>
  );
}

export default SystemBanner;
