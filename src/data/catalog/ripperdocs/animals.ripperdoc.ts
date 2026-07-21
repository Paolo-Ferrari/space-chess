import type { RipperdocDefinition } from "../../../domain/ripperdoc/types";

export const ANIMALS_RIPPERDOC: RipperdocDefinition = {
  id: "ripperdoc-animals",
  unitDefinitionId: "animals-ripperdoc",
  factionId: "faction-animals",
  name: "Animals Pit Doc",
  description: "Питомник-риппер. Грубое лечение мышцы.",
  supportRadius: 1,
  styleTags: ["brawn","endurance","melee"],
  actions: [
    {
      kind: "healing",
      abilityId: "ability-heal",
      label: "Meat Patch",
      description: "Восстанавливает HP союзника.",
    },
    {
      kind: "buff",
      abilityId: null,
      label: "Reserved Buff",
      description: "Резерв под усиление.",
    },
    {
      kind: "repair",
      abilityId: null,
      label: "Brace Tape",
      description: "Резерв под ремонт.",
    },
    {
      kind: "remove_effect",
      abilityId: null,
      label: "Sweat Out",
      description: "Резерв под снятие эффектов.",
    },
    {
      kind: "modification",
      abilityId: null,
      label: "Stim Shot",
      description: "Резерв под модификации.",
    },
  ],
};
