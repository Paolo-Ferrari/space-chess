import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — tyger-claws-legendary (tygerclaws) */
export function Icon_TygerClawsLegendary() {
  return (
    <FactionIconSvg data-unit="tyger-claws-legendary" data-faction="tygerclaws">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M12 6 L36 10 L40 24 L34 42 L10 38 L6 20 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(0.60 0.60)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 12 L34 22 V32 L24 38 L14 32 V22 Z M24 18 V32 M18 24 H30" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 42.0 H32" />
      </g>
    </FactionIconSvg>
  );
}
