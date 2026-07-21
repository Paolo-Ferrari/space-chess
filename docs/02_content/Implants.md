# Implants

| Поле | Значение |
|------|----------|
| Status | DRAFT |
| Owner | Lead Game Designer |
| Last updated | 2026-07-20 |
| Related | Commander, Combat, Balance |
| Implementation | [CommanderSystem.md](../04_engineering/CommanderSystem.md) |
| Full map | [DocMap.md](../00_meta/DocMap.md) |

## 1. Цель документа

Каталог имплантов **только для Командира**.

## 2. Архитектура (без баланса)

Поля `ImplantDefinition`:

- id, name, description
- type: offensive / defensive / mobility / cyberdeck / neural
- effect: `statMods` + optional `abilityIds`
- restrictions (faction / maxStacks)
- slotCost

Новый имплант = каталог + registry. Без правок Battle / Unit / Commander API.

## 3. Тестовые импланты

Усиленная броня, Боевой модуль, Оптическая система, Нейроускоритель — только для проверки механики.

## 4. TBD

- Экономика слотов / энергия
- Боевые эффекты уровня Sandevistan / Berserk / Cyberdeck
- Баланс цифр

## 5–6

Используем при билдере командира и матч-способностях. ← Commander; → Combat, Balance.
