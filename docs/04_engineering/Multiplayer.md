# Multiplayer / Networking

| Поле | Значение |
|------|----------|
| Status | DRAFT |
| Owner | Lead Software Architect |
| Last updated | 2026-07-20 |
| Related | Architecture, API, Security |
| Full map | [DocMap.md](../00_meta/DocMap.md) |

## 1. Цель документа

Синхронизация матча отдельно от общего Architecture.

## 2. Сейчас (MVP)

- Режим: **Локальная (2 вкладки)** на одном ПК
- Канал: BroadcastChannel + localStorage
- Сервера нет
- Порт: `MatchAuthority` = `LocalAuthority` (см. Architecture)

## 3. Целевые разделы (online)

1. Модель хода и authority → `ServerAuthority` + тот же `game-core`
2. Реконнект / disconnect
3. Зрители (если войдут в Vision)
4. Античит — ссылка на Security
5. Протокол команд — `shared-contracts` (см. API.md при старте сети)

## 4–6

Проектирование сети. ← Architecture, API; → Security, Testing. Обновление: да.
