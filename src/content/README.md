# Content & extension layer

Точка входа для программистов и контента: `src/content/index.ts`.

## Как добавить…

| Что | Куда | Шаги |
|-----|------|------|
| Юнит | `src/data/catalog/armyBuilder/{faction}.catalog.ts` | запись + `npm run assets:svgs` |
| Фракцию | новый `*.catalog.ts` + commanders/ripperdocs | append в `armyBuilder/index.ts` + тема в `src/theme/factionThemes.ts` |
| SVG фигуры | `public/assets/unit-icons/{id}.svg` | или override в `src/data/visual/visualRegistry.ts` |
| Обложку карты-юнита | `coverImage` в `UNIT_VISUAL_OVERRIDES` | файл в `public/assets/…` |
| Игровое поле (карту) | `src/data/catalog/maps/*.map.ts` | register в `maps/index.ts` |
| Правило победы | `src/data/catalog/victory/*.rule.ts` | register + указать в mode |
| Режим матча | `src/data/catalog/modes/*.mode.ts` | mapId + victoryRuleId + features |
| Способность | `src/data/catalog/abilities/` | id на юните в `abilities: []` |
| Тему фракции | `src/theme/factionThemes.ts` | палитра / board vars |

## Слои (не путать)

```
src/content          ← façade для людей
src/data/catalog     ← данные (юниты, карты, режимы, победа)
src/data/visual      ← оверрайды картинок/классов
src/data/gameDatabase← runtime lookup юнитов/профилей
src/domain/*         ← правила и системы (без React)
src/ui/*             ← экраны; читают domain + content
src/theme            ← Theme Engine (весь UI под фракцию)
public/assets        ← SVG/PNG файлы
docs/                ← студийные docs + ExtensionGuide
```

Не кладите статы юнитов в React-компоненты. Не хардкодьте размеры поля в UI — берите из MapDefinition.
