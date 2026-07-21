import type { RipperdocDefinition } from "../../../domain/ripperdoc/types";

export const MAELSTROM_RIPPERDOC: RipperdocDefinition = {
  id: "ripperdoc-maelstrom",
  unitDefinitionId: "maelstrom-ripperdoc",
  factionId: "faction-maelstrom",
  name: "Maelstrom Chop-Doc",
  description: "Уличный chop-doc. Грубое лечение и хром-усиления.",
  supportRadius: 1,
  styleTags: ["chaos","chrome","risk"],
  actions: [
    {
      kind: "healing",
      abilityId: "ability-heal",
      label: "Jury-Rig Patch",
      description: "Восстанавливает HP союзника.",
    },
    {
      kind: "buff",
      abilityId: "ability-armor-boost",
      label: "Chrome Overclock",
      description: "Временно усиливает защиту союзника.",
    },
    {
      kind: "repair",
      abilityId: null,
      label: "Sparks & Tape",
      description: "Резерв под ремонт.",
    },
    {
      kind: "remove_effect",
      abilityId: null,
      label: "Shock Flush",
      description: "Резерв под снятие эффектов.",
    },
    {
      kind: "modification",
      abilityId: null,
      label: "Unsafe Tuning",
      description: "Резерв под модификации.",
    },
  ],
};
