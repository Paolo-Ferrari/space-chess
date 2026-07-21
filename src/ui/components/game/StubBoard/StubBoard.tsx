import type { CSSProperties } from "react";

import { DEMO_BOARD_SIZE } from "../../../stubs/demoData";

import "./StubBoard.css";

interface StubBoardProps {
  selectedCell: string | null;
  onSelectCell: (id: string) => void;
}

const PIECE_CELLS: Record<string, { side: "ally" | "enemy"; glyph: string }> = {
  "1-1": { side: "ally", glyph: "▲" },
  "2-2": { side: "ally", glyph: "◆" },
  "0-3": { side: "ally", glyph: "●" },
  "6-5": { side: "enemy", glyph: "▼" },
  "5-6": { side: "enemy", glyph: "◇" },
  "7-4": { side: "enemy", glyph: "○" },
};

function StubBoard({ selectedCell, onSelectCell }: StubBoardProps) {
  const cells = Array.from({ length: DEMO_BOARD_SIZE * DEMO_BOARD_SIZE }, (_, index) => {
    const row = Math.floor(index / DEMO_BOARD_SIZE);
    const col = index % DEMO_BOARD_SIZE;
    return `${row}-${col}`;
  });

  return (
    <div
      className="stub-board"
      role="grid"
      aria-label="Игровое поле (заглушка)"
      style={{ "--board-size": DEMO_BOARD_SIZE } as CSSProperties}
    >
      {cells.map((id) => {
        const piece = PIECE_CELLS[id];
        const selected = selectedCell === id;
        return (
          <button
            key={id}
            type="button"
            role="gridcell"
            className={[
              "stub-board__cell",
              piece ? `stub-board__cell--${piece.side}` : "",
              selected ? "stub-board__cell--selected" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onSelectCell(id)}
          >
            {piece ? <span className="stub-board__piece">{piece.glyph}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

export default StubBoard;
