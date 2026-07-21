import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — 6th-street-marksman (sixthstreet) */
export function Icon_6thStreetMarksman() {
  return (
    <FactionIconSvg data-unit="6th-street-marksman" data-faction="sixthstreet">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M10 10 H38 V38 H10 Z M24 10 V38 M10 24 H38" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(0.00 0.60)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 16 A7 7 0 1 1 23.9 16 M24 16 A2.5 2.5 0 1 1 23.9 16 M24 10 V13 M24 27 V30 M15 20 H18 M30 20 H33" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 42.0 H32" />
      </g>
    </FactionIconSvg>
  );
}
