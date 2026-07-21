import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — 6th-street-commander (sixthstreet) */
export function Icon_6thStreetCommander() {
  return (
    <FactionIconSvg data-unit="6th-street-commander" data-faction="sixthstreet">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M10 10 H38 V38 H10 Z M24 10 V38 M10 24 H38" />
      </g>
      <g className="ficon__glyph">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 16 H32 V32 H16 Z" />
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.6 H32" />
      </g>
    </FactionIconSvg>
  );
}
