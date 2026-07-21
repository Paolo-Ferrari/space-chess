# Commander System

| Поле | Значение |
|------|----------|
| Status | DRAFT |
| Owner | Lead Software Architect + Lead GD |
| Implementation | `src/domain/commander`, `src/data/catalog/commanders`, `src/data/catalog/implants` |

## Принцип

Командир — **обязательная фигура** армии (аналог короля). Уничтожение = поражение.

Персонализация — через **импланты** (только на Командире). Обычные юниты фиксированы.

## Модель

| Слой | Что |
|------|-----|
| `UnitDefinition` type `commander` | Базовые статы / стоимость |
| `CommanderDefinition` | Слоты имплантов, привязка к unit id |
| `ImplantDefinition` | Тип, slotCost, statMods, abilityIds, restrictions |
| `Army.commanderImplantIds` | Loadout до матча |
| `UnitRuntime.implantIds` | Runtime (только у командира) |

Эффективные статы: `CommanderSystem.getEffectiveStats` → `getEffectiveUnitStats` в бою.

## Типы имплантов

`offensive` · `defensive` · `mobility` · `cyberdeck` · `neural`

## Тестовые импланты (не баланс)

| Id | Эффект |
|----|--------|
| `implant-reinforced-armor` | DEF +2 |
| `implant-combat-module` | ATK +2 |
| `implant-optic-system` | RNG +1 |
| `implant-neural-accelerator` | MOV +1 |

## Новый имплант

1. Запись в `src/data/catalog/implants/*.catalog.ts`  
2. Append в registry  

Не менять `CommanderSystem` API, BattleManager, UnitSystem ради контента.

## UI

`CommanderSetupPanel` в Army Builder: портрет, статы с дельтой, слоты, установка/снятие.
