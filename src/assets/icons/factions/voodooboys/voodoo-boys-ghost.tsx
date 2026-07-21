import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — voodoo-boys-ghost (voodooboys) */
export function Icon_VoodooBoysGhost() {
  return (
    <FactionIconSvg data-unit="voodoo-boys-ghost" data-faction="voodooboys">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M14 8 H34 L42 24 L34 40 H14 L6 24 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(-0.60 0.00)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 16 A6 6 0 1 1 23.9 16 M18 24 H30 V32 H18 Z M14 16 L10 12 M34 16 L38 12" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 42.0 H32" />
      </g>
    </FactionIconSvg>
  );
}
