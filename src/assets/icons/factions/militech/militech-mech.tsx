import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — militech-mech (militech) */
export function Icon_MilitechMech() {
  return (
    <FactionIconSvg data-unit="militech-mech" data-faction="militech">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M8 10 H40 V38 H8 Z M8 16 H40 M8 32 H40" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(1.20 0.00)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 28 V18 C16 14 20 12 24 12 C28 12 32 14 32 18 V28 M14 28 H34 M20 20 H28" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 42.4 H32" />
      </g>
    </FactionIconSvg>
  );
}
