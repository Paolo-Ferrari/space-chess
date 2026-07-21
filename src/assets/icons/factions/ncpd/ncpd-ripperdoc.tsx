import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — ncpd-ripperdoc (ncpd) */
export function Icon_NcpdRipperdoc() {
  return (
    <FactionIconSvg data-unit="ncpd-ripperdoc" data-faction="ncpd">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 6 L38 14 V30 L24 42 L10 30 V14 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(1.20 0.60)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M18 14 H28 V22 L34 30 V36 H28 L24 30 L20 36 H14 V30 L20 22 Z" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 42.0 H32" />
      </g>
    </FactionIconSvg>
  );
}
