import type {
  FactionDefinition,
  UnitCatalogEntry,
} from "../../../domain/armyBuilder/types";
import { unitImagePath } from "../../assets/unitArt";

/**
 * Arasaka — эталонная фракция каталога.
 * Полные записи game DB: статы + art path + rarity.
 * Замена арта: заменить PNG в public/assets/units/ без правок логики.
 */
export const ARASAKA_FACTION: FactionDefinition = {
  id: "faction-arasaka",
  name: "Arasaka",
  tag: "ARA",
  description:
    "Элитная корпорация Night City. Меньше бойцов на поле — каждый стоит дорого и опасен. Дисциплина, кибернетика, технологическое превосходство.",
};

export const ARASAKA_UNITS: UnitCatalogEntry[] = [
  {
    id: "arasaka-commander",
    factionId: ARASAKA_FACTION.id,
    name: "Arasaka Commander",
    type: "commander",
    cost: 30,
    stats: { hp: 14, attack: 5, defense: 5, movement: 1, range: 1 },
    description:
      "Командир корпоративного отряда. Центр дисциплины и цель победы. Единственный носитель имплантов.",
    abilities: [],
    imagePath: unitImagePath("arasaka-commander"),
    rarity: "epic",
    isLegendary: false,
  },
  {
    id: "arasaka-ripperdoc",
    factionId: ARASAKA_FACTION.id,
    name: "Arasaka Clinic Ripper",
    type: "ripperdoc",
    cost: 20,
    stats: { hp: 9, attack: 2, defense: 4, movement: 1, range: 1 },
    description:
      "Элитный риппердок корпорации. Не штурмовик — полевой клиницист: лечение и протоколы брони в радиусе поддержки. Профиль: Ripperdoc System → ripperdoc-arasaka.",
    abilities: ["ability-heal", "ability-armor-boost"],
    imagePath: unitImagePath("arasaka-ripperdoc"),
    rarity: "uncommon",
    isLegendary: false,
  },
  {
    id: "arasaka-soldier",
    factionId: ARASAKA_FACTION.id,
    name: "Arasaka Trooper",
    type: "regular",
    cost: 12,
    stats: { hp: 8, attack: 4, defense: 3, movement: 1, range: 1 },
    description:
      "Базовый солдат корпорации. Дороже уличной пехоты — лучше экипирован и обучен.",
    abilities: [],
    imagePath: unitImagePath("arasaka-soldier"),
    rarity: "common",
    isLegendary: false,
  },
  {
    id: "arasaka-elite",
    factionId: ARASAKA_FACTION.id,
    name: "Arasaka Elite Trooper",
    type: "regular",
    cost: 18,
    stats: { hp: 10, attack: 5, defense: 4, movement: 1, range: 1 },
    description:
      "Элитный солдат. Усиленная броня и огневая подготовка. Ядро «дорогой» линии Arasaka.",
    abilities: [],
    imagePath: unitImagePath("arasaka-elite"),
    rarity: "uncommon",
    isLegendary: false,
  },
  {
    id: "arasaka-cyber-ninja",
    factionId: ARASAKA_FACTION.id,
    name: "Arasaka Cyber Ninja",
    type: "regular",
    cost: 20,
    stats: { hp: 7, attack: 6, defense: 2, movement: 2, range: 1 },
    description:
      "Киберниндзя: скорость и ударная точность. Меньше живучести — выше угроза на клетку.",
    abilities: ["ability-slow"],
    imagePath: unitImagePath("arasaka-cyber-ninja"),
    rarity: "rare",
    isLegendary: false,
  },
  {
    id: "arasaka-heavy",
    factionId: ARASAKA_FACTION.id,
    name: "Arasaka Heavy Assault",
    type: "regular",
    cost: 24,
    stats: { hp: 14, attack: 6, defense: 5, movement: 1, range: 1 },
    description:
      "Тяжёлый боевой юнит. Медленный, дорогой, держит фронт и продавливает позиции.",
    abilities: [],
    imagePath: unitImagePath("arasaka-heavy"),
    rarity: "rare",
    isLegendary: false,
  },
  {
    id: "arasaka-recon",
    factionId: ARASAKA_FACTION.id,
    name: "Arasaka Recon Operative",
    type: "regular",
    cost: 14,
    stats: { hp: 6, attack: 3, defense: 2, movement: 2, range: 2 },
    description:
      "Разведывательный оперативник. Дальность и мобильность для контроля зоны до удара элиты.",
    abilities: [],
    imagePath: unitImagePath("arasaka-recon"),
    rarity: "uncommon",
    isLegendary: false,
  },
  {
    id: "arasaka-adam-smasher",
    factionId: ARASAKA_FACTION.id,
    name: "Adam Smasher",
    type: "legendary",
    cost: 38,
    stats: { hp: 18, attack: 8, defense: 6, movement: 1, range: 1 },
    description:
      "Легендарный киборг-штурмовик Arasaka. Прототип класса «living weapon»: крайне дорог, крайне живуч, крайне опасен.",
    abilities: ["ability-power-strike"],
    imagePath: unitImagePath("arasaka-adam-smasher"),
    rarity: "legendary",
    isLegendary: true,
  },
];
