import { useId } from "react";

import {
  BRAND,
  type BrandLogoSize,
  type BrandLogoVariant,
} from "../../../brand/brand.config";

import "./Logo.css";

interface LogoProps {
  /** full = mark + wordmark; mark = icon only; mono = high-contrast single ink */
  variant?: BrandLogoVariant;
  size?: BrandLogoSize;
  /** Show stacked full product name under wordmark (hero menus). */
  showProductTitle?: boolean;
  className?: string;
}

/**
 * Brand logo — chess king fused with cyber implant / circuit overload.
 * SVG scales for menu, favicon-adjacent mark, and monochrome docs/UI.
 */
function Logo({
  variant = "full",
  size = "md",
  showProductTitle = false,
  className = "",
}: LogoProps) {
  const uid = useId().replace(/:/g, "");
  const glowId = `ocGlow-${uid}`;
  const coreId = `ocCore-${uid}`;
  const mono = variant === "mono";
  const markOnly = variant === "mark";
  const stroke = mono ? "currentColor" : `url(#${glowId})`;
  const fill = mono ? "currentColor" : `url(#${coreId})`;

  return (
    <div
      className={[
        "oc-logo",
        `oc-logo--${size}`,
        mono ? "oc-logo--mono" : "",
        markOnly ? "oc-logo--mark-only" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="img"
      aria-label={BRAND.fullName}
    >
      <svg
        className="oc-logo__mark"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id={glowId} x1="8" y1="4" x2="56" y2="60">
            <stop offset="0%" stopColor="var(--brand-cyan)" />
            <stop offset="55%" stopColor="var(--brand-yellow)" />
            <stop offset="100%" stopColor="var(--brand-magenta)" />
          </linearGradient>
          <linearGradient id={coreId} x1="32" y1="12" x2="32" y2="56">
            <stop offset="0%" stopColor="var(--brand-yellow)" />
            <stop offset="100%" stopColor="var(--brand-orange)" />
          </linearGradient>
        </defs>

        {/* Implant plate */}
        <path
          className="oc-logo__plate"
          d="M10 18h44v28H10z"
          opacity="0.15"
          fill={mono ? "currentColor" : "var(--brand-cyan)"}
        />
        <path
          className="oc-logo__circuit"
          d="M6 22h8M50 22h8M6 42h8M50 42h8M14 12v8M50 12v8M14 44v8M50 44v8"
          strokeWidth="1.2"
          strokeLinecap="square"
          stroke={stroke}
        />
        <circle className="oc-logo__node" cx="14" cy="22" r="1.6" fill={fill} />
        <circle className="oc-logo__node" cx="50" cy="22" r="1.6" fill={fill} />
        <circle className="oc-logo__node" cx="14" cy="42" r="1.6" fill={fill} />
        <circle className="oc-logo__node" cx="50" cy="42" r="1.6" fill={fill} />

        {/* Cross / crown */}
        <path
          className="oc-logo__stroke"
          strokeWidth="2.2"
          strokeLinecap="round"
          stroke={stroke}
          d="M32 8v11M26.5 13.5h11"
        />
        <circle className="oc-logo__core" cx="32" cy="21" r="2.6" fill={fill} />

        {/* King body as chrome implant */}
        <path
          className="oc-logo__body"
          fill={fill}
          d="M21 27h22l-2.8 7H23.8L21 27zm3.8 9h14.4l1.7 11H23.1l1.7-11zM18 51h28v3.2H18V51z"
        />

        {/* Energy overload arcs */}
        <path
          className="oc-logo__surge"
          strokeWidth="1.4"
          strokeLinecap="round"
          stroke={stroke}
          d="M18 30c4-6 8-8 14-8s10 2 14 8M20 48c3 3 7 4 12 4s9-1 12-4"
        />
        <path
          className="oc-logo__scan"
          strokeWidth="1"
          stroke={stroke}
          d="M24 35.5h16M25.5 45.5h13"
        />
      </svg>

      {!markOnly ? (
        <div className="oc-logo__text">
          <span className="oc-logo__wordmark">
            <em>OVER</em>clock
          </span>
          {showProductTitle ? (
            <span className="oc-logo__product">
              <span>{BRAND.fullNameLines[0]}</span>
              <span>{BRAND.fullNameLines[1]}</span>
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default Logo;
