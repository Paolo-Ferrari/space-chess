# Factions

| Поле | Значение |
|------|----------|
| Status | DRAFT |
| Owner | Lead Game Designer |
| Last updated | 2026-07-20 |
| Related | GDD, Units, Ripperdocs, Balance |
| Full map | [DocMap.md](../00_meta/DocMap.md) |

## 1. Цель документа

Идентичность **10 целевых фракций** и статус внедрения. Статы ростера — примерные (баланс позже).

## 2. Статус каталога

| Каталог | Статус |
|---------|--------|
| **Arasaka** | Live (`arasaka.catalog.ts`) |
| **Militech** | Live |
| **Maelstrom** | Live |
| **Tyger Claws** | Live |
| **Valentinos** | Live |
| **Voodoo Boys** | Live |
| **Nomads** | Live |
| **NCPD / MaxTac** | Live |
| **Animals** | Live |
| **6th Street** | Live |
| Edgerunners | Нейтральный пул (не фракция) |

Добавление фракции = новый `*.catalog.ts` + commander + ripperdoc + append в registry. **Без** правок Army Builder / Battle / Unit / Commander / Ability System.

## 3. Стили (утверждённое направление)

| Фракция | Стиль | Особенности |
|---------|--------|-------------|
| Arasaka | Элита | Дорогие фигуры, киберниндзя |
| Militech | Военная машина | Танки, броня, дальняя мощь |
| Maelstrom | Хаос | Риск, высокая атака |
| Tyger Claws | Скорость | Манёвры, ближний бой |
| Valentinos | Команда | Бафы, поддержка рядом |
| Voodoo Boys | Нетран | Контроль, Slow, дистанция |
| Nomads | Мобильность | Перемещение, техника |
| NCPD / MaxTac | Порядок | Щиты, подавление зон |
| Animals | Сила | Высокий HP, ближний бой |
| 6th Street | Огонь | Дальний бой, укрепления |

## 4. Состав каждой фракции (минимум)

- Faction Data
- Commander (+ implant slots)
- Ripperdoc (heal/buff kit или reserved slots)
- ≥5 обычных/special юнитов
- ≥1 legendary

## 5. TBD

- Финальный баланс цифр
- Уникальные способности фракций (сейчас переиспользуются test abilities)

## 6–7

Контент, арт, баланс, билдер. ← Vision, GDD; → Units, Ripperdocs, Balance, Assets.
