import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — edge-techie-wrench (edgerunners) */
export function Icon_EdgeTechieWrench() {
  return (
    <FactionIconSvg data-unit="edge-techie-wrench" data-faction="edgerunners">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 4 L30 18 L44 20 L34 30 L36 44 L24 36 L12 44 L14 30 L4 20 L18 18 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(0.00 -1.80)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M15 15 H33 V29 H15 Z M18 19 H30 M18 23 H26 M18 27 H28 M30 32 L34 36" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.2 H32" />
      </g>
    </FactionIconSvg>
  );
}
