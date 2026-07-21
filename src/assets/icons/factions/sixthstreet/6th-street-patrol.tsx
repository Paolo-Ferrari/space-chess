import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — 6th-street-patrol (sixthstreet) */
export function Icon_6thStreetPatrol() {
  return (
    <FactionIconSvg data-unit="6th-street-patrol" data-faction="sixthstreet">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M10 10 H38 V38 H10 Z M24 10 V38 M10 24 H38" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(0.60 -1.20)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M12 20 H36 L32 28 H16 Z M18 24 H30 M24 16 V20" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.6 H32" />
      </g>
    </FactionIconSvg>
  );
}
