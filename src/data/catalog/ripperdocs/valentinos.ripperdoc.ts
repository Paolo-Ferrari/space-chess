import type { RipperdocDefinition } from "../../../domain/ripperdoc/types";

export const VALENTINOS_RIPPERDOC: RipperdocDefinition = {
  id: "ripperdoc-valentinos",
  unitDefinitionId: "valentinos-ripperdoc",
  factionId: "faction-valentinos",
  name: "Valentinos Family Doc",
  description: "Семейный риппер. Лечение и броня для своих.",
  supportRadius: 2,
  styleTags: ["team","support","pride"],
  actions: [
    {
      kind: "healing",
      abilityId: "ability-heal",
      label: "Family Care",
      description: "Восстанавливает HP союзника.",
    },
    {
      kind: "buff",
      abilityId: "ability-armor-boost",
      label: "Brotherhood Guard",
      description: "Временно усиливает защиту союзника.",
    },
    {
      kind: "repair",
      abilityId: null,
      label: "Bike Fix",
      description: "Резерв под ремонт.",
    },
    {
      kind: "remove_effect",
      abilityId: null,
      label: "Blessing Cleanse",
      description: "Резерв под снятие эффектов.",
    },
    {
      kind: "modification",
      abilityId: null,
      label: "Pride Mark",
      description: "Резерв под модификации.",
    },
  ],
};
