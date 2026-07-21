import type { RipperdocDefinition } from "../../../domain/ripperdoc/types";

export const VOODOO_BOYS_RIPPERDOC: RipperdocDefinition = {
  id: "ripperdoc-voodoo-boys",
  unitDefinitionId: "voodoo-boys-ripperdoc",
  factionId: "faction-voodoo-boys",
  name: "Voodoo Boys Net-Ripper",
  description: "Риппер-нетраннер. Стабилизация и сетевые протоколы.",
  supportRadius: 2,
  styleTags: ["netrunner","control","digital"],
  actions: [
    {
      kind: "healing",
      abilityId: "ability-heal",
      label: "Bio-Buffer",
      description: "Восстанавливает HP союзника.",
    },
    {
      kind: "buff",
      abilityId: "ability-armor-boost",
      label: "Firewall Veil",
      description: "Временно усиливает защиту союзника.",
    },
    {
      kind: "repair",
      abilityId: null,
      label: "Deck Recal",
      description: "Резерв под ремонт.",
    },
    {
      kind: "remove_effect",
      abilityId: null,
      label: "Purge Daemon",
      description: "Резерв под снятие эффектов.",
    },
    {
      kind: "modification",
      abilityId: null,
      label: "Latency Spike",
      description: "Резерв под модификации.",
    },
  ],
};
