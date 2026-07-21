import type { RipperdocDefinition } from "../../../domain/ripperdoc/types";

export const NOMADS_RIPPERDOC: RipperdocDefinition = {
  id: "ripperdoc-nomads",
  unitDefinitionId: "nomads-ripperdoc",
  factionId: "faction-nomads",
  name: "Nomad Road Doc",
  description: "Дорожный риппер. Починка людей и машин.",
  supportRadius: 1,
  styleTags: ["mobility","vehicle","adapt"],
  actions: [
    {
      kind: "healing",
      abilityId: "ability-heal",
      label: "Trail Medicine",
      description: "Восстанавливает HP союзника.",
    },
    {
      kind: "buff",
      abilityId: "ability-armor-boost",
      label: "Dust Armor",
      description: "Временно усиливает защиту союзника.",
    },
    {
      kind: "repair",
      abilityId: null,
      label: "Engine Patch",
      description: "Резерв под ремонт.",
    },
    {
      kind: "remove_effect",
      abilityId: null,
      label: "Sand Flush",
      description: "Резерв под снятие эффектов.",
    },
    {
      kind: "modification",
      abilityId: null,
      label: "Throttle Boost",
      description: "Резерв под модификации.",
    },
  ],
};
