import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — 6th-street-legendary (sixthstreet) */
export function Icon_6thStreetLegendary() {
  return (
    <FactionIconSvg data-unit="6th-street-legendary" data-faction="sixthstreet">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M10 10 H38 V38 H10 Z M24 10 V38 M10 24 H38" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(0.60 -3.60)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 12 L34 22 V32 L24 38 L14 32 V22 Z M24 18 V32 M18 24 H30" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 40.8 H32" />
      </g>
    </FactionIconSvg>
  );
}
