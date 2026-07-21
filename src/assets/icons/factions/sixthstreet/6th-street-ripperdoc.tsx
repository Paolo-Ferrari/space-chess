import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — 6th-street-ripperdoc (sixthstreet) */
export function Icon_6thStreetRipperdoc() {
  return (
    <FactionIconSvg data-unit="6th-street-ripperdoc" data-faction="sixthstreet">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M10 10 H38 V38 H10 Z M24 10 V38 M10 24 H38" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(0.00 -3.00)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M18 14 H28 V22 L34 30 V36 H28 L24 30 L20 36 H14 V30 L20 22 Z" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.6 H32" />
      </g>
    </FactionIconSvg>
  );
}
