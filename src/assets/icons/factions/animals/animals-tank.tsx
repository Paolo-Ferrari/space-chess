import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — animals-tank (animals) */
export function Icon_AnimalsTank() {
  return (
    <FactionIconSvg data-unit="animals-tank" data-faction="animals">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M10 12 H38 V36 H10 Z M14 12 V36 M34 12 V36" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(-0.60 -1.20)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 28 V18 C16 14 20 12 24 12 C28 12 32 14 32 18 V28 M14 28 H34 M20 20 H28" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 40.8 H32" />
      </g>
    </FactionIconSvg>
  );
}
