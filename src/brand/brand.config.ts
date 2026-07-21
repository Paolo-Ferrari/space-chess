/**
 * Single source of truth for CyberChess: Overclock Protocol brand & product naming.
 * UI must import from here — do not hardcode game titles elsewhere.
 */

export const BRAND = {
  /** Full product title */
  fullName: "CyberChess: Overclock Protocol",
  /** Stacked display lines for heroes */
  fullNameLines: ["CyberChess:", "Overclock Protocol"] as const,
  /** Short product name / wordmark */
  shortName: "Overclock",
  /** Stylized logo wordmark (OVER emphasized) */
  wordmark: "OVERclock",
  /** Document / tab title */
  documentTitle: "CyberChess: Overclock Protocol",
  /** Tagline */
  tagline: "Киберпанк-шахматы. Армии. Импланты. Перегрев.",
  /** English tagline for boot screens */
  taglineEn: "Tactical chess. Corporate war. Neural overload.",
  /** Style pitch */
  style: "Cyberpunk + Tactical Chess + Futuristic Military Interface",
  /** Version label for boot */
  buildLabel: "PROTOCOL BUILD",
} as const;

/** In-game terminology (localization-ready keys). */
export const BRAND_TERMS = {
  match: "Protocol Match",
  matchRu: "Протокол-матч",
  matchHistoryRu: "История протоколов",
  army: "Combat Network",
  armyRu: "Боевая сеть",
  armyRuAccusative: "боевую сеть",
  armiesRu: "Боевые сети",
  armyCreateRu: "Создать боевую сеть",
  armyReadyRu: "Боевая сеть готова",
  commander: "Neural Commander",
  commanderRu: "Нейро-командир",
  implants: "Cyber Modules",
  implantsRu: "Кибер-модули",
  edgerunners: "Independent Operators",
  edgerunnersRu: "Независимые операторы",
  ripperdoc: "Chrome Clinic",
  ripperdocRu: "Хром-клиника",
} as const;

/** System / HUD status strings for branded feedback. */
export const BRAND_STATUS = {
  systemReady: "SYSTEM READY",
  overclockEnabled: "OVERCLOCK ENABLED",
  neuralLinkActive: "NEURAL LINK ACTIVE",
  coreTempCritical: "CORE TEMPERATURE CRITICAL",
  linkEstablished: "NEURAL LINK ESTABLISHED",
  bootComplete: "BOOT SEQUENCE COMPLETE",
  combatOnline: "COMBAT NETWORK ONLINE",
} as const;

export type BrandLogoVariant = "full" | "mark" | "mono";
export type BrandLogoSize = "sm" | "md" | "lg" | "hero";

export function applyDocumentBrandTitle(suffix?: string): void {
  if (typeof document === "undefined") {
    return;
  }
  document.title = suffix
    ? `${BRAND.shortName} · ${suffix}`
    : BRAND.documentTitle;
}
