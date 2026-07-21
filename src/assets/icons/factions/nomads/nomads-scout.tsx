import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — nomads-scout (nomads) */
export function Icon_NomadsScout() {
  return (
    <FactionIconSvg data-unit="nomads-scout" data-faction="nomads">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M8 14 L24 6 L40 14 L38 40 L10 40 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(0.60 -1.80)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M12 20 H36 L32 28 H16 Z M18 24 H30 M24 16 V20" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.6 H32" />
      </g>
    </FactionIconSvg>
  );
}
