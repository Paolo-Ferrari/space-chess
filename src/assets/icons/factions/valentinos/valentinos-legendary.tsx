import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — valentinos-legendary (valentinos) */
export function Icon_ValentinosLegendary() {
  return (
    <FactionIconSvg data-unit="valentinos-legendary" data-faction="valentinos">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 6 L40 18 L34 40 L14 40 L8 18 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(0.00 -1.20)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 12 L34 22 V32 L24 38 L14 32 V22 Z M24 18 V32 M18 24 H30" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 40.8 H32" />
      </g>
    </FactionIconSvg>
  );
}
