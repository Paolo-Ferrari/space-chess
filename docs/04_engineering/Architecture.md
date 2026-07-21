# Architecture

| Поле | Значение |
|------|----------|
| Status | DRAFT → целевая архитектура v1 + core stabilization |
| Owner | Lead Software Architect |
| Last updated | 2026-07-21 |
| Stabilization | [CoreStabilizationAudit.md](CoreStabilizationAudit.md) |
| Extension | [ExtensionGuide.md](ExtensionGuide.md) |
| Related | FrontendArchitecture, BackendArchitecture, DomainModel, Multiplayer, API, ADR |
| Full map | [DocMap.md](../00_meta/DocMap.md) |

> **Код в этом документе не пишется.** Это обязательный контракт для всей дальнейшей реализации.  
> Детали сущностей: [DomainModel.md](DomainModel.md).  
> Папки FE/BE: [FrontendArchitecture.md](FrontendArchitecture.md), [BackendArchitecture.md](BackendArchitecture.md).

---

## 1. Цель

Полностью определить архитектуру браузерной тактической PvP (Space Chess), чтобы:

- команда до ~20 человек писала код в одни и те же границы;
- local MVP и будущий online/PvP/рейтинг/ИИ добавлялись **без переписывания** ядра;
- игровые правила жили вне UI и вне транспорта.

---

## 2. Общая архитектура проекта

### 2.1 Стиль системы

**Модульный монорепозиторий** с выделенным **общим игровым ядром** (`game-core`):

| Слой | Роль |
|------|------|
| `apps/web` | React + Vite клиент: UI, ввод, презентация, local sync |
| `apps/api` | Node.js + TypeScript сервер: authority online, аккаунты, рейтинг |
| `packages/game-core` | Чистый TS: сущности, правила, валидация действий, резолв хода |
| `packages/game-catalog` | Статические игровые данные (фракции, юниты, способности…) как данные |
| `packages/shared-contracts` | DTO / команды матча / версии протокола (без React, без Express) |
| `docs/` | Источник правды по дизайну и архитектуре |

**Почему так:** один и тот же `game-core` гоняет local match и server authority. Новые фракции/способности/режимы — данные + strategy-плагины, а не форк клиента.

### 2.2 Контекст (C4 L1)

```text
┌─────────────┐     local channel      ┌─────────────┐
│  Web Client │◄─────────────────────►│  Web Client │   ← MVP: 2 вкладки
│   (P1)      │   BroadcastChannel /   │   (P2)      │
└──────┬──────┘     localStorage       └──────┬──────┘
       │                                      │
       │         future: WebSocket/HTTPS      │
       └──────────────┬───────────────────────┘
                      ▼
              ┌───────────────┐
              │  API (Node)   │  ← authoritative match, auth, rating
              │  + game-core  │
              └───────┬───────┘
                      ▼
              ┌───────────────┐
              │  Persistence  │  DB / object store (later)
              └───────────────┘
```

### 2.3 Границы ответственности

| Граница | Владеет | Не владеет |
|---------|---------|------------|
| **UI** | Экраны, ввод, анимации, отображение | Формулы боя, победа, валидация армии |
| **game-core** | Правила, сущности матча, детерминированный резолв | React, DOM, сеть, БД |
| **Catalog** | Определения контента (что можно взять в армию) | Состояние конкретной партии |
| **Session / Transport** | Доставка команд/снимков между клиентами или клиент↔сервер | Изменение правил «на лету» |
| **API** | Authority online, аккаунты, рейтинг, хранение | Вёрстка, анимации |

### 2.4 Принципы

1. **Docs-first:** механика только из APPROVED/DRAFT design docs.  
2. **Domain outside UI.**  
3. **Deterministic match step:** одинаковый `MatchState + Action` → одинаковый результат в core.  
4. **Composition over inheritance** для игровых объектов (см. §10–11).  
5. **Data-driven content:** фракции/юниты/импланты/способности — каталог + обработчики по id.  
6. **Ports & Adapters:** persistence, sync, AI, telemetry — адаптеры снаружи core.  
7. **Local-first сейчас, authority later:** интерфейс `MatchAuthority` имеет реализации `LocalAuthority` и `ServerAuthority`.  
8. **Версионирование протокола и каталога** — чтобы сейвы и online не ломались молча.

### 2.5 Поток управления матчем

```text
UI Intent
  → Command (Move|Attack|Ability|Skip|Surrender)
    → ValidationService (legal?)
      → MatchEngine.apply (game-core, pure)
        → MatchState' + DomainEvents
          → Transport (local / server broadcast)
          → UI (подписка на events: анимации, звук)
          → Telemetry / Replay (опционально)
```

UI **никогда** не мутирует `MatchState` напрямую.

### 2.6 Режимы authority

| Режим | Authority | Транспорт |
|-------|-----------|-----------|
| Local 2 tabs (MVP) | Оба клиента применяют одну и ту же команду через shared session; источник снимка — согласованный session store | BroadcastChannel + localStorage |
| Online PvP (target) | Только сервер применяет команду через `game-core` | WebSocket + REST для мета |
| Hotseat / spectator (later) | По модели режима | Тот же `MatchAuthority` |

Детали синка: [Multiplayer.md](Multiplayer.md). Решения «почему»: `adr/`.

---

## 3. Структура папок (сводка)

Полные деревья — в FE/BE docs и в §17 ниже.

```text
/
├── apps/
│   ├── web/                 # React + Vite
│   └── api/                 # Node.js + TypeScript
├── packages/
│   ├── game-core/           # правила и сущности матча
│   ├── game-catalog/        # статический контент
│   └── shared-contracts/    # команды, DTO, версии
└── docs/
```

Миграция с текущего `src/` выполняется поэтапно **без смены архитектурных границ** (см. FrontendArchitecture § миграция).

---

## 4. Сущности

Полный каталог полей и связей: **[DomainModel.md](DomainModel.md)**.

Краткий список:

| Сущность | Слой | Смысл |
|----------|------|--------|
| `Player` / `PlayerProfile` | Meta | Участник (аккаунт или локальный слот) |
| `Faction` | Catalog | Идентичность армии |
| `UnitDefinition` | Catalog | Роль/класс в каталоге |
| `UnitInstance` | Match | Фигура на доске / в армии в бою |
| `Commander` | Role | Роль на `UnitInstance` + слоты имплантов |
| `Ripperdoc` | Role | Обязательная роль армии |
| `Mercenary` (Edgerunner) | Catalog/Role | Нейтральный наёмник |
| `Implant` / `ImplantDefinition` | Catalog | Только для Commander |
| `Ability` / `AbilityDefinition` | Catalog | Описание способности |
| `Army` / `ArmyLoadout` | Meta | Сборка вне матча |
| `ArmySlot` | Meta | Слот сборки |
| `MapDefinition` / `Board` / `Cell` | Catalog + Match | Карта и состояние клеток |
| `Match` / `MatchState` | Match | Партия |
| `Game` / `GameSession` | App | Оболочка вокруг матча (режим, игроки) |
| `GameMode` | Catalog | Правила режима (local, ranked, …) |
| `Turn` | Match | Номер/владелец хода |
| `Action` | Match | Команда игрока |
| `StatusEffect` | Match | Временный эффект на инстансе |
| `CombatResolution` | Match (process result) | Результат атаки/способности |
| `MatchHistory` / `ReplayFrame` | Meta | История партии |
| `Rating` | Meta (server) | Рейтинг (later) |

Разделение **Definition (каталог)** vs **Instance (матч)** обязательно: иначе контент и бой слипнутся.

---

## 5. Сервисы

Сервис = оркестрация + вызов чистых функций core. UI не вызывает «куски правил» вразброс.

### 5.1 Domain / Match (в `game-core` или тонкой обёртке)

| Сервис | Ответственность |
|--------|-----------------|
| `MatchEngine` | Применить `Action` к `MatchState` → новый state + events |
| `MovementService` | Легальные клетки хода, применение перемещения |
| `CombatService` | Атака, урон, смерть (по утверждённым Rules/Combat) |
| `AbilityService` | Выбор и резолв способности по `abilityId` (Strategy) |
| `StatusEffectService` | Наложение/тик/снятие эффектов |
| `VictoryService` | Условие победы/поражения/сдачи |
| `TurnService` | Чей ход, завершение хода, skip |
| `ValidationService` | Легальность действия *до* применения |
| `BoardService` | Запросы к доске (занятость, координаты, зоны) |

### 5.2 Meta / Build

| Сервис | Ответственность |
|--------|-----------------|
| `ArmyBuilderService` | Сборка loadout в UI-потоке |
| `ArmyValidationService` | Бюджет, слоты, командир, риппер, max 2 mercenary |
| `CatalogService` | Доступ к фракциям/юнитам/имплантам (read-only) |
| `SaveService` | Сохранение/загрузка армий и настроек (порт persistence) |

### 5.3 Session / App

| Сервис | Ответственность |
|--------|-----------------|
| `GameStateService` | Состояния приложения (menu/play/match…) — не правила боя |
| `MatchSessionService` | Создание/присоединение сессии, роль P1/P2 |
| `MatchSyncService` | Публикация команд/снимков (local или network adapter) |
| `MatchAuthority` (port) | Кто имеет право вызвать `MatchEngine` |

### 5.4 Client-only

| Сервис | Ответственность |
|--------|-----------------|
| `AnimationService` | Очередь визуальных эффектов по DomainEvents |
| `AudioService` | (later) звук по events |
| `ClientPredictionService` | (online later) оптимистичный UI, сверка с сервером |
| `SettingsService` | Локальные настройки клиента |

### 5.5 Server-only (apps/api)

| Сервис | Ответственность |
|--------|-----------------|
| `AuthService` | Идентичность |
| `MatchmakingService` | Поиск соперника |
| `OnlineMatchService` | Комнаты, authority loop |
| `RatingService` | Рейтинг / лестница |
| `ReplayStorageService` | Хранение истории |
| `AntiCheatValidation` | Повторная валидация армии и хода на сервере |

### 5.6 Cross-cutting

| Сервис | Ответственность |
|--------|-----------------|
| `EventBus` | Публикация DomainEvents / AppEvents подписчикам |
| `TelemetryService` | События без PII |
| `Clock` / `IdGenerator` | Инъекции для тестов и детерминизма |

---

## 6. Где хранятся данные

| Данные | Клиент | Сервер | Комментарий |
|--------|--------|--------|-------------|
| Каталог (фракции, юниты, способности, импланты) | Да (bundle) | Да (та же версия для validate) | Версия каталога в контракте |
| Черновик армии / сохранённые армии | Да (localStorage сейчас) | Да (аккаунт, later) | MVP: только клиент |
| Настройки UI / звук | Только клиент | Нет | |
| Состояние анимации / selection UI | Только клиент | Нет | Не часть `MatchState` |
| `MatchState` (local) | Да (оба таба) | Нет | Shared session store |
| `MatchState` (online) | Копия/view | **Authority** | Клиент не доверяется |
| История партии / replay | Опционально локально | Да (ranked) | |
| Аккаунт, сессия auth | Токены на клиенте | Secrets + профили | |
| Рейтинг | Кэш отображения | **Источник правды** | |
| Matchmaking очередь | Нет | Да | |
| Секреты, ключи API | Нет | Только сервер | |

**Правило:** всё, что влияет на победу/баланс в online, должно уметь валидироваться на сервере через `game-core` + тот же catalog version.

---

## 7. Какие сущности независимы

Независимы = могут эволюционировать без знания «верхних» слоёв.

| Сущность | Не зависит от |
|----------|----------------|
| `Faction`, `UnitDefinition`, `AbilityDefinition`, `ImplantDefinition` | `Match`, UI, сети |
| `MapDefinition` | Конкретной партии и игроков |
| `GameMode` definition | React / Express |
| `Action` (тип команды) | Способa доставки |
| `StatusEffect` definition | Конкретного UI-виджета |
| `PlayerProfile` (meta) | Клеток доски |

`UnitInstance` зависит от definitions по **id**, не от классов фракций.

---

## 8. Кто не должен знать друг о друге

| A не знает B | Зачем |
|--------------|--------|
| UI ↔ формулы Combat/Victory | Смена баланса не трогает JSX |
| `Faction` ↔ `Board` / `MatchEngine` | Фракция — данные идентичности |
| `AnimationService` ↔ мутация `MatchState` | Анимации только читают events |
| `ArmyBuilder` ↔ `CombatService` | Билдер не считает урон |
| `MatchSync` ↔ детали Ability Strategy | Транспорт возит opaque Action |
| `RatingService` ↔ клеточные координаты | Рейтинг слушает только результат матча |
| React components ↔ `localStorage` напрямую | Только через Save/Settings ports |
| Catalog definitions ↔ EventBus | Данные пассивны |

Разрешённые знания — через **id** и узкие интерфейсы (ports).

---

## 9. Где композиция

**Предпочтительный способ сборки игровых объектов.**

| Место | Как |
|-------|-----|
| `UnitInstance` | `identity` + `stats` + `movementProfile` + `abilitySlots` + `tags` + optional `commanderModule` / `ripperModule` |
| `ArmyLoadout` | Слоты = ссылки на definition ids + модификаторы командира (импланты) |
| `MatchState` | `board` + `units` + `turn` + `effects` + `players` + `modeId` + `mapId` |
| `GameSession` | `mode` + `players` + `matchAuthority` + `syncPort` |
| Клиентский экран Match | BoardView + Hud + Event-driven overlays (не god-component) |

Новые роли (командир, риппер, наёмник) — **модули/флаги/слоты**, а не глубокая иерархия классов «ArasakaSoldier extends Unit».

---

## 10. Где наследование

**Минимально.** Допустимо только для узких технических иерархий, не для контента фракций.

| Допустимо | Запрещено как основа дизайна |
|-----------|------------------------------|
| `Action` как discriminated union / общий базовый тип команды | `class ArasakaUnit extends Unit` на каждую фракцию |
| Общий абстрактный `MatchSyncAdapter` → Local / WebSocket | Наследование UI-экранов «ради удобства» |
| Ошибки домена: `DomainError` → `IllegalActionError` | Импланты как subclass hell |

Контент = данные + strategy по `id`, не дерево классов на 10 фракций.

---

## 11. Где фабрики

| Фабрика | Создаёт |
|---------|---------|
| `UnitInstanceFactory` | Инстанс из `UnitDefinition` + army modifiers |
| `ArmyFactory` | Пустой/дефолтный loadout фракции с обязательными слотами |
| `MatchFactory` | `MatchState` из двух армий + `mapId` + `modeId` + seed первого хода |
| `AbilityHandlerFactory` | Strategy-обработчик по `abilityId` |
| `ImplantFactory` | Модуль командира из definition ids |
| `MapFactory` | `Board` из `MapDefinition` |
| `GameSessionFactory` | Сессия под режим (local dual-tab / online) |

Фабрики живут рядом с domain/catalog, не в React-компонентах.

---

## 12. Где Strategy

| Точка расширения | Strategy |
|------------------|----------|
| Движение | `MovementStrategy` (ortho-1 сейчас; будущие профили) |
| Атака | `AttackPatternStrategy` (**TBD** формой — не хардкодить в UI) |
| Способности | `AbilityStrategy` per `abilityId` |
| Победа | `VictoryStrategy` (destroy commanders / future modes) |
| Режим игры | `GameModeStrategy` (turn rules, timers, ranked flags) |
| Риппердок | `RipperdocStrategy` per faction id |
| ИИ (later) | `AiPolicyStrategy` (easy/normal/…) |
| Синк | не strategy правил, а **Adapter** транспорта |

Регистрация: словарь `id → strategy` в composition root (DI), не `switch` по фракции размазанный по UI.

---

## 13. Где Event Bus

### Использовать

- **DomainEvents** после успешного `MatchEngine.apply`: `UnitMoved`, `UnitDamaged`, `UnitDied`, `TurnEnded`, `MatchEnded`, `AbilityResolved`…
- Подписчики: AnimationService, Audio, Telemetry, Replay recorder, UI toast
- **AppEvents**: навигация, «армия сохранена», ошибки сессии

### Не использовать

- Как замену прямому вызову внутри резолва хода (резолв — синхронный пайплайн в core)
- Для скрытой связи UI↔UI («божественная шина»)
- Для сетевого протокола (сеть = команды/снимки, events — локальная проекция)

Шина **после** детерминированного шага, не вместо него.

---

## 14. Где Dependency Injection

| Composition root | Что инжектится |
|------------------|----------------|
| `apps/web` bootstrap | Catalog, SavePort, MatchSyncPort, EventBus, services → UI через контекст/провайдер **тонким** слоем |
| `apps/api` bootstrap | те же core services + DB ports + Auth + Matchmaking |
| Тесты | Fake Clock, InMemorySave, NoopTelemetry |

**Правила DI:**

- Core-функции предпочтительно **pure** (state in → state out); сервисы-обёртки получают зависимости в конструктор/фабрику.
- UI получает **фасады** (`MatchFacade`, `ArmyFacade`), не 15 сервисов в каждом виджете.
- Не использовать Service Locator «из любого файла».

---

## 15. Архитектура игровых данных

### 15.1 Иерархия (логическая)

```text
Faction (catalog)
  └── UnitDefinition (catalog) ─── AbilityDefinition[]
        │
        ├── Commander role ─── ImplantDefinition[]
        ├── Ripperdoc role ─── RipperdocStrategy (by faction)
        └── Mercenary flag (edgerunner pool)

ArmyLoadout (meta)
  └── slots → UnitDefinition ids + commander implants

Match (runtime)
  ├── MapDefinition → Board → Cell[]
  ├── UnitInstance[] (from ArmyLoadout via Factory)
  ├── Turn + Action pipeline
  ├── StatusEffect instances
  └── CombatResolution (per action)

MatchHistory
  └── frames / events log (for replay, rating, dispute)
```

### 15.2 Связи

| От | К | Тип связи |
|----|---|-----------|
| Faction | UnitDefinition | 1→N (владение каталогом) |
| UnitDefinition | AbilityDefinition | N→M по id |
| Commander | ImplantDefinition | N→M (слоты) |
| ArmyLoadout | UnitDefinition | через слоты (ids) |
| ArmyLoadout | Faction | 1→1 выбранная фракция |
| Match | ArmyLoadout | 2 loadouts (P1/P2) копируются в инстансы |
| Match | MapDefinition | 1 mapId |
| Match | GameMode | 1 modeId |
| Action | UnitInstance | целевой/источник по instanceId |
| Ability resolve | Combat / Movement / Status | через сервисы |
| Match end | MatchHistory + (later) Rating | результат |

### 15.3 Потоки данных

1. **Контент:** дизайнеры наполняют catalog docs → данные в `game-catalog` → клиент и сервер одной версии.  
2. **Мета:** игрок собирает `ArmyLoadout` → SavePort.  
3. **Старт матча:** MatchFactory(loadouts, map, mode, seed) → `MatchState`.  
4. **Ход:** Action → validate → apply → events → sync → UI.  
5. **Финал:** Victory → History → (online) Rating.

---

## 16. Масштабируемость (без переписывания)

Практические чеклисты: **[ExtensionGuide.md](ExtensionGuide.md)** · фасад кода: `src/content/`.

| Добавление | Куда кладём (сейчас в `src/`) | Что не трогаем |
|------------|------------------------------|----------------|
| Новая фракция | `data/catalog/armyBuilder` + `theme/factionThemes` | Battle apply loop |
| Новая карта / поле | `data/catalog/maps/*.map.ts` | Movement/combat formulas |
| Правило победы | `data/catalog/victory/*.rule.ts` | UI ResultScreen API |
| Режим матча | `data/catalog/modes/*.mode.ts` | Каталог юнитов |
| SVG / обложка юнита | `public/assets/unit-icons` + `data/visual` | Domain combat |
| Способность | `data/catalog/abilities` + Ability System | Transport |
| ИИ | `domain/ai` | UI матча (тот же Action pipeline) |
| Мультиплеер online | future `apps/api` | `domain/battle` apply |

**Инварианты расширения:**

- Новый контент = **id + data + optional strategy registration**
- Новый транспорт = новый Adapter, тот же `Action`
- Новый режим = данные (map + victory + features), не fork `BattleState`

---

## 17. Дерево проекта (архитектура каталогов)

См. конец ответа пользователю и актуальные деревья в FE/BE docs. Канон монорепо:

```text
/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   ├── game-core/
│   ├── game-catalog/
│   └── shared-contracts/
├── docs/
└── tools/                    # скрипты валидации каталога, codegen (later)
```

---

## 18. Соответствие текущему коду (миграционный мост)

Сейчас код живёт в `src/` (app / content / data / domain / services / theme / ui). Целевая архитектура **не требует big-bang rewrite**:

1. Считать `src/domain` будущим `packages/game-core`.  
2. Считать `src/data/catalog` + `src/content` будущим `packages/game-catalog`.  
3. Реестры уже живые: **maps**, **victory**, **modes**, **visual**, **gameDatabase**.  
4. UI остаётся в `src/ui` → позже `apps/web`.  
5. `apps/api` появляется при online.  
6. Любой новый код писать **уже по границам** ExtensionGuide, даже до физического переноса папок.

---

## 19. Открытые архитектурные решения (не блокируют каркас)

- Форма базовой атаки (дизайн TBD) → появится как `AttackPatternStrategy`, не как переделка дерева папок.  
- Формат БД online.  
- Точный wire-protocol WebSocket (описать в API.md при старте сети).

Крупные выборы фиксировать ADR в `docs/04_engineering/adr/`.

---

## 20. Режим обновления

Да — при смене границ систем, пакетов или authority-модели. Статус документа повысить до APPROVED после ревью Tech Lead + Lead GD (на предмет соответствия GDD).
