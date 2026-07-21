# 0001. Monorepo with shared game-core

Date: 2026-07-20  
Status: Accepted

## Context

Нужны local PvP сейчас и online/PvP/рейтинг/ИИ позже. Дублирование правил на клиенте и сервере приводит к рассинхрону и переписыванию.

## Decision

1. Монорепозиторий: `apps/web`, `apps/api`, `packages/game-core`, `packages/game-catalog`, `packages/shared-contracts`.  
2. Весь резолв матча и валидация действий — в `game-core` (pure TS).  
3. Контент — data-driven в `game-catalog`.  
4. Authority: порт `MatchAuthority` с реализациями Local и Server.

## Consequences

- Online добавляется адаптерами, не форком правил.  
- Требуется дисциплина: UI не содержит combat math.  
- Физический перенос из текущего `src/` может быть поэтапным; границы обязательны сразу.
