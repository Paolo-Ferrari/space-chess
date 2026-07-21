import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — arasaka-adam-smasher (arasaka) */
export function Icon_ArasakaAdamSmasher() {
  return (
    <FactionIconSvg data-unit="arasaka-adam-smasher" data-faction="arasaka">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M10 8 L38 8 L42 16 L38 40 L10 40 L6 16 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(0.60 0.60)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 14 H32 V26 L28 34 H20 L16 26 Z M18 34 H30 M19 18 H22 M26 18 H29 M20 30 H28" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 42.4 H32" />
      </g>
    </FactionIconSvg>
  );
}
