# Ripperdoc System

| Поле | Значение |
|------|----------|
| Status | DRAFT |
| Owner | Lead Software Architect + Lead GD |
| Implementation | `src/domain/ripperdoc`, `src/data/catalog/ripperdocs` |

## Принцип

Ripperdoc — **роль поддержки** поверх Unit (композиция).

- На поле: обычный `UnitRuntime` с `type: "ripperdoc"`.
- Профиль фракции: `RipperdocDefinition` (радиус, action kit → ability ids).
- Эффекты: только через **Ability System**.

## Action kinds

`healing` · `repair` · `buff` · `remove_effect` · `modification`

Слоты с `abilityId: null` — зарезервированы под другие фракции (без кода боя).

## Arasaka (live)

| Action | Ability |
|--------|---------|
| healing | `ability-heal` |
| buff | `ability-armor-boost` |
| repair / remove_effect / modification | reserved |

`supportRadius: 1`

## Новая фракция

1. Unit `type: "ripperdoc"` в faction catalog  
2. `*.ripperdoc.ts` + registry  
3. Ability ids в Ability catalog  

Не менять BattleManager / RipperdocSystem API.
