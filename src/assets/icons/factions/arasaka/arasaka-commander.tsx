import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — arasaka-commander (arasaka) */
export function Icon_ArasakaCommander() {
  return (
    <FactionIconSvg data-unit="arasaka-commander" data-faction="arasaka">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M10 8 L38 8 L42 16 L38 40 L10 40 L6 16 Z" />
      </g>
      <g className="ficon__glyph">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 14 L34 34 H14 Z M20 28 H28" />
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.6 H32" />
      </g>
    </FactionIconSvg>
  );
}
