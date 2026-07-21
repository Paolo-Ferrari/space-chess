import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — voodoo-boys-legendary (voodooboys) */
export function Icon_VoodooBoysLegendary() {
  return (
    <FactionIconSvg data-unit="voodoo-boys-legendary" data-faction="voodooboys">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M14 8 H34 L42 24 L34 40 H14 L6 24 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(0.60 -3.60)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 12 L34 22 V32 L24 38 L14 32 V22 Z M24 18 V32 M18 24 H30" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.2 H32" />
      </g>
    </FactionIconSvg>
  );
}
