# Space Chess

Пошаговая тактическая PvP («космические шахматы») на React + TypeScript + Vite.

> Шахматы умерли в XXI веке. В XXII они научились стрелять.

## Что есть

- Меню: **Играть** / **Армии** / **Настройки**
- Армии: бюджет **100**, до **16** слотов, Космодесант / Плутоны / нейтралы
- **Классический → Локальная (2 вкладки)** — оффлайн на одном ПК
- Поле **8×8**, ход как в шахматах (одно действие → ход сопернику)
- Победа: короли врага или сдача
- UI в стиле **Cyberpunk 2077**

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

| Файл | Содержание |
|------|------------|
| [docs/GAME_DESIGN.md](docs/GAME_DESIGN.md) | Концепция (источник правды) |
| [docs/DEVELOPMENT_PLAN.md](docs/DEVELOPMENT_PLAN.md) | План и статус |
| [docs/PROJECT_RULES.md](docs/PROJECT_RULES.md) | Правила разработки |
| [docs/IDEAS.md](docs/IDEAS.md) | Идеи на потом |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | История |

## Структура

```
src/
  app/           # точка входа и навигация
  data/catalog/  # герои, юниты, режимы, глифы
  domain/        # правила и типы
  services/      # армии, коллекция, движок / сессия матча
  ui/            # экраны и компоненты
  styles/        # тема Night City
```
