import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — maelstrom-berserker (maelstrom) */
export function Icon_MaelstromBerserker() {
  return (
    <FactionIconSvg data-unit="maelstrom-berserker" data-faction="maelstrom">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M8 12 L22 6 L40 14 L36 40 L14 42 L6 28 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(-1.20 -3.60)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 14 A6 6 0 1 1 23.9 14 M16 36 H32 L28 24 H20 Z" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.6 H32" />
      </g>
    </FactionIconSvg>
  );
}
