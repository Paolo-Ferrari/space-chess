import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — nomads-tech (nomads) */
export function Icon_NomadsTech() {
  return (
    <FactionIconSvg data-unit="nomads-tech" data-faction="nomads">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M8 14 L24 6 L40 14 L38 40 L10 40 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(-1.20 -1.80)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M15 15 H33 V29 H15 Z M18 19 H30 M18 23 H26 M18 27 H28 M30 32 L34 36" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.6 H32" />
      </g>
    </FactionIconSvg>
  );
}
