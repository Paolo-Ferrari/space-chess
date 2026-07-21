import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const armyDir = path.join(root, "src/data/catalog/armyBuilder");
const cmdDir = path.join(root, "src/data/catalog/commanders");
const ripDir = path.join(root, "src/data/catalog/ripperdocs");

const factions = [
  {
    key: "militech",
    id: "faction-militech",
    name: "Militech",
    tag: "MIL",
    description:
      "Военная корпорация. Тяжёлое вооружение, броня и огневая мощь. Техника и танки на поле.",
    style: "heavy firepower / armor",
    commander: {
      name: "Militech Commander",
      cost: 28,
      stats: { hp: 15, attack: 5, defense: 6, movement: 1, range: 1 },
      desc: "Полевой командир Militech. Держит линию и координирует тяжёлые активы.",
    },
    ripper: {
      name: "Militech Field Medic",
      cost: 18,
      stats: { hp: 9, attack: 2, defense: 5, movement: 1, range: 1 },
      desc: "Военный медик/риппер. Стабилизация и бронепротоколы на фронте.",
      heal: true,
      buff: true,
      tags: ["military", "armor", "field"],
      radius: 1,
    },
    units: [
      {
        id: "trooper",
        name: "Militech Trooper",
        type: "regular",
        cost: 11,
        stats: { hp: 9, attack: 4, defense: 4, movement: 1, range: 1 },
        desc: "Пехота корпорации. Броня и дисциплина.",
        abilities: [],
      },
      {
        id: "gunner",
        name: "Militech Heavy Gunner",
        type: "regular",
        cost: 16,
        stats: { hp: 10, attack: 6, defense: 4, movement: 1, range: 2 },
        desc: "Тяжёлый стрелок. Дальность и урон.",
        abilities: [],
      },
      {
        id: "mech",
        name: "Militech Light Mech",
        type: "regular",
        cost: 22,
        stats: { hp: 16, attack: 5, defense: 6, movement: 1, range: 1 },
        desc: "Лёгкий мех. Танк линии.",
        abilities: [],
      },
      {
        id: "tank",
        name: "Militech Assault Tank",
        type: "special",
        cost: 26,
        stats: { hp: 18, attack: 7, defense: 7, movement: 1, range: 2 },
        desc: "Штурмовой танк. Максимальная огневая мощь.",
        abilities: [],
      },
      {
        id: "drone",
        name: "Militech Spotter Drone",
        type: "regular",
        cost: 12,
        stats: { hp: 5, attack: 2, defense: 2, movement: 2, range: 2 },
        desc: "Дрон-корректировщик. Мобильность и обзор.",
        abilities: [],
      },
      {
        id: "legendary",
        name: "Militech War Machine",
        type: "legendary",
        cost: 36,
        stats: { hp: 20, attack: 8, defense: 7, movement: 1, range: 2 },
        desc: "Легендарная боевая платформа Militech.",
        abilities: ["ability-power-strike"],
      },
    ],
    commanderSlots: 3,
    ripperActions: {
      heal: "Trauma Kit",
      buff: "Hardplate Protocol",
      repair: "Chassis Weld",
      remove: "Clear Contaminants",
      mod: "Weapon Calibration",
    },
  },
  {
    key: "maelstrom",
    id: "faction-maelstrom",
    name: "Maelstrom",
    tag: "MAE",
    description:
      "Кибернетическое безумие. Агрессия, риск и нестабильные усиления.",
    style: "chaos / risk",
    commander: {
      name: "Maelstrom Chrome Boss",
      cost: 28,
      stats: { hp: 13, attack: 7, defense: 3, movement: 2, range: 1 },
      desc: "Вожак Maelstrom. Высокая атака, низкая стабильность.",
    },
    ripper: {
      name: "Maelstrom Chop-Doc",
      cost: 17,
      stats: { hp: 8, attack: 3, defense: 2, movement: 2, range: 1 },
      desc: "Уличный chop-doc. Грубое лечение и хром-усиления.",
      heal: true,
      buff: true,
      tags: ["chaos", "chrome", "risk"],
      radius: 1,
    },
    units: [
      {
        id: "ganger",
        name: "Maelstrom Ganger",
        type: "regular",
        cost: 10,
        stats: { hp: 7, attack: 5, defense: 2, movement: 2, range: 1 },
        desc: "Агрессивный боец. Много урона, мало брони.",
        abilities: [],
      },
      {
        id: "berserker",
        name: "Maelstrom Berserker",
        type: "regular",
        cost: 15,
        stats: { hp: 9, attack: 7, defense: 2, movement: 2, range: 1 },
        desc: "Берсерк. Рискованный ближний урон.",
        abilities: ["ability-power-strike"],
      },
      {
        id: "chrome",
        name: "Maelstrom Chrome Junkie",
        type: "regular",
        cost: 13,
        stats: { hp: 8, attack: 6, defense: 1, movement: 2, range: 1 },
        desc: "Перекачанный хромом. Нестабилен, опасен.",
        abilities: [],
      },
      {
        id: "shotgun",
        name: "Maelstrom Shotgunner",
        type: "regular",
        cost: 14,
        stats: { hp: 8, attack: 6, defense: 2, movement: 1, range: 1 },
        desc: "Дробовик в упор. Жёсткий ближний огонь.",
        abilities: [],
      },
      {
        id: "glitch",
        name: "Maelstrom Glitch Runner",
        type: "special",
        cost: 18,
        stats: { hp: 6, attack: 4, defense: 2, movement: 2, range: 2 },
        desc: "Сбойные импланты. Контроль через Slow.",
        abilities: ["ability-slow"],
      },
      {
        id: "legendary",
        name: "Maelstrom Overclocked Horror",
        type: "legendary",
        cost: 34,
        stats: { hp: 16, attack: 9, defense: 3, movement: 2, range: 1 },
        desc: "Легенда банды. Максимальный риск и урон.",
        abilities: ["ability-power-strike"],
      },
    ],
    commanderSlots: 3,
    ripperActions: {
      heal: "Jury-Rig Patch",
      buff: "Chrome Overclock",
      repair: "Sparks & Tape",
      remove: "Shock Flush",
      mod: "Unsafe Tuning",
    },
  },
  {
    key: "tyger-claws",
    id: "faction-tyger-claws",
    name: "Tyger Claws",
    tag: "TYG",
    description:
      "Скорость, скрытность и ближний бой. Манёвры и быстрые удары.",
    style: "speed / melee",
    commander: {
      name: "Tyger Claws Oyabun",
      cost: 27,
      stats: { hp: 12, attack: 6, defense: 3, movement: 2, range: 1 },
      desc: "Оябун клана. Быстрый и точный.",
    },
    ripper: {
      name: "Tyger Claws Street Doc",
      cost: 17,
      stats: { hp: 7, attack: 2, defense: 3, movement: 2, range: 1 },
      desc: "Уличный риппер клана. Быстрая стабилизация.",
      heal: true,
      buff: true,
      tags: ["speed", "stealth", "melee"],
      radius: 1,
    },
    units: [
      {
        id: "blade",
        name: "Tyger Blade",
        type: "regular",
        cost: 11,
        stats: { hp: 7, attack: 5, defense: 2, movement: 2, range: 1 },
        desc: "Клинок. Быстрый ближний бой.",
        abilities: [],
      },
      {
        id: "assassin",
        name: "Tyger Assassin",
        type: "regular",
        cost: 16,
        stats: { hp: 6, attack: 7, defense: 2, movement: 2, range: 1 },
        desc: "Ассасин. Высокий урон с фланга.",
        abilities: ["ability-power-strike"],
      },
      {
        id: "runner",
        name: "Tyger Runner",
        type: "regular",
        cost: 12,
        stats: { hp: 6, attack: 3, defense: 2, movement: 3, range: 1 },
        desc: "Курьер-боец. Максимальная мобильность.",
        abilities: [],
      },
      {
        id: "monk",
        name: "Tyger Martial Monk",
        type: "regular",
        cost: 14,
        stats: { hp: 8, attack: 5, defense: 3, movement: 2, range: 1 },
        desc: "Монах ближнего боя. Баланс скорости и удара.",
        abilities: [],
      },
      {
        id: "smoke",
        name: "Tyger Smoke Dancer",
        type: "special",
        cost: 15,
        stats: { hp: 5, attack: 4, defense: 2, movement: 3, range: 1 },
        desc: "Дымовой манёвр. Замедляет преследователей.",
        abilities: ["ability-slow"],
      },
      {
        id: "legendary",
        name: "Tyger Phantom Blade",
        type: "legendary",
        cost: 33,
        stats: { hp: 11, attack: 9, defense: 3, movement: 3, range: 1 },
        desc: "Легендарный клинок клана. Скорость и смертельность.",
        abilities: ["ability-power-strike"],
      },
    ],
    commanderSlots: 3,
    ripperActions: {
      heal: "Quick Seal",
      buff: "Reflex Lace",
      repair: "Blade Realign",
      remove: "Toxin Sweep",
      mod: "Adrenal Spike",
    },
  },
  {
    key: "valentinos",
    id: "faction-valentinos",
    name: "Valentinos",
    tag: "VAL",
    description:
      "Командная игра и взаимная поддержка. Сильны рядом с союзниками.",
    style: "team support",
    commander: {
      name: "Valentinos Jefe",
      cost: 28,
      stats: { hp: 14, attack: 5, defense: 4, movement: 1, range: 1 },
      desc: "Хефе. Держит семью вместе на поле.",
    },
    ripper: {
      name: "Valentinos Family Doc",
      cost: 18,
      stats: { hp: 9, attack: 2, defense: 3, movement: 1, range: 1 },
      desc: "Семейный риппер. Лечение и броня для своих.",
      heal: true,
      buff: true,
      tags: ["team", "support", "pride"],
      radius: 2,
    },
    units: [
      {
        id: "soldier",
        name: "Valentinos Soldado",
        type: "regular",
        cost: 11,
        stats: { hp: 9, attack: 4, defense: 3, movement: 1, range: 1 },
        desc: "Сольдадо. Держит строй рядом с семьёй.",
        abilities: [],
      },
      {
        id: "guardian",
        name: "Valentinos Guardian",
        type: "regular",
        cost: 15,
        stats: { hp: 11, attack: 3, defense: 5, movement: 1, range: 1 },
        desc: "Страж. Защищает союзников рядом.",
        abilities: ["ability-armor-boost"],
      },
      {
        id: "gun",
        name: "Valentinos Gunner",
        type: "regular",
        cost: 13,
        stats: { hp: 8, attack: 5, defense: 3, movement: 1, range: 2 },
        desc: "Стрелок поддержки средней дистанции.",
        abilities: [],
      },
      {
        id: "brother",
        name: "Valentinos Brother-in-Arms",
        type: "regular",
        cost: 14,
        stats: { hp: 10, attack: 4, defense: 4, movement: 1, range: 1 },
        desc: "Боец линии. Живуч в группе.",
        abilities: [],
      },
      {
        id: "priest",
        name: "Valentinos Street Priest",
        type: "special",
        cost: 16,
        stats: { hp: 8, attack: 2, defense: 3, movement: 1, range: 1 },
        desc: "Поддержка морали. Лечит союзников.",
        abilities: ["ability-heal"],
      },
      {
        id: "legendary",
        name: "Valentinos Padre",
        type: "legendary",
        cost: 34,
        stats: { hp: 15, attack: 6, defense: 5, movement: 1, range: 1 },
        desc: "Легенда семьи. Символ командной силы.",
        abilities: ["ability-armor-boost", "ability-heal"],
      },
    ],
    commanderSlots: 3,
    ripperActions: {
      heal: "Family Care",
      buff: "Brotherhood Guard",
      repair: "Bike Fix",
      remove: "Blessing Cleanse",
      mod: "Pride Mark",
    },
  },
  {
    key: "voodoo-boys",
    id: "faction-voodoo-boys",
    name: "Voodoo Boys",
    tag: "VDB",
    description:
      "Нетраннеры и цифровой контроль. Хакинг, дебаффы, отключение ритма врага.",
    style: "netrunning / control",
    commander: {
      name: "Voodoo Boys Houngan",
      cost: 27,
      stats: { hp: 11, attack: 4, defense: 3, movement: 1, range: 2 },
      desc: "Хунган сети. Контроль с дистанции.",
    },
    ripper: {
      name: "Voodoo Boys Net-Ripper",
      cost: 18,
      stats: { hp: 7, attack: 2, defense: 3, movement: 1, range: 2 },
      desc: "Риппер-нетраннер. Стабилизация и сетевые протоколы.",
      heal: true,
      buff: true,
      tags: ["netrunner", "control", "digital"],
      radius: 2,
    },
    units: [
      {
        id: "netrunner",
        name: "Voodoo Netrunner",
        type: "regular",
        cost: 14,
        stats: { hp: 6, attack: 3, defense: 2, movement: 1, range: 2 },
        desc: "Нетраннер. Slow и контроль.",
        abilities: ["ability-slow"],
      },
      {
        id: "guard",
        name: "Voodoo Data Guard",
        type: "regular",
        cost: 12,
        stats: { hp: 8, attack: 3, defense: 4, movement: 1, range: 1 },
        desc: "Охрана узлов. Держит позицию.",
        abilities: [],
      },
      {
        id: "ghost",
        name: "Voodoo Ghost Proxy",
        type: "regular",
        cost: 15,
        stats: { hp: 5, attack: 4, defense: 2, movement: 2, range: 2 },
        desc: "Прокси-атака. Мобильный контроль.",
        abilities: ["ability-slow"],
      },
      {
        id: "ice",
        name: "Voodoo ICE Breaker",
        type: "special",
        cost: 17,
        stats: { hp: 7, attack: 5, defense: 2, movement: 1, range: 2 },
        desc: "Взлом защит. Power Strike по системам.",
        abilities: ["ability-power-strike"],
      },
      {
        id: "signal",
        name: "Voodoo Signal Jammer",
        type: "regular",
        cost: 13,
        stats: { hp: 6, attack: 2, defense: 3, movement: 1, range: 2 },
        desc: "Глушитель. Подавляет темп врага.",
        abilities: ["ability-slow"],
      },
      {
        id: "legendary",
        name: "Voodoo Boys Blackwall Adept",
        type: "legendary",
        cost: 35,
        stats: { hp: 12, attack: 5, defense: 4, movement: 1, range: 3 },
        desc: "Легенда сети. Дальний контроль.",
        abilities: ["ability-slow", "ability-power-strike"],
      },
    ],
    commanderSlots: 3,
    ripperActions: {
      heal: "Bio-Buffer",
      buff: "Firewall Veil",
      repair: "Deck Recal",
      remove: "Purge Daemon",
      mod: "Latency Spike",
    },
  },
  {
    key: "nomads",
    id: "faction-nomads",
    name: "Nomads",
    tag: "NOM",
    description:
      "Мобильность, техника и адаптация. Гибкая тактика и перемещение.",
    style: "mobility / vehicles",
    commander: {
      name: "Nomad Clan Leader",
      cost: 27,
      stats: { hp: 13, attack: 5, defense: 4, movement: 2, range: 1 },
      desc: "Лидер клана. Держит темп марша.",
    },
    ripper: {
      name: "Nomad Road Doc",
      cost: 17,
      stats: { hp: 8, attack: 2, defense: 3, movement: 2, range: 1 },
      desc: "Дорожный риппер. Починка людей и машин.",
      heal: true,
      buff: true,
      tags: ["mobility", "vehicle", "adapt"],
      radius: 1,
    },
    units: [
      {
        id: "scout",
        name: "Nomad Scout",
        type: "regular",
        cost: 11,
        stats: { hp: 7, attack: 3, defense: 2, movement: 3, range: 2 },
        desc: "Скаут. Обзор и манёвр.",
        abilities: [],
      },
      {
        id: "rider",
        name: "Nomad Rider",
        type: "regular",
        cost: 13,
        stats: { hp: 8, attack: 4, defense: 3, movement: 3, range: 1 },
        desc: "Наездник. Высокая мобильность.",
        abilities: [],
      },
      {
        id: "tech",
        name: "Nomad Techie",
        type: "regular",
        cost: 14,
        stats: { hp: 7, attack: 2, defense: 3, movement: 2, range: 1 },
        desc: "Техник. Поддержка и ремонт духа.",
        abilities: ["ability-heal"],
      },
      {
        id: "buggy",
        name: "Nomad Raid Buggy",
        type: "special",
        cost: 20,
        stats: { hp: 12, attack: 5, defense: 4, movement: 3, range: 1 },
        desc: "Рейдовый багги. Транспортный удар.",
        abilities: [],
      },
      {
        id: "sniper",
        name: "Nomad Longshot",
        type: "regular",
        cost: 15,
        stats: { hp: 6, attack: 5, defense: 2, movement: 2, range: 3 },
        desc: "Дальний выстрел с дистанции.",
        abilities: [],
      },
      {
        id: "legendary",
        name: "Nomad Panzer Convoy",
        type: "legendary",
        cost: 34,
        stats: { hp: 17, attack: 7, defense: 5, movement: 2, range: 2 },
        desc: "Легендарный конвой. Мощь и мобильность.",
        abilities: ["ability-power-strike"],
      },
    ],
    commanderSlots: 3,
    ripperActions: {
      heal: "Trail Medicine",
      buff: "Dust Armor",
      repair: "Engine Patch",
      remove: "Sand Flush",
      mod: "Throttle Boost",
    },
  },
  {
    key: "ncpd",
    id: "faction-ncpd",
    name: "NCPD / MaxTac",
    tag: "NCP",
    description:
      "Порядок и контроль поля. Защита, подавление и удержание зон.",
    style: "control / suppression",
    commander: {
      name: "MaxTac Commander",
      cost: 29,
      stats: { hp: 14, attack: 5, defense: 6, movement: 1, range: 1 },
      desc: "Командир MaxTac. Контроль периметра.",
    },
    ripper: {
      name: "NCPD Trauma Unit",
      cost: 18,
      stats: { hp: 9, attack: 2, defense: 5, movement: 1, range: 1 },
      desc: "Полевой trauma unit. Лечение и броня щитов.",
      heal: true,
      buff: true,
      tags: ["order", "control", "shield"],
      radius: 1,
    },
    units: [
      {
        id: "officer",
        name: "NCPD Officer",
        type: "regular",
        cost: 11,
        stats: { hp: 9, attack: 3, defense: 4, movement: 1, range: 1 },
        desc: "Офицер. Держит зону.",
        abilities: [],
      },
      {
        id: "riot",
        name: "NCPD Riot Shield",
        type: "regular",
        cost: 14,
        stats: { hp: 12, attack: 2, defense: 6, movement: 1, range: 1 },
        desc: "Щит. Подавление и блок.",
        abilities: ["ability-armor-boost"],
      },
      {
        id: "maxtac",
        name: "MaxTac Operative",
        type: "regular",
        cost: 18,
        stats: { hp: 11, attack: 6, defense: 5, movement: 1, range: 1 },
        desc: "Оперативник MaxTac. Элитное подавление.",
        abilities: ["ability-power-strike"],
      },
      {
        id: "sniper",
        name: "NCPD Marksman",
        type: "regular",
        cost: 15,
        stats: { hp: 7, attack: 5, defense: 3, movement: 1, range: 3 },
        desc: "Марксман. Контроль дальних клеток.",
        abilities: [],
      },
      {
        id: "drone",
        name: "NCPD Suppression Drone",
        type: "special",
        cost: 16,
        stats: { hp: 6, attack: 3, defense: 3, movement: 2, range: 2 },
        desc: "Дрон подавления. Slow по нарушителям.",
        abilities: ["ability-slow"],
      },
      {
        id: "legendary",
        name: "MaxTac Breach Team",
        type: "legendary",
        cost: 36,
        stats: { hp: 16, attack: 7, defense: 7, movement: 1, range: 1 },
        desc: "Легендарная штурмовая группа MaxTac.",
        abilities: ["ability-power-strike", "ability-armor-boost"],
      },
    ],
    commanderSlots: 3,
    ripperActions: {
      heal: "Trauma Protocol",
      buff: "Riot Plate",
      repair: "Gear Service",
      remove: "Decontam",
      mod: "Suppressor Tune",
    },
  },
  {
    key: "animals",
    id: "faction-animals",
    name: "Animals",
    tag: "ANM",
    description:
      "Физическая сила и устойчивость. Высокий HP, ближний бой, почти без технологий.",
    style: "brute strength",
    commander: {
      name: "Animals Alpha",
      cost: 28,
      stats: { hp: 18, attack: 6, defense: 4, movement: 1, range: 1 },
      desc: "Альфа. Живучий и тяжёлый в ближнем бою.",
    },
    ripper: {
      name: "Animals Pit Doc",
      cost: 16,
      stats: { hp: 10, attack: 3, defense: 3, movement: 1, range: 1 },
      desc: "Питомник-риппер. Грубое лечение мышцы.",
      heal: true,
      buff: false,
      tags: ["brawn", "endurance", "melee"],
      radius: 1,
    },
    units: [
      {
        id: "brawler",
        name: "Animals Brawler",
        type: "regular",
        cost: 11,
        stats: { hp: 12, attack: 5, defense: 3, movement: 1, range: 1 },
        desc: "Браулер. Много HP, простой удар.",
        abilities: [],
      },
      {
        id: "tank",
        name: "Animals Ironbody",
        type: "regular",
        cost: 15,
        stats: { hp: 16, attack: 4, defense: 5, movement: 1, range: 1 },
        desc: "Железная туша. Танк ближнего боя.",
        abilities: [],
      },
      {
        id: "slugger",
        name: "Animals Slugger",
        type: "regular",
        cost: 13,
        stats: { hp: 13, attack: 6, defense: 3, movement: 1, range: 1 },
        desc: "Силовой удар. Power Strike.",
        abilities: ["ability-power-strike"],
      },
      {
        id: "wrestler",
        name: "Animals Wrestler",
        type: "regular",
        cost: 12,
        stats: { hp: 14, attack: 4, defense: 4, movement: 1, range: 1 },
        desc: "Борец. Контроль через давление.",
        abilities: [],
      },
      {
        id: "roider",
        name: "Animals Roided Beast",
        type: "special",
        cost: 17,
        stats: { hp: 15, attack: 7, defense: 3, movement: 2, range: 1 },
        desc: "Перекачанный зверь. Риск и мощь.",
        abilities: ["ability-power-strike"],
      },
      {
        id: "legendary",
        name: "Animals Apex Predator",
        type: "legendary",
        cost: 34,
        stats: { hp: 22, attack: 8, defense: 5, movement: 1, range: 1 },
        desc: "Легенда Animals. Максимум мяса и удара.",
        abilities: ["ability-power-strike"],
      },
    ],
    commanderSlots: 2,
    ripperActions: {
      heal: "Meat Patch",
      buff: "Reserved Buff",
      repair: "Brace Tape",
      remove: "Sweat Out",
      mod: "Stim Shot",
    },
  },
  {
    key: "6th-street",
    id: "faction-6th-street",
    name: "6th Street",
    tag: "6ST",
    description:
      "Огневая мощь и дисциплина. Дальний бой и укрепление позиций.",
    style: "ranged discipline",
    commander: {
      name: "6th Street Captain",
      cost: 28,
      stats: { hp: 13, attack: 5, defense: 5, movement: 1, range: 2 },
      desc: "Капитан. Держит огневые точки.",
    },
    ripper: {
      name: "6th Street Combat Medic",
      cost: 17,
      stats: { hp: 8, attack: 2, defense: 4, movement: 1, range: 1 },
      desc: "Боевой медик. Лечение и броня на позициях.",
      heal: true,
      buff: true,
      tags: ["firepower", "discipline", "hold"],
      radius: 1,
    },
    units: [
      {
        id: "rifle",
        name: "6th Street Rifleman",
        type: "regular",
        cost: 11,
        stats: { hp: 8, attack: 4, defense: 3, movement: 1, range: 2 },
        desc: "Стрелок. Базовый дальний бой.",
        abilities: [],
      },
      {
        id: "mg",
        name: "6th Street Machine Gunner",
        type: "regular",
        cost: 16,
        stats: { hp: 9, attack: 6, defense: 4, movement: 1, range: 2 },
        desc: "Пулемётчик. Огневой контроль сектора.",
        abilities: [],
      },
      {
        id: "fort",
        name: "6th Street Fortifier",
        type: "regular",
        cost: 14,
        stats: { hp: 10, attack: 3, defense: 5, movement: 1, range: 1 },
        desc: "Укрепитель позиций. Броня союзникам.",
        abilities: ["ability-armor-boost"],
      },
      {
        id: "marksman",
        name: "6th Street Marksman",
        type: "regular",
        cost: 15,
        stats: { hp: 7, attack: 6, defense: 2, movement: 1, range: 3 },
        desc: "Марксман. Длинная дистанция.",
        abilities: [],
      },
      {
        id: "patrol",
        name: "6th Street Patrol",
        type: "special",
        cost: 13,
        stats: { hp: 8, attack: 4, defense: 3, movement: 2, range: 2 },
        desc: "Патруль. Мобильный огонь.",
        abilities: [],
      },
      {
        id: "legendary",
        name: "6th Street Overwatch",
        type: "legendary",
        cost: 34,
        stats: { hp: 14, attack: 8, defense: 5, movement: 1, range: 3 },
        desc: "Легендарный overwatch. Дальний подавляющий огонь.",
        abilities: ["ability-power-strike"],
      },
    ],
    commanderSlots: 3,
    ripperActions: {
      heal: "Field Dressing",
      buff: "Sandbag Cover",
      repair: "Weapon Clean",
      remove: "Stim Flush",
      mod: "Zeroing",
    },
  },
];

function constName(key) {
  if (key === "6th-street") return "SIXTH_STREET";
  return key.replace(/-/g, "_").toUpperCase();
}

function stats(s) {
  return `{ hp: ${s.hp}, attack: ${s.attack}, defense: ${s.defense}, movement: ${s.movement}, range: ${s.range} }`;
}

function abilities(arr) {
  if (!arr.length) return "[]";
  return `[${arr.map((a) => `"${a}"`).join(", ")}]`;
}

for (const f of factions) {
  const CN = constName(f.key);
  const prefix = f.key;
  const unitId = (suffix) => `${prefix}-${suffix}`;

  const unitsCode = [];
  unitsCode.push(`  {
    id: "${unitId("commander")}",
    factionId: ${CN}_FACTION.id,
    name: "${f.commander.name}",
    type: "commander",
    cost: ${f.commander.cost},
    stats: ${stats(f.commander.stats)},
    description: "${f.commander.desc}",
    abilities: [],
  },`);

  const ripAbilities = [];
  if (f.ripper.heal) ripAbilities.push("ability-heal");
  if (f.ripper.buff) ripAbilities.push("ability-armor-boost");
  unitsCode.push(`  {
    id: "${unitId("ripperdoc")}",
    factionId: ${CN}_FACTION.id,
    name: "${f.ripper.name}",
    type: "ripperdoc",
    cost: ${f.ripper.cost},
    stats: ${stats(f.ripper.stats)},
    description: "${f.ripper.desc}",
    abilities: ${abilities(ripAbilities)},
  },`);

  for (const u of f.units) {
    unitsCode.push(`  {
    id: "${unitId(u.id)}",
    factionId: ${CN}_FACTION.id,
    name: "${u.name}",
    type: "${u.type}",
    cost: ${u.cost},
    stats: ${stats(u.stats)},
    description: "${u.desc}",
    abilities: ${abilities(u.abilities)},
  },`);
  }

  fs.writeFileSync(
    path.join(armyDir, `${f.key}.catalog.ts`),
    `import type {
  FactionDefinition,
  UnitDefinition,
} from "../../../domain/armyBuilder/types";

/**
 * ${f.name} — catalog data only.
 * Style: ${f.style}
 */
export const ${CN}_FACTION: FactionDefinition = {
  id: "${f.id}",
  name: "${f.name}",
  tag: "${f.tag}",
  description:
    "${f.description}",
};

export const ${CN}_UNITS: UnitDefinition[] = [
${unitsCode.join("\n")}
];
`,
  );

  fs.writeFileSync(
    path.join(cmdDir, `${f.key}.commander.ts`),
    `import type { CommanderDefinition } from "../../../domain/commander/types";

export const ${CN}_COMMANDER: CommanderDefinition = {
  id: "commander-${f.key}",
  unitDefinitionId: "${unitId("commander")}",
  factionId: "${f.id}",
  name: "${f.commander.name}",
  description:
    "${f.commander.desc} Единственный носитель имплантов фракции.",
  implantSlots: ${f.commanderSlots},
};
`,
  );

  const ra = f.ripperActions;
  const healSlot = f.ripper.heal
    ? `{
      kind: "healing",
      abilityId: "ability-heal",
      label: "${ra.heal}",
      description: "Восстанавливает HP союзника.",
    }`
    : `{
      kind: "healing",
      abilityId: null,
      label: "${ra.heal}",
      description: "Резерв под лечение.",
    }`;
  const buffSlot = f.ripper.buff
    ? `{
      kind: "buff",
      abilityId: "ability-armor-boost",
      label: "${ra.buff}",
      description: "Временно усиливает защиту союзника.",
    }`
    : `{
      kind: "buff",
      abilityId: null,
      label: "${ra.buff}",
      description: "Резерв под усиление.",
    }`;

  fs.writeFileSync(
    path.join(ripDir, `${f.key}.ripperdoc.ts`),
    `import type { RipperdocDefinition } from "../../../domain/ripperdoc/types";

export const ${CN}_RIPPERDOC: RipperdocDefinition = {
  id: "ripperdoc-${f.key}",
  unitDefinitionId: "${unitId("ripperdoc")}",
  factionId: "${f.id}",
  name: "${f.ripper.name}",
  description: "${f.ripper.desc}",
  supportRadius: ${f.ripper.radius},
  styleTags: ${JSON.stringify(f.ripper.tags)},
  actions: [
    ${healSlot},
    ${buffSlot},
    {
      kind: "repair",
      abilityId: null,
      label: "${ra.repair}",
      description: "Резерв под ремонт.",
    },
    {
      kind: "remove_effect",
      abilityId: null,
      label: "${ra.remove}",
      description: "Резерв под снятие эффектов.",
    },
    {
      kind: "modification",
      abilityId: null,
      label: "${ra.mod}",
      description: "Резерв под модификации.",
    },
  ],
};
`,
  );
}

console.log(`Generated ${factions.length} factions`);
