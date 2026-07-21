# Changelog

| Поле | Значение |
|------|----------|
| Status | DRAFT |
| Owner | Tech Lead |
| Last updated | 2026-07-21 |
| Related | Releases |
| Full map | [DocMap.md](../00_meta/DocMap.md) |

## Формат

Keep a Changelog-стиль: Added / Changed / Fixed / Docs.

## 2026-07-21 — Visual Polish

### UI / Audio

- Design system `visual.css` + city atmosphere
- Battle: UnitToken, cell states, BattleFxLayer, CommanderCombatCard, Adam Smasher card
- AudioManager (Web Audio SFX + menu drone)
- TutorialBanner + settings audio wiring
- Main menu path: Играть / Армия / Коллекция / Профиль / Настройки

### Docs

- `03_ux/VisualPolish.md`

## 2026-07-21 — Balance System

### Balance

- `BALANCE_CONFIG` + `BalanceSystem` — единый источник чисел
- Combat Capacity taxes (implants / legendary modules)
- Damage uses catalog Defense × coefficient
- Adam Smasher / commander implant caps
- Faction ± profiles; commander style presets
- AI vs AI suite: `runDefaultBalanceSuite`

### UI

- ArmyBudgetBar, StatComparePanel, faction strengths in Deployment

### Docs

- `01_design/Balance.md`

## 2026-07-21 — Advanced Army Builder (Deployment)

### Gameplay

- Deployment Board: drag-and-drop formation on A1–H2
- Army saves `placements` → battle spawns on the same cells
- `CommanderPanel` + `ImplantPanel` for Neural Commander
- `LegendarySystem` + Adam Smasher combat modules (separate from commander implants)

### UI

- Army Deployment screen: Available Units · Board · Unit/Commander/Legendary panels
- Save / Start Match footer

### Docs

- `01_design/ArmyBuilder.md` updated

## 2026-07-21 — Brand Identity (Overclock Protocol)

### Brand

- Product rename: **CyberChess: Overclock Protocol** (short: Overclock)
- Single config: `src/brand/brand.config.ts` (+ theme tokens)
- Logo (full / mark / mono), BrandHeader, SystemBanner, LoadingScreen
- Favicon + document title updated
- UI naming: Protocol Match, Combat Network, Neural Commander, Cyber Modules, Independent Operators

### Docs

- `03_ux/BrandIdentity.md`

## 2026-07-21 — Player Account & Progress

### Engine / Services

- AuthService (register/login/logout/session) + PBKDF2 password hashing
- AccountStore (local users / sessions / matches tables)
- MatchHistoryService + profile stats
- Army.ownerId — армии привязаны к аккаунту

### UI

- Профиль, Мои армии, История матчей, Auth
- Главное меню обновлено; прогресс восстанавливается после перезапуска

## 2026-07-21 — AI opponent

### Engine

- AiManager + Decision / Evaluation / Strategy (aggressive, defensive, tactical)
- Difficulty Easy / Normal / Hard — только эвристики, без ML
- Исполнение только через BattleManager

### UI

- Режим «Игрок против ИИ» + выбор сложности
- Hotseat без ИИ сохранён

## 2026-07-20 — Full faction roster

### Content

- Добавлены live-каталоги: Militech, Maelstrom, Tyger Claws, Valentinos, Voodoo Boys, Nomads, NCPD/MaxTac, Animals, 6th Street
- У каждой: Commander, Ripperdoc, ≥5 lineup + legendary (примерные статы)
- Registry append only — ядро билдера/боя не менялось

### Docs

- Обновлён `02_content/Factions.md`

## 2026-07-20 — Edgerunner System

### Engine

- EdgerunnerSystem + neutral pool catalog (Solo / Netrunner / Techie test hires)
- Army validation: max 2, no edgerunners-only, unique hire ids
- Army Builder: раздел «Наёмники»; бой и Ability System без отдельной ветки

### Docs

- `02_content/Edgerunners.md`; `04_engineering/EdgerunnerSystem.md`

## 2026-07-20 — Commander + Implant System

### Engine

- CommanderSystem + Implant / Commander catalogs (Arasaka, 4 test implants)
- `Army.commanderImplantIds` → battle `UnitRuntime.implantIds` (commander only)
- Effective combat stats via implants; Ability System reads implant-granted ids
- Army Builder: CommanderSetupPanel (slots, install, live stat delta)

### Docs

- `02_content/Commander.md`, `Implants.md`; `04_engineering/CommanderSystem.md`

## 2026-07-20 — Core stabilization

### Engine

- Разделены Static / Runtime / UI state (selection вынесен из BattleState)
- EventBus + GameEvents (Move/Attack/Damage/Destroy/Turn/Battle)
- FactionSystem / UnitSystem / GameManager / match snapshot persistence
- Vitest: 7 тестов ядра (армия, ход, атака, победа, поражение)
- Legacy path задокументирован в `src/legacy/README.md`

## 2026-07-20 — Architecture v1 (design only)

### Docs

- Зафиксирована целевая архитектура монорепо: `apps/web`, `apps/api`, `packages/game-core|game-catalog|shared-contracts`
- Добавлены DomainModel, PackagesArchitecture; расширены Architecture / FE / BE
- ADR 0001: shared game-core + MatchAuthority port
- Код не менялся

## 2026-07-20 — Docs studio structure

### Docs

- Введена студийная структура `docs/` (`00_meta` … `05_quality`, `archive/legacy`)
- Добавлены DocMap, DocumentationGuide, Glossary, ParkingLot
- Обязательные и дополнительные charter/draft документы созданы
- Legacy монолиты перенесены в `archive/legacy/`

История до реорганизации: [`archive/legacy/CHANGELOG.md`](../archive/legacy/CHANGELOG.md).
