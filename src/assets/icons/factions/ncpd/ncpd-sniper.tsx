import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — ncpd-sniper (ncpd) */
export function Icon_NcpdSniper() {
  return (
    <FactionIconSvg data-unit="ncpd-sniper" data-faction="ncpd">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 6 L38 14 V30 L24 42 L10 30 V14 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(1.20 -1.20)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 16 A7 7 0 1 1 23.9 16 M24 16 A2.5 2.5 0 1 1 23.9 16 M24 10 V13 M24 27 V30 M15 20 H18 M30 20 H33" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.6 H32" />
      </g>
    </FactionIconSvg>
  );
}
