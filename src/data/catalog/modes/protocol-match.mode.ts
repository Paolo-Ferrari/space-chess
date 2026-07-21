import type { MatchModeDefinition } from "./types";

/** Default live path: Army Builder → Protocol Match. */
export const MODE_PROTOCOL_MATCH: MatchModeDefinition = {
  id: "mode-protocol-match",
  label: "Protocol Match",
  blurb: "Пошаговый бой на Night Grid. Победа — уничтожение командира.",
  mapId: "map-classic-8x8",
  victoryRuleId: "victory-commander-kill",
  opponent: "ai",
  features: {
    armyBuilder: true,
    edgerunners: true,
    legendaryModules: true,
    abilities: true,
  },
  atmosphere: "classic",
  enabled: true,
};

export const MODE_HOTSEAT: MatchModeDefinition = {
  id: "mode-hotseat",
  label: "Hotseat",
  blurb: "Два игрока за одним устройством.",
  mapId: "map-classic-8x8",
  victoryRuleId: "victory-commander-kill",
  opponent: "hotseat",
  features: {
    armyBuilder: true,
    edgerunners: true,
    legendaryModules: true,
    abilities: true,
  },
  atmosphere: "classic",
  enabled: true,
};
