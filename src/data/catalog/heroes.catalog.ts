import type { Hero } from "../../domain/hero/hero.types";

/**
 * Hero factions catalog.
 * Add / edit heroes only here — UI and armies read through collectionService.
 */
export const HEROES_CATALOG: readonly Hero[] = [
  {
    id: "hero-cosmodesant",
    name: "Космодесант",
    portraitId: "hero-cosmodesant",
    description:
      "Элитные бронированные бойцы. Два командира: победа только после гибели обоих.",
    traitDescription:
      "В армии сразу два Командира. Перед матчем выбирается активный; после его смерти управление переходит ко второму. Победа — только когда уничтожены оба.",
  },
  {
    id: "hero-plutons",
    name: "Плутоны",
    portraitId: "hero-plutons",
    description:
      "Высокие технологии как «чудо». Мобильность, щиты и контроль поля.",
    traitDescription:
      "Раз в 5 ходов герой может телепортироваться на свободную клетку рядом со своей фигурой. Телепорт запрещён на клетку под атакой противника.",
  },
] as const;
