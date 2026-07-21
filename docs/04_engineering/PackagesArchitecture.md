# Packages Architecture

| Поле | Значение |
|------|----------|
| Status | DRAFT |
| Owner | Lead Software Architect |
| Last updated | 2026-07-20 |
| Related | Architecture, FrontendArchitecture, BackendArchitecture |
| Full map | [DocMap.md](../00_meta/DocMap.md) |

## Цель

Границы shared-пакетов, чтобы web и api не расползались.

---

## packages/game-core

```text
packages/game-core/
└── src/
    ├── entities/              # типы MatchState, UnitInstance, Action…
    ├── services/
    │   ├── matchEngine/
    │   ├── movement/
    │   ├── combat/
    │   ├── ability/
    │   ├── statusEffects/
    │   ├── victory/
    │   ├── turn/
    │   ├── board/
    │   └── validation/
    ├── strategies/            # movement, attack pattern, ability, victory, mode…
    ├── factories/             # match, unit instance, map, army…
    ├── events/                # DomainEvent types + helper createEvent
    └── index.ts               # public API пакета
```

**Запрещено:** React, DOM, fetch, fs, Express.

---

## packages/game-catalog

```text
packages/game-catalog/
└── src/
    ├── factions/
    ├── units/
    ├── abilities/
    ├── implants/
    ├── ripperdocs/
    ├── mercenaries/
    ├── maps/
    ├── modes/
    ├── version.ts             # catalogVersion string/number
    └── index.ts
```

Только данные и read-helpers. Без резолва боя.

---

## packages/shared-contracts

```text
packages/shared-contracts/
└── src/
    ├── actions/               # wire-форма Action
    ├── snapshots/             # MatchSnapshot DTO
    ├── session/               # join/create session messages
    ├── errors/
    ├── versions/              # protocolVersion + catalogVersion
    └── index.ts
```

Общий язык клиента и сервера. Без игровых формул.

---

## Зависимости пакетов

```text
game-catalog          (нет зависимостей на core)
     ▲
     │ (core читает definitions по id)
game-core
     ▲
     │
shared-contracts      (DTO; может ссылаться на id-типы, не на React)
     ▲
     │
apps/web  apps/api
```

`game-core` **не** зависит от `apps/*`.  
`apps/*` зависят от всех трёх пакетов по необходимости.
