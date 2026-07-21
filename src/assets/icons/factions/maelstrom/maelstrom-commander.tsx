import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — maelstrom-commander (maelstrom) */
export function Icon_MaelstromCommander() {
  return (
    <FactionIconSvg data-unit="maelstrom-commander" data-faction="maelstrom">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M8 12 L22 6 L40 14 L36 40 L14 42 L6 28 Z" />
      </g>
      <g className="ficon__glyph">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 16 A8 8 0 1 1 23.9 16 M18 18 L30 30 M30 18 L18 30" />
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 42.4 H32" />
      </g>
    </FactionIconSvg>
  );
}
