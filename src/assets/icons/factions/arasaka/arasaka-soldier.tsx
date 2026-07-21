import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — arasaka-soldier (arasaka) */
export function Icon_ArasakaSoldier() {
  return (
    <FactionIconSvg data-unit="arasaka-soldier" data-faction="arasaka">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M10 8 L38 8 L42 16 L38 40 L10 40 L6 16 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(-0.60 -2.40)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 14 A6 6 0 1 1 23.9 14 M16 36 H32 L28 24 H20 Z" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 40.8 H32" />
      </g>
    </FactionIconSvg>
  );
}
