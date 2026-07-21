# Edgerunners

| Поле | Значение |
|------|----------|
| Status | DRAFT |
| Owner | Lead Game Designer |
| Last updated | 2026-07-20 |
| Related | ArmyBuilder, Units, Balance |
| Implementation | [EdgerunnerSystem.md](../04_engineering/EdgerunnerSystem.md) |
| Full map | [DocMap.md](../00_meta/DocMap.md) |

## 1. Цель документа

Нейтральный пул наёмников: правила найма и философия. Полный ростер — позже.

## 2. Утверждённые правила

- **Не фракция.** Нейтральный пул для усиления **любой** армии
- Лимит: **не больше 2 эджраннеров на армию**
- Армия **не может** состоять только из Edgerunners
- Стоимость найма входит в общий бюджет энергии
- Имена тестовых юнитов = проверка системы, не канон-ростер

## 3. Live (архитектура)

- `type: "edgerunner"` + `factionId: pool-edgerunners`
- Роли: Solo / Netrunner / Techie / Scout / Specialist
- Тестовые: Street Solo, Ghost Netrunner, Field Techie

## 4. TBD

- Полный список имён (Джонни, Бестия, Люси…)
- Уникальные эффекты и баланс

## 5–6

Билдер, баланс разнообразия. ← GDD; → Army Builder, Units, Balance.
