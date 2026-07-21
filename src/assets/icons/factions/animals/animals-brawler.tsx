import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — animals-brawler (animals) */
export function Icon_AnimalsBrawler() {
  return (
    <FactionIconSvg data-unit="animals-brawler" data-faction="animals">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M10 12 H38 V36 H10 Z M14 12 V36 M34 12 V36" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(-1.20 -2.40)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 14 A6 6 0 1 1 23.9 14 M16 36 H32 L28 24 H20 Z" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.6 H32" />
      </g>
    </FactionIconSvg>
  );
}
