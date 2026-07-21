# Ripperdocs

| Поле | Значение |
|------|----------|
| Status | DRAFT |
| Owner | Lead Game Designer |
| Last updated | 2026-07-20 |
| Implementation | [RipperdocSystem.md](../04_engineering/RipperdocSystem.md) |
| Related | Factions, ArmyBuilder, AbilitySystem |
| Full map | [DocMap.md](../00_meta/DocMap.md) |

## 1. Цель документа

Обязательная фигура риппердока; различия по фракциям.

## 2. Статус внедрения

Все 10 фракций имеют live-профиль в `src/data/catalog/ripperdocs/`.

| Фракция | Профиль | Live kit |
|---------|---------|----------|
| Arasaka | `ripperdoc-arasaka` | heal + armor |
| Militech | `ripperdoc-militech` | heal + armor |
| Maelstrom | `ripperdoc-maelstrom` | heal + armor |
| Tyger Claws | `ripperdoc-tyger-claws` | heal + armor |
| Valentinos | `ripperdoc-valentinos` | heal + armor (radius 2) |
| Voodoo Boys | `ripperdoc-voodoo-boys` | heal + armor (radius 2) |
| Nomads | `ripperdoc-nomads` | heal + armor |
| NCPD / MaxTac | `ripperdoc-ncpd` | heal + armor |
| Animals | `ripperdoc-animals` | heal only |
| 6th Street | `ripperdoc-6th-street` | heal + armor |

Repair / remove_effect / modification — reserved slots per faction flavor.

## 3. Правила армии

- Ровно один Ripperdoc на армию (валидация Army Builder).
- Способности — Ability System.

## 4. TBD

- Уникальные ability ids вместо общих test abilities
- Финальный баланс

## 5. Обновление

Да — при добавлении фракционного профиля (catalog append only).
