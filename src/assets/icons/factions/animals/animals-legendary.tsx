import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — animals-legendary (animals) */
export function Icon_AnimalsLegendary() {
  return (
    <FactionIconSvg data-unit="animals-legendary" data-faction="animals">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M10 12 H38 V36 H10 Z M14 12 V36 M34 12 V36" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(1.20 0.60)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 12 L34 22 V32 L24 38 L14 32 V22 Z M24 18 V32 M18 24 H30" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.6 H32" />
      </g>
    </FactionIconSvg>
  );
}
