import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — militech-trooper (militech) */
export function Icon_MilitechTrooper() {
  return (
    <FactionIconSvg data-unit="militech-trooper" data-faction="militech">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M8 10 H40 V38 H8 Z M8 16 H40 M8 32 H40" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(-1.20 -3.60)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M15 15 H33 V29 H15 Z M18 19 H30 M18 23 H26 M18 27 H28 M30 32 L34 36" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.6 H32" />
      </g>
    </FactionIconSvg>
  );
}
