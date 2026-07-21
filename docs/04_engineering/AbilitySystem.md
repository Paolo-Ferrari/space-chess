# Ability System

| Поле | Значение |
|------|----------|
| Status | DRAFT |
| Owner | Lead Software Architect |
| Implementation | `src/domain/ability`, `src/data/catalog/abilities` |

## Принцип

Юнит хранит только `abilities: string[]` (ids).  
Логика — в Ability System. Battle вызывает фасад, UI показывает список.

## Виды

| Kind | Поведение |
|------|-----------|
| `passive` | Применяются на `BattleStarted` |
| `active` | Ручная активация в ход |
| `trigger` | Хук `processTriggers` (заготовка) |
| `support` | Ручная поддержка (heal / buff) |

Status effects — runtime на `UnitRuntime.statusEffects`.

## Пайплайн active/support

1. `canUseAbility`  
2. `getLegalAbilityTargets`  
3. `applyAbility` → effects  
4. `BattleState` update  
5. Events: `AbilityUsed`, `UnitHealed`, `StatusApplied`, …

## Расширение

Новая способность = запись в `data/catalog/abilities` + id в unit catalog.  
Не менять BattleManager / UnitRuntime shape / UI (UI читает AbilitySystem.listForUnit).

## Тестовый набор

Heal, Power Strike, Armor Boost, Slow — не финальный баланс.
