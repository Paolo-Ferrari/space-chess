import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — tyger-claws-assassin (tygerclaws) */
export function Icon_TygerClawsAssassin() {
  return (
    <FactionIconSvg data-unit="tyger-claws-assassin" data-faction="tygerclaws">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M12 6 L36 10 L40 24 L34 42 L10 38 L6 20 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(0.60 0.60)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M14 34 L32 12 M12 36 L16 32 M28 14 L34 10 M18 30 H24" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 42.0 H32" />
      </g>
    </FactionIconSvg>
  );
}
