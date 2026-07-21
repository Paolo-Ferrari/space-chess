import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — ncpd-maxtac (ncpd) */
export function Icon_NcpdMaxtac() {
  return (
    <FactionIconSvg data-unit="ncpd-maxtac" data-faction="ncpd">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 6 L38 14 V30 L24 42 L10 30 V14 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(-1.20 -3.60)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 14 A6 6 0 1 1 23.9 14 M16 36 H32 L28 24 H20 Z" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 40.8 H32" />
      </g>
    </FactionIconSvg>
  );
}
