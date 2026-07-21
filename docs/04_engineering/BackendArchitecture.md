# Backend Architecture

| Поле | Значение |
|------|----------|
| Status | DRAFT |
| Owner | Backend Lead |
| Last updated | 2026-07-20 |
| Related | Architecture, API, Multiplayer, Security, DomainModel |
| Full map | [DocMap.md](../00_meta/DocMap.md) |

> Код и HTTP-роуты здесь не описываются как реализация — только модули и границы.  
> MVP online может отсутствовать; структура нужна, чтобы не переписывать клиент.

---

## 1. Роль сервера

- **Authoritative** применение `Action` через тот же `game-core`  
- Аккаунты / сессии  
- Matchmaking  
- Хранение армий и replay (по мере появления)  
- Рейтинг  
- Валидация loadout против catalog version  

**Не роль сервера:** рендер UI, анимации, владение CSS.

---

## 2. Слои `apps/api`

| Слой | Путь | Ответственность |
|------|------|-----------------|
| Transport | `http/`, `ws/` | REST + WebSocket adapters |
| Application | `application/` | Use-cases: createMatch, submitAction, finishMatch |
| Domain bridge | импорт `game-core` | Резолв матча |
| Catalog | импорт `game-catalog` | Та же версия, что у клиента |
| Infrastructure | `infra/` | DB, redis, auth provider, clocks |
| Contracts | `shared-contracts` | Типы команд/ответов |

---

## 3. Целевое дерево backend

```text
apps/api/
├── package.json
├── tsconfig.json
└── src/
    ├── main.ts                      # composition root
    ├── config/
    │   └── env.ts
    ├── http/
    │   ├── server.ts
    │   └── routes/                  # auth, armies, profile (мета)
    ├── ws/
    │   ├── matchGateway.ts          # комнаты матча
    │   └── protocol.ts              # mapping ↔ shared-contracts
    ├── application/
    │   ├── auth/
    │   │   └── AuthService.ts
    │   ├── match/
    │   │   ├── OnlineMatchService.ts
    │   │   ├── MatchmakingService.ts
    │   │   └── ReplayService.ts
    │   ├── army/
    │   │   └── ArmyCloudService.ts  # persist + validate
    │   └── rating/
    │       └── RatingService.ts
    ├── infra/
    │   ├── db/
    │   ├── cache/
    │   ├── auth/
    │   └── telemetry/
    └── security/
        └── antiCheatPolicies.ts     # лимиты, rate limit hooks
```

Общие пакеты:

```text
packages/game-core/          # MatchEngine, validation, victory…
packages/game-catalog/       # те же ids, что у web
packages/shared-contracts/   # Action, MatchSnapshot, errors, versions
```

---

## 4. Authority loop (online)

```text
Client → Action (signed/session)
  → API gateway authz
    → Army/catalog version check
      → ValidationService (game-core)
        → MatchEngine.apply
          → persist snapshot / append history
          → broadcast MatchState diff or events to room
            → Rating on MatchEnded
```

Клиент может показывать оптимистично, но **истина — серверный state**.

---

## 5. Данные на сервере

См. таблицу в Architecture §6. Кратко:

- Обязательно позже: accounts, authoritative matches, ratings  
- Желательно: cloud armies, replays  
- Никогда: UI animation state  

---

## 6. Масштабирование

| Этап | Инфра |
|------|--------|
| Dev | Один Node process, in-memory rooms |
| Soft launch | DB для users/armies, sticky sessions или room registry |
| Scale | Отдельный match worker / redis pubsub для комнат (не меняя game-core) |

`game-core` остаётся CPU-чистым и горизонтально повторяемым.

---

## 7. Безопасность

См. [Security.md](Security.md): валидация хода и армии на сервере, rate limits, нет доверия к client damage.

---

## 8. Обновление

Да — с появлением online и при смене transport. API surface — в [API.md](API.md).
