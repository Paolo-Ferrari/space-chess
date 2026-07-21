import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — voodoo-boys-commander (voodooboys) */
export function Icon_VoodooBoysCommander() {
  return (
    <FactionIconSvg data-unit="voodoo-boys-commander" data-faction="voodooboys">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M14 8 H34 L42 24 L34 40 H14 L6 24 Z" />
      </g>
      <g className="ficon__glyph">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 14 A9 9 0 1 1 23.9 14 M24 14 V32 M15 23 H33" />
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 40.8 H32" />
      </g>
    </FactionIconSvg>
  );
}
