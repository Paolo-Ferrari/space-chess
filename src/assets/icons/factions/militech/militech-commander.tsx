import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — militech-commander (militech) */
export function Icon_MilitechCommander() {
  return (
    <FactionIconSvg data-unit="militech-commander" data-faction="militech">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M8 10 H40 V38 H8 Z M8 16 H40 M8 32 H40" />
      </g>
      <g className="ficon__glyph">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 16 H32 V32 H16 Z M20 16 V32 M28 16 V32" />
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.6 H32" />
      </g>
    </FactionIconSvg>
  );
}
