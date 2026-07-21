import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — valentinos-commander (valentinos) */
export function Icon_ValentinosCommander() {
  return (
    <FactionIconSvg data-unit="valentinos-commander" data-faction="valentinos">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 6 L40 18 L34 40 L14 40 L8 18 Z" />
      </g>
      <g className="ficon__glyph">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 14 L32 22 L24 36 L16 22 Z" />
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 42.4 H32" />
      </g>
    </FactionIconSvg>
  );
}
