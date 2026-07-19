import { getPieceGlyph } from "../../../data/catalog/pieceGlyphs.catalog";

import "./NeonPortrait.css";

interface NeonPortraitProps {
  portraitId: string;
  label: string;
  /** When set, shows the unit’s chess / Arabic glyph. */
  unitDefinitionId?: string;
  /** Explicit glyph override. */
  glyph?: string;
  size?: "sm" | "md" | "lg";
  accent?: "cyan" | "magenta";
}

/** Neon piece mark — chess / Arabic / geometric glyph. */
function NeonPortrait({
  portraitId,
  label,
  unitDefinitionId,
  glyph,
  size = "md",
  accent = "cyan",
}: NeonPortraitProps) {
  const shown =
    glyph ??
    (unitDefinitionId ? getPieceGlyph(unitDefinitionId) : null) ??
    label.trim().slice(0, 1).toUpperCase() ??
    "?";

  return (
    <div
      className={`neon-portrait neon-portrait-${size} neon-portrait-${accent}`}
      data-portrait={portraitId}
      aria-hidden="true"
    >
      <span className="neon-portrait-grid" />
      <span className="neon-portrait-glyph">{shown}</span>
    </div>
  );
}

export default NeonPortrait;
