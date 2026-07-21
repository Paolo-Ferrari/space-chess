import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — nomads-buggy (nomads) */
export function Icon_NomadsBuggy() {
  return (
    <FactionIconSvg data-unit="nomads-buggy" data-faction="nomads">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M8 14 L24 6 L40 14 L38 40 L10 40 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(0.00 -3.00)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 14 A6 6 0 1 1 23.9 14 M16 36 H32 L28 24 H20 Z" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.6 H32" />
      </g>
    </FactionIconSvg>
  );
}
