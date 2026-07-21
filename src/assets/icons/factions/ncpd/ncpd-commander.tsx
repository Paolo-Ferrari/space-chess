import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — ncpd-commander (ncpd) */
export function Icon_NcpdCommander() {
  return (
    <FactionIconSvg data-unit="ncpd-commander" data-faction="ncpd">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 6 L38 14 V30 L24 42 L10 30 V14 Z" />
      </g>
      <g className="ficon__glyph">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 14 L34 20 V28 L24 36 L14 28 V20 Z M24 20 V30" />
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 42.0 H32" />
      </g>
    </FactionIconSvg>
  );
}
