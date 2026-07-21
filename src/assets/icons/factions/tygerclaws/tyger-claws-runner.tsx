import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — tyger-claws-runner (tygerclaws) */
export function Icon_TygerClawsRunner() {
  return (
    <FactionIconSvg data-unit="tyger-claws-runner" data-faction="tygerclaws">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M12 6 L36 10 L40 24 L34 42 L10 38 L6 20 Z" />
      </g>
      <g className="ficon__glyph">
        <g transform="translate(0.60 -1.20)">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M24 14 A6 6 0 1 1 23.9 14 M16 36 H32 L28 24 H20 Z" />
      </g>
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 41.2 H32" />
      </g>
    </FactionIconSvg>
  );
}
