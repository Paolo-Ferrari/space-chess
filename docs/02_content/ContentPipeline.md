# Content Pipeline

| Поле | Значение |
|------|----------|
| Status | ACTIVE |
| Owner | Lead GD + Tech Lead |
| Last updated | 2026-07-21 |
| Related | Units, Assets, CodingStandards |
| Full map | [DocMap.md](../00_meta/DocMap.md) |

## 1. Цель документа

Как добавить юнита/фракцию: docs → game database → PNG → проверка — без правок боевых систем.

## 2. Процесс: новый юнит

1. Описание в [Units.md](Units.md) / фракционном doc (при необходимости).
2. Запись в `src/data/catalog/armyBuilder/{faction}.catalog.ts` (или edgerunners).
3. PNG в `public/assets/units/{id}.png`.
4. Опционально: ability / commander / ripperdoc / legendary profile.
5. Проверка: `npm run test` (включая `gameDatabase.core.test.ts`), смоук Army Builder / battle.
6. Changelog при заметном изменении ростера.

## 3. Точки входа в коде

| Нужно | Импорт |
|-------|--------|
| Фасад для людей | `src/content` |
| Весь контент runtime | `src/data/gameDatabase` |
| Юниты | `UnitSystem` |
| Карты / победа / режимы | `content` → maps / victory / modes |
| Визуал SVG / обложки | `src/data/visual` + `public/assets/unit-icons` |
| Тема фракции | `ThemeEngine` |

Подробные чеклисты: [ExtensionGuide.md](../04_engineering/ExtensionGuide.md).

## 4. Запрещено

- Хардкод статов/имён юнитов в React-компонентах
- Base64-портреты в коде
- Дублировать каталог внутри Battle System
- Switch по всем unitId в engine — только реестры
