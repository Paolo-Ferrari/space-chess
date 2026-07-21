import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — arasaka-ripperdoc (arasaka) */
export function Icon_ArasakaRipperdoc() {
  return (
    <FactionIconSvg data-unit="arasaka-ripperdoc" data-faction="arasaka">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M10 8 L38 8 L42 16 L38 40 L10 40 L6 16 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(0.00 0.60)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M18 14 H28 V22 L34 30 V36 H28 L24 30 L20 36 H14 V30 L20 22 Z" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.6 H32" />
      </g>
    </FactionIconSvg>
  );
}
