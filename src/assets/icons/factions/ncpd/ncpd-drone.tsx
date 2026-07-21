import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — ncpd-drone (ncpd) */
export function Icon_NcpdDrone() {
  return (
    <FactionIconSvg data-unit="ncpd-drone" data-faction="ncpd">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 6 L38 14 V30 L24 42 L10 30 V14 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(-1.20 -1.20)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M17 18 H31 V28 H17 Z M21 23 A1.5 1.5 0 1 1 20.9 23 M27 23 A1.5 1.5 0 1 1 26.9 23 M20 18 L18 14 M28 18 L30 14" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 40.8 H32" />
      </g>
    </FactionIconSvg>
  );
}
