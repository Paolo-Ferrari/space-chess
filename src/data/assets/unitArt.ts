/**
 * Unit art paths.
 * Board + compact UI use SVG pictograms under /assets/unit-icons/.
 * Large portrait PNGs (optional) can still live under /assets/units/.
 */

/** Fallback when a unit SVG is missing. */
export const UNIT_PLACEHOLDER_IMAGE = "/assets/unit-icons/_placeholder.svg";

/** Canonical public path for a unit board icon (SVG). */
export function unitImagePath(unitId: string): string {
  return `/assets/unit-icons/${unitId}.svg`;
}

export function isUnitImagePath(path: string): boolean {
  return (
    (path.startsWith("/assets/unit-icons/") ||
      path.startsWith("/assets/units/")) &&
    (path.endsWith(".svg") || path.endsWith(".png"))
  );
}
