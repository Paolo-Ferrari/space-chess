# Domain Model

| Поле | Значение |
|------|----------|
| Status | DRAFT |
| Owner | Lead Software Architect + Lead Game Designer |
| Last updated | 2026-07-20 |
| Related | Architecture, GDD, Game Rules, Combat, Army Builder |
| Full map | [DocMap.md](../00_meta/DocMap.md) |

> Модель сущностей без кода и без выдуманных боевых цифр.  
> Числа/формулы — только из design docs после утверждения.

---

## 1. Слои сущностей

| Слой | Примеры | Жизненный цикл |
|------|---------|----------------|
| **Catalog** | Faction, UnitDefinition, AbilityDefinition, ImplantDefinition, MapDefinition, GameMode | Версионируется с билдом |
| **Meta** | PlayerProfile, ArmyLoadout, Rating, MatchHistory summary | Вне матча; persist |
| **Match** | MatchState, Board, Cell, UnitInstance, Turn, Action, StatusEffect | Живёт во время партии |
| **Presentation** (не домен) | Selection, Hover, AnimationQueue | Только клиент |

---

## 2. Каталог сущностей

### Player / PlayerProfile

- **Смысл:** участник игры (человек, later AI, later spectator owner).  
- **Поля (логические):** id, displayName, locale prefs ref, (server) accountId.  
- **В матче:** ссылка `playerId` → сторона (P1/P2).  
- **Не содержит:** армию как единственный источник; армия — отдельная сущность.

### Faction

- **Catalog.** id, name key, identity tags, roster unit ids, default ripperdoc id.  
- **Не знает:** Board, MatchEngine.  
- **Связи:** 1→N UnitDefinition; 1→1 ripperdoc definition id.

### UnitDefinition

- **Catalog.** id, factionId | `neutral/mercenary`, role tags, cost, base stats **(когда утверждены)**, ability ids, movement profile id, attack pattern id (**TBD**), glyph/asset refs.  
- **Не является** фигурой на доске.

### UnitInstance

- **Match.** instanceId, definitionId, ownerPlayerId, position, current stats, statusEffect ids, flags (`isCommander`, `isRipperdoc`, `isMercenary`).  
- Создаётся фабрикой из ArmyLoadout при старте матча.

### Commander

- Не отдельный «класс фракции», а **роль/модуль** на UnitInstance + данные в loadout: `implantIds[]`.  
- Связь с победой — через VictoryStrategy (см. Game Rules).

### Ripperdoc

- Роль обязательного слота армии; поведение — `RipperdocStrategy` по factionId (дизайн в Ripperdocs.md).  
- На доске — UnitInstance с флагом роли.

### Mercenary (Edgerunner)

- Catalog pool `factionId = neutral`; в ArmyLoadout лимит ≤ 2 (Army Builder).  
- В матче — обычный UnitInstance с тегом mercenary.

### Implant / ImplantDefinition

- Catalog; **только Commander**.  
- Loadout хранит выбранные id; в матче модификаторы применяются фабрикой инстанса командира.

### Ability / AbilityDefinition

- Catalog: id, targeting rules ref, cost/cooldown fields (**когда утверждены**), strategy id.  
- Runtime: AbilityService + AbilityStrategy; не хранит UI.

### Army / ArmyLoadout

- Meta: id, owner ref, factionId, name, slots[], commanderImplantIds, version.  
- Slot: definitionId, index, optional metadata.  
- Валидация — ArmyValidationService (бюджет 100, ≤16 slots, обязательные роли — по docs).

### MapDefinition / Board / Cell

- **MapDefinition (catalog):** size (сейчас 8×8), tile rules, spawn zones, cosmetics id.  
- **Board (match):** сетка Cell.  
- **Cell:** coord, occupantInstanceId?, terrain tags (future).  
- Координаты — единый тип (file/rank); UI только отображает.

### Game / GameSession

- Оболочка: modeId, players[], authority port, sync port, optional matchId.  
- Может существовать до создания MatchState (ожидание второго игрока).

### GameMode

- Catalog/strategy: local-duel, online-casual, ranked (later), ai (later).  
- Влияет на Turn/Victory/timers, не на список фракций.

### Match / MatchState

- Полный снимок партии: board, units, turn, effects, result?, catalogVersion, rng seed (если нужен).  
- Единственный объект, который двигает MatchEngine.

### Turn

- number, activePlayerId, phase (select | resolve | ended — уточнять в GameStates).  
- Не хранит историю всех ходов (история — отдельно).

### Action

- Дискриминированный тип команды: Move | Attack | Ability | Skip | Surrender (+ будущие).  
- Поля: actorInstanceId?, target, abilityId?, path/coord….  
- Транспорт возит Action; core применяет Action.

### StatusEffect

- Definition (catalog) + Instance (match: targetInstanceId, remaining, stacks…).  
- Тик — StatusEffectService на границах хода (когда правила утвердят).

### CombatResolution

- Результат одного боевого резолва: damages[], deaths[], flags.  
- Не долгоживущая сущность; попадает в events / history.

### MatchHistory / ReplayFrame

- Упорядоченный лог: initial snapshot + actions (или events).  
- Для replay, споров online, аналитики.

### Rating

- Server meta (later): playerId, modeId, value, uncertainty….  
- Обновляется только по завершённым authoritative матчам.

### Battle

- **Не отдельная долгоживущая сущность.** «Бой» = процесс CombatService внутри матча.  
- В речи дизайна «battle» = match; в модели используем `Match`.

---

## 3. Диаграмма связей (логическая)

```text
PlayerProfile ──owns──► ArmyLoadout ──refs──► Faction
                              │
                              ├──slots──► UnitDefinition ──refs──► AbilityDefinition
                              └──commander──► ImplantDefinition

GameSession ──mode──► GameMode
     │
     └──creates──► MatchState ──map──► MapDefinition
                        │
                        ├── Board ── Cell
                        ├── UnitInstance ──refs──► UnitDefinition
                        ├── Turn
                        ├── StatusEffect instances
                        └── applies Action ──► CombatResolution (ephemeral)
                                   │
                                   ▼
                            MatchHistory
                                   │
                                   ▼
                               Rating (server, later)
```

---

## 4. Инварианты

1. Catalog id стабильны; удаление = deprecate, не silent reuse.  
2. MatchState не хранит React nodes / DOM / animation.  
3. UnitDefinition не хранит position.  
4. UI selection не является частью MatchState.  
5. Online: сервер принимает Action, клиент не назначает урон сам.  
6. Версия каталога в MatchState обязательна для replay.

---

## 5. Расширение

Новая сущность контента → сначала docs (`Units` / `Factions` / …) → catalog entry → optional strategy → factory умеет создать instance.  
Не добавлять сущность только потому, что «в Unity так принято».
