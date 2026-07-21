import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — militech-ripperdoc (militech) */
export function Icon_MilitechRipperdoc() {
  return (
    <FactionIconSvg data-unit="militech-ripperdoc" data-faction="militech">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M8 10 H40 V38 H8 Z M8 16 H40 M8 32 H40" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(-1.20 0.60)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M18 14 H28 V22 L34 30 V36 H28 L24 30 L20 36 H14 V30 L20 22 Z" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.6 H32" />
      </g>
    </FactionIconSvg>
  );
}
