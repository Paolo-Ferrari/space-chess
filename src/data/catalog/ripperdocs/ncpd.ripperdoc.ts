import type { RipperdocDefinition } from "../../../domain/ripperdoc/types";

export const NCPD_RIPPERDOC: RipperdocDefinition = {
  id: "ripperdoc-ncpd",
  unitDefinitionId: "ncpd-ripperdoc",
  factionId: "faction-ncpd",
  name: "NCPD Trauma Unit",
  description: "Полевой trauma unit. Лечение и броня щитов.",
  supportRadius: 1,
  styleTags: ["order","control","shield"],
  actions: [
    {
      kind: "healing",
      abilityId: "ability-heal",
      label: "Trauma Protocol",
      description: "Восстанавливает HP союзника.",
    },
    {
      kind: "buff",
      abilityId: "ability-armor-boost",
      label: "Riot Plate",
      description: "Временно усиливает защиту союзника.",
    },
    {
      kind: "repair",
      abilityId: null,
      label: "Gear Service",
      description: "Резерв под ремонт.",
    },
    {
      kind: "remove_effect",
      abilityId: null,
      label: "Decontam",
      description: "Резерв под снятие эффектов.",
    },
    {
      kind: "modification",
      abilityId: null,
      label: "Suppressor Tune",
      description: "Резерв под модификации.",
    },
  ],
};
