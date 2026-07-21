# Units

| Поле | Значение |
|------|----------|
| Status | ACTIVE |
| Owner | Lead Game Designer |
| Last updated | 2026-07-21 |
| Related | Factions, Combat, Balance, Assets, ContentPipeline |
| Full map | [DocMap.md](../00_meta/DocMap.md) |

## 1. Цель документа

Источник правды по игровым юнитам — **game database**, не UI и не Battle System.

## 2. Где лежат данные

| Слой | Путь |
|------|------|
| Entry (импорт контента) | `src/data/gameDatabase/` |
| Фракционные ростеры | `src/data/catalog/armyBuilder/*.catalog.ts` |
| Edgerunners | `src/data/catalog/edgerunners/` |
| Finalize записи | `src/data/catalog/units/defineUnit.ts` |
| Чтение в игре | `UnitSystem` → game database |

## 3. Схема карточки (`UnitDefinition`)

| Поле | Описание |
|------|----------|
| `id` | Стабильный id (`arasaka-soldier`) |
| `name` | Отображаемое имя |
| `factionId` | Фракция или пул edgerunners |
| `type` | `commander` / `ripperdoc` / `regular` / `special` / `legendary` / `edgerunner` |
| `cost` | Combat Capacity |
| `stats.hp` / `attack` / `defense` / `movement` / `range` | Боевые статы |
| `abilities` | Id способностей из Ability catalog |
| `imagePath` | Публичный PNG: `/assets/units/{id}.png` |
| `description` | Текст карточки |
| `rarity` | `common` … `legendary` |
| `isLegendary` | Явный флаг легендарности |

Авторский ввод может опускать `imagePath` / `rarity` / `isLegendary` — их заполнит `defineUnit`.

## 4. Как добавить юнита

1. Добавить запись в каталог фракции (или edgerunners).
2. Положить PNG: `public/assets/units/{id}.png` (или `node scripts/generate-unit-placeholders.mjs`).
3. При необходимости — профиль Commander / Ripperdoc / Legendary / Ability ids.
4. **Не** менять Battle / UI ради статов — они читают `UnitSystem.get(id)`.

## 5. Арты

См. [Assets.md](../03_ux/Assets.md). Замена заглушки = замена файла PNG, логика не трогается.
