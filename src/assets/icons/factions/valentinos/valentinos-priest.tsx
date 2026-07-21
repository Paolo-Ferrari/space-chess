import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — valentinos-priest (valentinos) */
export function Icon_ValentinosPriest() {
  return (
    <FactionIconSvg data-unit="valentinos-priest" data-faction="valentinos">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 6 L40 18 L34 40 L14 40 L8 18 Z" />
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
