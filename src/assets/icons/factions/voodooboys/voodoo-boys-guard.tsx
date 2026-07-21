import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — voodoo-boys-guard (voodooboys) */
export function Icon_VoodooBoysGuard() {
  return (
    <FactionIconSvg data-unit="voodoo-boys-guard" data-faction="voodooboys">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M14 8 H34 L42 24 L34 40 H14 L6 24 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(0.60 1.20)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 14 A6 6 0 1 1 23.9 14 M16 36 H32 L28 24 H20 Z" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 42.4 H32" />
      </g>
    </FactionIconSvg>
  );
}
