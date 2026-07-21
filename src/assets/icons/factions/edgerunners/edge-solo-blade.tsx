import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — edge-solo-blade (edgerunners) */
export function Icon_EdgeSoloBlade() {
  return (
    <FactionIconSvg data-unit="edge-solo-blade" data-faction="edgerunners">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 4 L30 18 L44 20 L34 30 L36 44 L24 36 L12 44 L14 30 L4 20 L18 18 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(1.20 -3.00)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M14 34 L32 12 M12 36 L16 32 M28 14 L34 10 M18 30 H24" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 40.8 H32" />
      </g>
    </FactionIconSvg>
  );
}
