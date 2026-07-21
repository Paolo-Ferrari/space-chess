import { FactionIconSvg } from "./FactionIconSvg";

/** Used when unitId is missing from ICON_REGISTRY. */
export function IconFallback() {
  return (
    <FactionIconSvg data-unit="fallback">
      <circle cx="24" cy="24" r="14" />
      <path d="M18 24 H30 M24 18 V30" />
    </FactionIconSvg>
  );
}
