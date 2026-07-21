/**
 * Runtime match mode — links lobby label to map + victory + future rulesets.
 */
export interface MatchModeDefinition {
  id: string;
  label: string;
  blurb: string;
  /** MapDefinition.id */
  mapId: string;
  /** VictoryRuleDefinition.id */
  victoryRuleId: string;
  /** Opponent: ai | hotseat | online (online later). */
  opponent: "ai" | "hotseat" | "online" | "sandbox";
  /** Feature flags for gradual rollout. */
  features: {
    armyBuilder: boolean;
    edgerunners: boolean;
    legendaryModules: boolean;
    abilities: boolean;
  };
  atmosphere?: string;
  enabled: boolean;
}
