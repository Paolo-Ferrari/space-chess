import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — animals-commander (animals) */
export function Icon_AnimalsCommander() {
  return (
    <FactionIconSvg data-unit="animals-commander" data-faction="animals">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M10 12 H38 V36 H10 Z M14 12 V36 M34 12 V36" />
      </g>
      <g className="ficon__glyph">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 28 C16 18 32 18 32 28 M18 20 L14 14 M30 20 L34 14" />
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.6 H32" />
      </g>
    </FactionIconSvg>
  );
}
