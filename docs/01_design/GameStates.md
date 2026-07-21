# Game States

| Поле | Значение |
|------|----------|
| Status | DRAFT |
| Owner | Lead Software Architect |
| Last updated | 2026-07-20 |
| Related | Loop, Rules, FE/BE |
| Full map | [DocMap.md](../00_meta/DocMap.md) |

## 1. Цель документа

Формальная модель состояний приложения и матча.

## 2. Утверждённые экраны приложения (MVP)

- Menu
- Play (выбор режима)
- Armies
- Settings
- Match
- (заглушки режимов не являются полноценными state machines)

## 3. Матч (направление)

Фазы уровня «идёт матч / ход игрока N / ожидание действия / результат / сдача».  
Точная диаграмма переходов — заполнить по коду `matchEngine` / session и утвердить.

## 4. Локальная сессия (2 вкладки)

Синхронизация через клиентский канал (BroadcastChannel + localStorage) — детали в Frontend Architecture / Multiplayer. Состояния должны учитывать: «ожидание второго игрока», «ход мой / не мой».

## 5. TBD

- Online: reconnect, disconnect, desync recovery
- Полные таблицы переходов (state chart)

## 6. Режим обновления

Да — при каждом изменении state machine.
