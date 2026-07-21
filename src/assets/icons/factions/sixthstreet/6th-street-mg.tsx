import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — 6th-street-mg (sixthstreet) */
export function Icon_6thStreetMg() {
  return (
    <FactionIconSvg data-unit="6th-street-mg" data-faction="sixthstreet">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M10 10 H38 V38 H10 Z M24 10 V38 M10 24 H38" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(0.00 0.00)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 14 A6 6 0 1 1 23.9 14 M16 36 H32 L28 24 H20 Z" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.6 H32" />
      </g>
    </FactionIconSvg>
  );
}
