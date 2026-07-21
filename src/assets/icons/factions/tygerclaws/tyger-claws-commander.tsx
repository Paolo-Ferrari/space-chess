import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — tyger-claws-commander (tygerclaws) */
export function Icon_TygerClawsCommander() {
  return (
    <FactionIconSvg data-unit="tyger-claws-commander" data-faction="tygerclaws">
      <g className="ficon__frame">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M12 6 L36 10 L40 24 L34 42 L10 38 L6 20 Z" />
      </g>
      <g className="ficon__glyph">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M14 30 L24 12 L34 30 M18 30 L24 20 L30 30" />
      </g>
      <g className="ficon__accent">
        <path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="M16 40.8 H32" />
      </g>
    </FactionIconSvg>
  );
}
