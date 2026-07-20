import type { PlayModeDefinition } from "../../domain/match/playMode.types";

/**
 * Play lobby modes.
 * Add new modes here — PlayScreen reads this catalog only.
 */
export const PLAY_MODES_CATALOG: readonly PlayModeDefinition[] = [
  {
    id: "classic",
    label: "Классический",
    blurb:
      "Пошаговый матч 8×8. Онлайн (позже) или локальная игра в двух окнах.",
    atmosphere: "classic",
  },
  {
    id: "special",
    label: "Спец-режим",
    blurb: "Особые правила сражения. Настройки появятся позже.",
    atmosphere: "special",
  },
  {
    id: "custom",
    label: "Кастомный",
    blurb: "Свой набор параметров матча.",
    atmosphere: "custom",
  },
  {
    id: "vs-ai",
    label: "Против ИИ",
    blurb: "Тренировочный бой с компьютерным соперником.",
    atmosphere: "vs-ai",
  },
  {
    id: "sandbox",
    label: "Песочница",
    blurb: "Свободная тренировка без ограничений матча.",
    atmosphere: "sandbox",
  },
] as const;
