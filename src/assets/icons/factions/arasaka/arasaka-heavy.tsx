import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — arasaka-heavy (arasaka) */
export function Icon_ArasakaHeavy() {
  return (
    <FactionIconSvg data-unit="arasaka-heavy" data-faction="arasaka">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M10 8 L38 8 L42 16 L38 40 L10 40 L6 16 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(0.60 -3.00)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 28 V18 C16 14 20 12 24 12 C28 12 32 14 32 18 V28 M14 28 H34 M20 20 H28" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.6 H32" />
      </g>
    </FactionIconSvg>
  );
}
