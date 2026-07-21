import type { RipperdocDefinition } from "../../../domain/ripperdoc/types";

export const MILITECH_RIPPERDOC: RipperdocDefinition = {
  id: "ripperdoc-militech",
  unitDefinitionId: "militech-ripperdoc",
  factionId: "faction-militech",
  name: "Militech Field Medic",
  description: "Военный медик/риппер. Стабилизация и бронепротоколы на фронте.",
  supportRadius: 1,
  styleTags: ["military","armor","field"],
  actions: [
    {
      kind: "healing",
      abilityId: "ability-heal",
      label: "Trauma Kit",
      description: "Восстанавливает HP союзника.",
    },
    {
      kind: "buff",
      abilityId: "ability-armor-boost",
      label: "Hardplate Protocol",
      description: "Временно усиливает защиту союзника.",
    },
    {
      kind: "repair",
      abilityId: null,
      label: "Chassis Weld",
      description: "Резерв под ремонт.",
    },
    {
      kind: "remove_effect",
      abilityId: null,
      label: "Clear Contaminants",
      description: "Резерв под снятие эффектов.",
    },
    {
      kind: "modification",
      abilityId: null,
      label: "Weapon Calibration",
      description: "Резерв под модификации.",
    },
  ],
};
