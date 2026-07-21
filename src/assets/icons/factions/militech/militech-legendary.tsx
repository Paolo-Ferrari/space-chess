import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — militech-legendary (militech) */
export function Icon_MilitechLegendary() {
  return (
    <FactionIconSvg data-unit="militech-legendary" data-faction="militech">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M8 10 H40 V38 H8 Z M8 16 H40 M8 32 H40" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(-0.60 0.00)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 12 L34 22 V32 L24 38 L14 32 V22 Z M24 18 V32 M18 24 H30" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 42.0 H32" />
      </g>
    </FactionIconSvg>
  );
}
