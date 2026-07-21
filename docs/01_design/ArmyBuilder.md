# Advanced Army Builder — Deployment

| Поле | Значение |
|------|----------|
| Status | ACTIVE |
| Owner | Gameplay / Frontend |
| Last updated | 2026-07-21 |
| Code | `src/domain/deployment`, `src/ui/armyBuilder`, `ArmyBuilderScreen` |

## Idea

Army prep is a mini battle board. Player builds a chess-like formation in the deployment zone before Protocol Match.

## Layout (Army Deployment)

| Zone | Content |
|------|---------|
| Left | Available Units (drag source) |
| Center | Deployment Board 8×8 |
| Right | Unit info + Neural Commander + Legendary customizer |
| Bottom | Energy / slots, Save, Start Match |

## Deployment rules

- Player zone: chess ranks **1–2** → board `y = 7..6` (cells A1–H2)
- Drag from catalog → free cell
- Drag between cells → move / swap
- Save stores `placements[]` with composition, commander implants, legendary modules

## Battle handoff

`createBattleFromArmy` reads `Army.placements` and spawns P0 units on those coordinates.

## Commander vs Adam Smasher

| | Neural Commander | Adam Smasher (legendary) |
|--|------------------|---------------------------|
| Customization | Universal Cyber Modules (`commanderImplantIds`) | Combat modules (`legendaryModuleIds`) |
| Categories | offensive / defensive / … | weapon_system, armor_upgrade, combat_cyber, body_enhancement |
| System | `CommanderSystem` | `LegendarySystem` (extensible profiles) |

## Components

- `DeploymentBoard` / `DeploymentCell`
- `DraggableUnitCard`
- `CommanderPanel` / `ImplantPanel`
- `LegendaryPanel`
