# Commander

| Поле | Значение |
|------|----------|
| Status | DRAFT |
| Owner | Lead Game Designer |
| Last updated | 2026-07-20 |
| Related | GDD, Implants, Rules |
| Implementation | [CommanderSystem.md](../04_engineering/CommanderSystem.md) |
| Full map | [DocMap.md](../00_meta/DocMap.md) |

## 1. Цель документа

Командир — ключевая фигура армии и якорь условия победы.

## 2. Утверждённые принципы

- Командир обязателен в армии (один на армию)
- **Только Командир** получает **импланты**
- Остальные фигуры фракции — фиксированные (без дерева имплантов)
- Победа через вывод командира из строя или сдачу (см. Game Rules)
- Базовые статы из Unit catalog + модификации имплантов

## 3. Live (архитектура)

- Профиль: `CommanderDefinition` (Arasaka: 3 слота)
- Loadout: `Army.commanderImplantIds`
- Бой: `UnitRuntime.implantIds` → эффективные статы / ability ids

## 4. TBD

- Выбор командира по фракции / универсальный пул
- Стоимость имплантов в энергии армии
- Финальные визуалы по фракции

## 5–6. Использование / зависимости

Матч, билдер, дизайн победы. ← GDD, Factions; → Implants, Game Rules, UI Flow.
