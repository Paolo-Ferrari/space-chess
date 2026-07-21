import type { RipperdocDefinition } from "../../../domain/ripperdoc/types";

/**
 * Arasaka Ripperdoc — first full implementation.
 * Future factions: new file + registry append only.
 */
export const ARASAKA_RIPPERDOC: RipperdocDefinition = {
  id: "ripperdoc-arasaka",
  unitDefinitionId: "arasaka-ripperdoc",
  factionId: "faction-arasaka",
  name: "Arasaka Clinic Ripper",
  description:
    "Элитный корпоративный риппердок. Стабилизирует оперативников клиники Arasaka: точечное лечение и протоколы брони. Ремонт техники и снятие дебаффов — у других школ.",
  supportRadius: 1,
  styleTags: ["elite", "clinic", "defense"],
  actions: [
    {
      kind: "healing",
      abilityId: "ability-heal",
      label: "Clinic Stabilizers",
      description: "Восстанавливает HP союзника в радиусе поддержки.",
    },
    {
      kind: "buff",
      abilityId: "ability-armor-boost",
      label: "Armor Protocol",
      description: "Временно усиливает защиту союзника.",
    },
    {
      kind: "repair",
      abilityId: null,
      label: "Chassis Repair",
      description: "Резерв под ремонт техники (Militech-направление).",
    },
    {
      kind: "remove_effect",
      abilityId: null,
      label: "Cleanse Protocol",
      description: "Резерв под снятие негативных эффектов.",
    },
    {
      kind: "modification",
      abilityId: null,
      label: "Field Tuning",
      description: "Резерв под временные модификации характеристик.",
    },
  ],
};
