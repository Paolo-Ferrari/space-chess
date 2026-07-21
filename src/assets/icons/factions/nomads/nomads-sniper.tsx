import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — nomads-sniper (nomads) */
export function Icon_NomadsSniper() {
  return (
    <FactionIconSvg data-unit="nomads-sniper" data-faction="nomads">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M8 14 L24 6 L40 14 L38 40 L10 40 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(-1.20 -1.20)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 16 A7 7 0 1 1 23.9 16 M24 16 A2.5 2.5 0 1 1 23.9 16 M24 10 V13 M24 27 V30 M15 20 H18 M30 20 H33" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.6 H32" />
      </g>
    </FactionIconSvg>
  );
}
