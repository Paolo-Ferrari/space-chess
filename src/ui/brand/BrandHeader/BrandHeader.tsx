import { BRAND, BRAND_STATUS } from "../../../brand/brand.config";
import Logo from "../Logo/Logo";

import "./BrandHeader.css";

interface BrandHeaderProps {
  /** Optional status line under brand */
  status?: string;
  compact?: boolean;
  className?: string;
}

function BrandHeader({
  status = BRAND_STATUS.neuralLinkActive,
  compact = false,
  className = "",
}: BrandHeaderProps) {
  return (
    <div
      className={`brand-header ${compact ? "brand-header--compact" : ""} ${className}`.trim()}
    >
      <Logo
        variant="full"
        size={compact ? "sm" : "lg"}
        showProductTitle={!compact}
      />
      <div className="brand-header__meta" aria-live="polite">
        <span className="brand-header__status">{status}</span>
        <span className="brand-header__build">
          {BRAND.buildLabel} · {BRAND.shortName.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

export default BrandHeader;
