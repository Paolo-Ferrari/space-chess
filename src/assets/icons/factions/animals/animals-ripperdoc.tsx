import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — animals-ripperdoc (animals) */
export function Icon_AnimalsRipperdoc() {
  return (
    <FactionIconSvg data-unit="animals-ripperdoc" data-faction="animals">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M10 12 H38 V36 H10 Z M14 12 V36 M34 12 V36" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(0.60 -3.00)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M18 14 H28 V22 L34 30 V36 H28 L24 30 L20 36 H14 V30 L20 22 Z" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.2 H32" />
      </g>
    </FactionIconSvg>
  );
}
