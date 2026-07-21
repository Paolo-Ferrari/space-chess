import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — maelstrom-legendary (maelstrom) */
export function Icon_MaelstromLegendary() {
  return (
    <FactionIconSvg data-unit="maelstrom-legendary" data-faction="maelstrom">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M8 12 L22 6 L40 14 L36 40 L14 42 L6 28 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(-0.60 0.60)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 12 L34 22 V32 L24 38 L14 32 V22 Z M24 18 V32 M18 24 H30" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 42.0 H32" />
      </g>
    </FactionIconSvg>
  );
}
