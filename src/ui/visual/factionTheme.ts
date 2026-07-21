/**
 * Faction visual theme — colors & mood for UI chrome.
 * Content ids stay in catalog; visuals resolve here.
 */

export interface FactionVisual {
  id: string;
  accent: string;
  accentSoft: string;
  glow: string;
  styleClass: string;
  label: string;
}

const DEFAULT: FactionVisual = {
  id: "default",
  accent: "#00f0ff",
  accentSoft: "rgba(0, 240, 255, 0.18)",
  glow: "rgba(0, 240, 255, 0.35)",
  styleClass: "faction-default",
  label: "Neutral",
};

const FACTION_VISUALS: Record<string, FactionVisual> = {
  "faction-arasaka": {
    id: "faction-arasaka",
    accent: "#fcee0a",
    accentSoft: "rgba(252, 238, 10, 0.16)",
    glow: "rgba(252, 238, 10, 0.4)",
    styleClass: "faction-arasaka",
    label: "Corporate",
  },
  "faction-militech": {
    id: "faction-militech",
    accent: "#6b8cff",
    accentSoft: "rgba(107, 140, 255, 0.18)",
    glow: "rgba(107, 140, 255, 0.4)",
    styleClass: "faction-militech",
    label: "Military",
  },
  "faction-maelstrom": {
    id: "faction-maelstrom",
    accent: "#ff2a6d",
    accentSoft: "rgba(255, 42, 109, 0.2)",
    glow: "rgba(255, 42, 109, 0.45)",
    styleClass: "faction-maelstrom",
    label: "Chrome Chaos",
  },
  "faction-voodoo-boys": {
    id: "faction-voodoo-boys",
    accent: "#b44dff",
    accentSoft: "rgba(180, 77, 255, 0.2)",
    glow: "rgba(180, 77, 255, 0.45)",
    styleClass: "faction-voodoo-boys",
    label: "Net Magic",
  },
  "faction-nomads": {
    id: "faction-nomads",
    accent: "#e8a54b",
    accentSoft: "rgba(232, 165, 75, 0.18)",
    glow: "rgba(232, 165, 75, 0.4)",
    styleClass: "faction-nomads",
    label: "Dust Tech",
  },
  "faction-tyger-claws": {
    id: "faction-tyger-claws",
    accent: "#ff4d6a",
    accentSoft: "rgba(255, 77, 106, 0.18)",
    glow: "rgba(255, 77, 106, 0.4)",
    styleClass: "faction-tyger-claws",
    label: "Neon Blade",
  },
  "faction-valentinos": {
    id: "faction-valentinos",
    accent: "#ff6b35",
    accentSoft: "rgba(255, 107, 53, 0.18)",
    glow: "rgba(255, 107, 53, 0.4)",
    styleClass: "faction-valentinos",
    label: "Street Blood",
  },
  "faction-ncpd": {
    id: "faction-ncpd",
    accent: "#4db8ff",
    accentSoft: "rgba(77, 184, 255, 0.18)",
    glow: "rgba(77, 184, 255, 0.4)",
    styleClass: "faction-ncpd",
    label: "Lawline",
  },
  "faction-animals": {
    id: "faction-animals",
    accent: "#c4ff4d",
    accentSoft: "rgba(196, 255, 77, 0.16)",
    glow: "rgba(196, 255, 77, 0.35)",
    styleClass: "faction-animals",
    label: "Brute",
  },
  "faction-6th-street": {
    id: "faction-6th-street",
    accent: "#9aa4b2",
    accentSoft: "rgba(154, 164, 178, 0.2)",
    glow: "rgba(154, 164, 178, 0.35)",
    styleClass: "faction-6th-street",
    label: "Militia",
  },
  "pool-edgerunners": {
    id: "pool-edgerunners",
    accent: "#00f0ff",
    accentSoft: "rgba(0, 240, 255, 0.16)",
    glow: "rgba(0, 240, 255, 0.4)",
    styleClass: "faction-edgerunner",
    label: "Indie",
  },
};

export function getFactionVisual(factionId: string | undefined): FactionVisual {
  if (!factionId) {
    return DEFAULT;
  }
  return FACTION_VISUALS[factionId] ?? DEFAULT;
}
