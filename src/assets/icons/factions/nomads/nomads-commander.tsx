import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — nomads-commander (nomads) */
export function Icon_NomadsCommander() {
  return (
    <FactionIconSvg data-unit="nomads-commander" data-faction="nomads">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M8 14 L24 6 L40 14 L38 40 L10 40 Z" />
      </g>
      <g className="ficon__glyph">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M12 30 L24 12 L36 30 Z M18 30 L24 20 L30 30" />
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.6 H32" />
      </g>
    </FactionIconSvg>
  );
}
