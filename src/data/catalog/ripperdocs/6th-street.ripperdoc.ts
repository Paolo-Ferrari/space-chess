import type { RipperdocDefinition } from "../../../domain/ripperdoc/types";

export const SIXTH_STREET_RIPPERDOC: RipperdocDefinition = {
  id: "ripperdoc-6th-street",
  unitDefinitionId: "6th-street-ripperdoc",
  factionId: "faction-6th-street",
  name: "6th Street Combat Medic",
  description: "Боевой медик. Лечение и броня на позициях.",
  supportRadius: 1,
  styleTags: ["firepower","discipline","hold"],
  actions: [
    {
      kind: "healing",
      abilityId: "ability-heal",
      label: "Field Dressing",
      description: "Восстанавливает HP союзника.",
    },
    {
      kind: "buff",
      abilityId: "ability-armor-boost",
      label: "Sandbag Cover",
      description: "Временно усиливает защиту союзника.",
    },
    {
      kind: "repair",
      abilityId: null,
      label: "Weapon Clean",
      description: "Резерв под ремонт.",
    },
    {
      kind: "remove_effect",
      abilityId: null,
      label: "Stim Flush",
      description: "Резерв под снятие эффектов.",
    },
    {
      kind: "modification",
      abilityId: null,
      label: "Zeroing",
      description: "Резерв под модификации.",
    },
  ],
};
