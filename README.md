# Space Chess

Пошаговая тактическая PvP («космические шахматы») на React + TypeScript + Vite.

> Шахматы умерли в XXI веке. В XXII они научились стрелять.

## Что есть сейчас (MVP)

- Меню: **Играть** / **Армии** / **Настройки**
- Армии: бюджет **100**, до **16** слотов (временный каталог Космодесант / Плутоны)
- **Классический → Локальная (2 вкладки)** — оффлайн на одном ПК
- Поле **8×8**, ход как в шахматах (одно действие → ход сопернику)
- Победа: командиры/короли или сдача
- UI в стиле **Cyberpunk 2077**

## Целевой мир (в docs, ещё не в каталоге)

10 фракций Night City, эджраннеры (до 2), командир с имплантами, риппердок по фракции — см. [docs/README.md](docs/README.md) и [GDD](docs/01_design/GameDesignDocument.md).

## Запуск

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## Документация

Старт: **[docs/README.md](docs/README.md)**  
Полная карта: **[docs/00_meta/DocMap.md](docs/00_meta/DocMap.md)**

| Раздел | Путь |
|--------|------|
| Vision / Roadmap | `docs/00_overview/` |
| Дизайн | `docs/01_design/` |
| Контент | `docs/02_content/` |
| UX | `docs/03_ux/` |
| Инженерия | `docs/04_engineering/` |
| Качество | `docs/05_quality/` |
| Архив | `docs/archive/legacy/` |

## Структура кода

```
src/
  app/           # точка входа и навигация
  data/catalog/  # герои, юниты, режимы, глифы
  domain/        # правила и типы
  services/      # армии, коллекция, движок / сессия матча
  ui/            # экраны и компоненты
  styles/        # тема Night City
```
