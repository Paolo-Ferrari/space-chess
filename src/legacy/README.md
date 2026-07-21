# Legacy code (not the live path)

These modules belong to an earlier match/army prototype and are **not** used by the current App shell (`Army Builder` + `domain/battle`).

Do not extend them. Prefer:

| Concern | Live path |
|---------|-----------|
| Catalog / factions | `src/data/catalog/armyBuilder` + `FactionSystem` / `UnitSystem` |
| Army build / save | `src/domain/armyBuilder` + `services/armyBuilder` |
| Battle | `src/domain/battle` + `EventBus` |
| App screens | `src/ui/screens/*` |

Legacy locations still in the tree (until a cleanup PR):

- `src/domain/match/**`
- `src/services/match/**`
- `src/services/army/**` (old hero armies)
- `src/ui/match/**`, `src/ui/armies/**`, `src/ui/menu/PlayScreen`, etc.
