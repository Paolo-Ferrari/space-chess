# Assets

| Поле | Значение |
|------|----------|
| Status | ACTIVE |
| Owner | Art Lead / Tech Lead |
| Last updated | 2026-07-21 |
| Related | Units, UIFlow, Factions |
| Full map | [DocMap.md](../00_meta/DocMap.md) |

## 1. Цель документа

Конвенции хранения арта. Юнит-арты — обычные PNG, не Base64.

## 2. Два канала визуала юнитов

### 2.1 Игровое поле (фракционные пиктограммы)

| Правило | Значение |
|---------|----------|
| Технология | SVG-файлы + `<img>` |
| Папка | `public/assets/unit-icons/{unitId}.svg` |
| Компонент | `UnitIcon` → `UnitToken` / Deployment |
| Оверрайды | `src/data/visual/visualRegistry.ts` (unit / group / faction) |
| Тема UI | `src/theme` Theme Engine |
| Генерация | `npm run assets:svgs` |

Обложки карточек (большие арты): `coverImage` в visual overrides → `public/assets/…`.  
Расширение: [ExtensionGuide.md](../04_engineering/ExtensionGuide.md).

### 2.2 Army Builder / карточки (полноценные арты)

| Правило | Значение |
|---------|----------|
| Папка | `public/assets/units/` |
| Имя файла | `{unitId}.png` |
| Ссылка в данных | `imagePath: "/assets/units/{unitId}.png"` |
| UI | `UnitPortrait` (Army Builder, карточки) |

```bash
node scripts/generate-unit-placeholders.mjs
```

## 3. Типы ассетов (остальное)

- UI / brand — `src/styles`, `public/favicon.svg`
- SFX — `AudioManager` (Web Audio), файлы позже
- Faction colors — `src/ui/visual/factionTheme.ts`

## 4. Связь с unit id

`UnitDefinition.imagePath` — единственный контракт между данными и UI.
