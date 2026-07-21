# Core Stabilization Audit

| Поле | Значение |
|------|----------|
| Status | APPROVED (stabilization pass) |
| Date | 2026-07-20 |
| Owner | Lead Software Architect |

## 1. Найденные проблемы (до стабилизации)

| Проблема | Где | Риск |
|----------|-----|------|
| Два параллельных мира матча | `domain/match` + `services/match` (legacy) vs `domain/battle` (live) | Путаница при расширении |
| `selectedUnitId` в runtime | `BattleState` | UI-выбор смешан с правилами боя |
| Каталог импортируется глубоко из battle | прямые импорты `data/catalog` | Сложнее подменить catalog в тестах |
| Лог пишется ad-hoc | move/attack/turn | Нет единой шины для анимаций/способностей |
| Нет тестов ядра | — | Регрессии при способностях |
| Старые UI-экраны | `ui/match`, `ui/armies`, stubs | Шум в репозитории |

## 2. Целевое разделение

### Static Game Data
`src/data/catalog/**` + фасады `FactionSystem` / `UnitSystem`  
Фракции, юниты, статы, стоимость, описания. Без позиций и HP.

### Runtime Game State
`BattleState` / `Army` (saved loadout)  
Позиции, HP, ход, phase, winner. Без «какой экран открыт».

### UI State
`App` screen, `BattleScreen` selection / modals / feedback  
Не влияет на детерминизм правил.

## 3. Что сделано в этом проходе

- Event Bus + типы игровых событий  
- Selection вынесен из `BattleState` в UI  
- Persistence ports: армии + snapshot матча  
- Фасады Faction / Unit / GameManager  
- Базовые vitest-тесты ядра  
- Legacy помечен в `src/legacy/README.md` (перенос указателей)

## 4. Контракты расширения

| Добавить | Куда | Не трогать |
|----------|------|------------|
| Юнит | catalog файл фракции | Battle systems (читают stats по id) |
| Фракция | `*.catalog.ts` + registry | Army Builder UI |
| Способность | `abilities[]` + AbilityStrategy (later) | `UnitRuntime` shape |
| Эффект | подписчик Event Bus / StatusEffectService | `computeDamage` напрямую |
| Режим | GameMode strategy + GameManager | цикл applyMove/applyAttack |

## 5. Поведение

После стабилизации матч и Army Builder должны работать **как до рефакторинга** (hotseat, урон = Attack, победа по Командиру).
