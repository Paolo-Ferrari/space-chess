import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — militech-drone (militech) */
export function Icon_MilitechDrone() {
  return (
    <FactionIconSvg data-unit="militech-drone" data-faction="militech">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M8 10 H40 V38 H8 Z M8 16 H40 M8 32 H40" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(-0.60 0.60)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M17 18 H31 V28 H17 Z M21 23 A1.5 1.5 0 1 1 20.9 23 M27 23 A1.5 1.5 0 1 1 26.9 23 M20 18 L18 14 M28 18 L30 14" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 42.4 H32" />
      </g>
    </FactionIconSvg>
  );
}
