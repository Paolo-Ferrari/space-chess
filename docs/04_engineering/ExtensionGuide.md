# Extension Guide — как расширять Overclock Protocol

| Поле | Значение |
|------|----------|
| Status | ACTIVE |
| Owner | Tech Lead |
| Last updated | 2026-07-21 |
| Related | Architecture, ContentPipeline, DomainModel, Assets |
| Full map | [DocMap.md](../00_meta/DocMap.md) |

## 1. Цель

Один документ для программиста: куда класть новый контент и правила, **не ломая** battle engine.

Код-фасад: `src/content/index.ts` (+ `src/content/README.md`).

## 2. Карта слоёв

| Слой | Путь | Можно менять часто? |
|------|------|---------------------|
| Контент (данные) | `src/data/catalog/**` | Да |
| Визуал-оверрайды | `src/data/visual/**` | Да |
| Файлы артов | `public/assets/**` | Да |
| Theme UI | `src/theme/**` | Да |
| Domain системы | `src/domain/**` | Осторожно — контракты |
| UI экраны | `src/ui/**` | Да, без статов юнитов |
| Docs | `docs/**` | Да |

## 3. Чеклисты

### Новый юнит

1. Запись в `src/data/catalog/armyBuilder/{faction}.catalog.ts`
2. `npm run assets:svgs` (или свой SVG в `public/assets/unit-icons/{id}.svg`)
3. Опционально: `UNIT_VISUAL_OVERRIDES` / coverImage
4. Опционально: abilities / commander / ripperdoc / legendary profile

### Новая фракция

1. `*.catalog.ts` + commander + ripperdoc
2. Append в соответствующие `index.ts`
3. Тема: `src/theme/factionThemes.ts`
4. Docs: `docs/02_content/factions/{Name}.md`

### Новое поле (карта)

1. `src/data/catalog/maps/{id}.map.ts` — width/height + deployment zones
2. Register в `maps/index.ts`
3. Режим указывает `mapId`

### Новое правило победы / поражения

1. `src/data/catalog/victory/{id}.rule.ts` — функция `evaluate`
2. Register в `victory/index.ts`
3. Режим указывает `victoryRuleId`

### Новый режим

1. `src/data/catalog/modes/{id}.mode.ts` — map + victory + features
2. Register в `modes/index.ts`
3. UI / GameManager читает `getMatchMode(id)`

### Сменить SVG / стиль одной / группы / фракции

| Масштаб | Файл |
|---------|------|
| Одна фигура | заменить `public/assets/unit-icons/{id}.svg` или `UNIT_VISUAL_OVERRIDES` |
| Группа | `GROUP_VISUAL_OVERRIDES` + `UNIT_VISUAL_GROUPS` |
| Фракция | `FACTION_VISUAL_OVERRIDES` + Theme Engine |

### Обложка карты-юнита (большой арт)

`UNIT_VISUAL_OVERRIDES[unitId].coverImage = "/assets/covers/….png"`  
UI карточек читает через `resolveUnitVisual`.

### Новая способность / механика геймплея

1. Ability catalog + Ability System (домен)
2. Id на юните / импланте / legendary module
3. Не дублировать логику в React

### Новый вариант деплоя

Зоны живут в `MapDefinition.deploymentP0/P1`.  
Разные карты = разные схемы установки фигур без правок Army Builder UI.

## 4. Чего не делать

- Хардкод статов/имён в `src/ui`
- Switch по всем unitId в battle engine
- Base64-арты в коде
- Копировать battle loop под каждый режим — режимы = данные + тонкие стратегии

## 5. Скроллбары / UI chrome

Глобально: `src/styles/scrollbars.css` (цвет от Theme Engine).  
Тема фракции: `ThemeEngine.apply(factionId)` в `App`.
