# CyberChess: Overclock Protocol — Documentation Hub

Документация построена как в продуктовой игровой студии: онбординг на годы, команда до ~20 человек.

**Бренд:** [`03_ux/BrandIdentity.md`](03_ux/BrandIdentity.md) · код: `src/brand/brand.config.ts`

**Как расширять проект (юниты, поля, режимы, победа, визуал):**  
[`04_engineering/ExtensionGuide.md`](04_engineering/ExtensionGuide.md) · код-фасад: `src/content/`

**Код в документации не пишется.** Игровые числа, юниты и баланс появляются только после утверждения в профильных docs.

---

## С чего начать новому человеку

1. Этот файл (`README.md`)  
2. [`00_meta/DocumentationGuide.md`](00_meta/DocumentationGuide.md)  
3. [`00_overview/ProjectVision.md`](00_overview/ProjectVision.md)  
4. [`01_design/GameDesignDocument.md`](01_design/GameDesignDocument.md)  
5. [`04_engineering/Architecture.md`](04_engineering/Architecture.md)  
6. Полная карта: [`00_meta/DocMap.md`](00_meta/DocMap.md)  

---

## Дерево `docs/`

```text
docs/
├── README.md                          ← вы здесь
├── 00_meta/
│   ├── DocumentationGuide.md          Как вести docs
│   ├── DocMap.md                      Полная карта (цель, разделы, связи)
│   ├── Glossary.md                    Словарь терминов
│   └── ParkingLot.md                  Неутверждённые идеи
├── 00_overview/
│   ├── ProjectVision.md
│   ├── Roadmap.md
│   ├── RiskRegister.md
│   └── Changelog.md
├── 01_design/
│   ├── GameDesignDocument.md          Индекс дизайна
│   ├── GameLoop.md
│   ├── GameRules.md
│   ├── CombatSystem.md
│   ├── ArmyBuilder.md
│   ├── GameStates.md
│   └── Balance.md
├── 02_content/
│   ├── Factions.md
│   ├── factions/
│   │   └── Arasaka.md             # эталонная фракция (live catalog)
│   ├── Units.md
│   ├── Commander.md
│   ├── Implants.md
│   ├── Ripperdocs.md
│   ├── Edgerunners.md
│   └── ContentPipeline.md
├── 03_ux/
│   ├── BrandIdentity.md               Overclock Protocol brand
│   ├── VisualPolish.md                HUD / VFX / Audio
│   ├── UIFlow.md
│   ├── Assets.md
│   └── Localization.md
├── 04_engineering/
│   ├── Architecture.md                Общая архитектура (канон)
│   ├── ExtensionGuide.md              Как добавлять юниты / карты / режимы
│   ├── CoreStabilizationAudit.md      Аудит ядра + контракты расширения
│   ├── AbilitySystem.md               Универсальная система способностей
│   ├── RipperdocSystem.md             Система риппердоков (support role)
│   ├── CommanderSystem.md             Командир + импланты
│   ├── EdgerunnerSystem.md            Нейтральные наёмники
│   ├── AiSystem.md                    Классический ИИ противника
│   ├── AccountSystem.md               Аккаунт, сессия, прогресс
│   ├── DomainModel.md                 Сущности и связи
│   ├── PackagesArchitecture.md        game-core / catalog / contracts
│   ├── FrontendArchitecture.md
│   ├── BackendArchitecture.md
│   ├── API.md
│   ├── Multiplayer.md
│   ├── Security.md
│   ├── CodingStandards.md
│   └── adr/
│       ├── README.md
│       └── 0001-monorepo-shared-game-core.md
├── 05_quality/
│   ├── Testing.md
│   ├── Telemetry.md
│   └── DefinitionOfDone.md
├── _charter_template.md               Шаблон для новых docs
└── archive/
    └── legacy/                        Старые монолиты (GAME_DESIGN 0.4.0 и др.)
```

Полные описания (цель, разделы, зависимости, обновление) — в [`00_meta/DocMap.md`](00_meta/DocMap.md).

---

## Статусы документов

| Status | Значение |
|--------|----------|
| `CHARTER` | Каркас и назначение утверждены; тело наполняется |
| `DRAFT` | Черновик содержания, можно обсуждать |
| `APPROVED` | Можно опираться в реализации |
| `DEPRECATED` | Не использовать; см. замену |

Сейчас большинство файлов — **CHARTER** (намеренно: без выдуманных механик/баланса).

---

## Наследие

Материалы до реорганизации: [`archive/legacy/`](archive/legacy/).  
Их содержание нужно **переносить** в профильные docs, а не править как единственный источник правды.
