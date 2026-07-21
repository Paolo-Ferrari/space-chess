import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — edge-netrunner-ghost (edgerunners) */
export function Icon_EdgeNetrunnerGhost() {
  return (
    <FactionIconSvg data-unit="edge-netrunner-ghost" data-faction="edgerunners">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 4 L30 18 L44 20 L34 30 L36 44 L24 36 L12 44 L14 30 L4 20 L18 18 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(0.00 -1.20)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 16 A6 6 0 1 1 23.9 16 M18 24 H30 V32 H18 Z M14 16 L10 12 M34 16 L38 12" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 42.4 H32" />
      </g>
    </FactionIconSvg>
  );
}
