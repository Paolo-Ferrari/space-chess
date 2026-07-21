import type { RipperdocDefinition } from "../../../domain/ripperdoc/types";

export const TYGER_CLAWS_RIPPERDOC: RipperdocDefinition = {
  id: "ripperdoc-tyger-claws",
  unitDefinitionId: "tyger-claws-ripperdoc",
  factionId: "faction-tyger-claws",
  name: "Tyger Claws Street Doc",
  description: "Уличный риппер клана. Быстрая стабилизация.",
  supportRadius: 1,
  styleTags: ["speed","stealth","melee"],
  actions: [
    {
      kind: "healing",
      abilityId: "ability-heal",
      label: "Quick Seal",
      description: "Восстанавливает HP союзника.",
    },
    {
      kind: "buff",
      abilityId: "ability-armor-boost",
      label: "Reflex Lace",
      description: "Временно усиливает защиту союзника.",
    },
    {
      kind: "repair",
      abilityId: null,
      label: "Blade Realign",
      description: "Резерв под ремонт.",
    },
    {
      kind: "remove_effect",
      abilityId: null,
      label: "Toxin Sweep",
      description: "Резерв под снятие эффектов.",
    },
    {
      kind: "modification",
      abilityId: null,
      label: "Adrenal Spike",
      description: "Резерв под модификации.",
    },
  ],
};
