# AI System

| Поле | Значение |
|------|----------|
| Status | DRAFT |
| Owner | Lead Software Architect |
| Implementation | `src/domain/ai` |

## Принцип

ИИ **только принимает решения**. Правила боя / движения / способностей остаются в Battle / Movement / Combat / Ability System.

Выполнение: только через `BattleManager.move` / `attack` / `useAbility` / `endTurn`.

## Модули

| Модуль | Ответственность |
|--------|-----------------|
| `AiManager` | Оркестрация хода ИИ |
| `aiDecision` | «Что делать?» — генерация и выбор действия |
| `actionEvaluation` | Оценка атаки / способности / позиции |
| `aiStrategy` | Веса Aggressive / Defensive / Tactical |

## Сложность

| Уровень | Поведение |
|---------|-----------|
| Easy | Шум + ошибки, стиль aggressive |
| Normal | Небольшой шум, стиль defensive |
| Hard | Без шума, тактический выбор, приоритет kill Командира |

## UI

Режим **Игрок против ИИ** → выбор сложности → Army Builder → матч.
Hotseat («с другом») — ИИ выключен.

## Расширение

Новые эвристики = `actionEvaluation` / `aiStrategy`. Не дублировать правила в ИИ.
