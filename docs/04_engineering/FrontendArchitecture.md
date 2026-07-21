# Frontend Architecture

| Поле | Значение |
|------|----------|
| Status | DRAFT |
| Owner | Frontend Lead |
| Last updated | 2026-07-20 |
| Related | Architecture, UIFlow, DomainModel, CodingStandards |
| Full map | [DocMap.md](../00_meta/DocMap.md) |

> Без кода компонентов и страниц — только границы и каталоги.

---

## 1. Роль клиента

- Презентация и ввод  
- Local authority / sync (MVP: 2 вкладки)  
- Offline persistence армий  
- Подписка на DomainEvents → анимации  
- (Later) prediction + отображение server state  

**Не роль клиента:** быть единственным источником правды в online.

---

## 2. Слои внутри `apps/web`

| Слой | Путь | Можно | Нельзя |
|------|------|-------|--------|
| App shell | `app/` | Навигация, composition root, providers | Правила боя |
| UI | `ui/` | Экраны, виджеты, CSS | Прямой localStorage, формулы урона |
| Application facades | `application/` | Сценарии «сохранить армию», «отправить ход» | JSX |
| Infrastructure | `infra/` | localStorage, BroadcastChannel, HTTP/WS clients | Бизнес-правила |
| Styles | `styles/` | Тема, tokens | Логика |

Правила матча и валидации армии клиент берёт из **`packages/game-core`** и **`packages/game-catalog`** (или их текущего зеркала в `src/domain` + `src/data` до переноса).

---

## 3. Целевое дерево frontend

```text
apps/web/
├── index.html
├── vite.config.ts
├── package.json
├── public/
└── src/
    ├── app/
    │   ├── main.tsx                 # entry
    │   ├── App.tsx                  # shell / screen switch
    │   ├── navigation.ts            # screen ids / routes
    │   └── providers/               # DI: facades, event bus, ports
    ├── application/
    │   ├── army/
    │   │   └── ArmyFacade.ts        # билдер + save + validate
    │   ├── match/
    │   │   └── MatchFacade.ts       # intents → commands → authority
    │   ├── session/
    │   │   └── SessionFacade.ts     # create/join local or online
    │   └── settings/
    │       └── SettingsFacade.ts
    ├── infra/
    │   ├── persistence/
    │   │   ├── localArmySaveAdapter.ts
    │   │   └── localSettingsAdapter.ts
    │   ├── sync/
    │   │   ├── broadcastChannelSyncAdapter.ts
    │   │   ├── localStorageSessionStore.ts
    │   │   └── (later) webSocketSyncAdapter.ts
    │   ├── http/
    │   │   └── apiClient.ts         # later
    │   └── telemetry/
    │       └── noopTelemetry.ts
    ├── ui/
    │   ├── shell/
    │   ├── menu/
    │   ├── play/
    │   ├── armies/
    │   ├── match/
    │   ├── collection/
    │   └── shared/
    ├── styles/
    │   ├── reset.css
    │   ├── variables.css
    │   └── globals.css
    └── types/                       # только UI-типы (view models)
```

Пакеты вне `apps/web` (импортируются web и api):

```text
packages/game-core/          # см. Architecture
packages/game-catalog/
packages/shared-contracts/
```

---

## 4. Миграция с текущего `src/`

| Сейчас | Цель |
|--------|------|
| `src/app` | `apps/web/src/app` |
| `src/ui` | `apps/web/src/ui` |
| `src/styles` | `apps/web/src/styles` |
| `src/domain` | `packages/game-core` |
| `src/data/catalog` | `packages/game-catalog` |
| `src/services/match` | часть core + `application/match` + `infra/sync` |
| `src/services/army` | `application/army` + `infra/persistence` |

Пока монорепо не разрезан физически — **логические границы уже обязательны** для нового кода.

---

## 5. UI и состояние

- **Server/Match state:** `MatchState` из core (immutable updates).  
- **View state:** selection, modals, drag — локально в UI/feature hooks.  
- **Не смешивать** view state в MatchState.  
- Подписка на EventBus для анимаций; анимация не подтверждает ход.

---

## 6. Facades (единственная дверь UI → логика)

| Facade | Сервисы за ним |
|--------|----------------|
| `ArmyFacade` | ArmyBuilder, ArmyValidation, Save, Catalog |
| `MatchFacade` | Validation, MatchAuthority, MatchEngine (через authority), EventBus publish |
| `SessionFacade` | MatchSession, MatchSync adapters |
| `SettingsFacade` | SettingsService |

Компоненты говорят с facades, не с `MatchEngine` напрямую (исключение: тесты).

---

## 7. Client-only сервисы

- `AnimationService`  
- `SettingsService`  
- `ClientPredictionService` (online later)  

---

## 8. Обновление

Да — при смене слоёв или facades. Согласовать с Architecture.md.
