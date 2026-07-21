# Edgerunner System

| Поле | Значение |
|------|----------|
| Status | DRAFT |
| Owner | Lead Software Architect + Lead GD |
| Implementation | `src/domain/edgerunner`, `src/data/catalog/edgerunners` |

## Принцип

Edgerunners — **нейтральный пул** наёмников. Не фракция.

- На поле: `UnitDefinition` / `UnitRuntime` с `type: "edgerunner"`.
- Профиль: `EdgerunnerDefinition` (role, availability).
- Способности: через **Ability System**.
- Найм: в `Army.unitIds` вместе с юнитами фракции.

## Правила

| Правило | Значение |
|---------|----------|
| Лимит | `ARMY_MAX_EDGERUNNERS` = 2 |
| Совместимость | любая фракция |
| Только наёмники | запрещено (`edgerunners_only`) |
| Дубликат того же id | запрещён |

## Роли

`solo` · `netrunner` · `techie` · `scout` · `specialist`

## Тестовый пул (не ростер)

| Unit id | Role | Ability |
|---------|------|---------|
| `edge-solo-blade` | solo | Power Strike |
| `edge-netrunner-ghost` | netrunner | Slow |
| `edge-techie-wrench` | techie | Heal |

## Новый Edgerunner

1. Unit + profile в `src/data/catalog/edgerunners/*.catalog.ts`  
2. Append в registry  

Не менять BattleManager / EdgerunnerSystem API ради контента.

## UI

`EdgerunnerHirePanel` в Army Builder — раздел «Наёмники».
