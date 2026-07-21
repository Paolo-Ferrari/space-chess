import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — ncpd-riot (ncpd) */
export function Icon_NcpdRiot() {
  return (
    <FactionIconSvg data-unit="ncpd-riot" data-faction="ncpd">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 6 L38 14 V30 L24 42 L10 30 V14 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(-0.60 -1.20)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 28 V18 C16 14 20 12 24 12 C28 12 32 14 32 18 V28 M14 28 H34 M20 20 H28" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.2 H32" />
      </g>
    </FactionIconSvg>
  );
}
