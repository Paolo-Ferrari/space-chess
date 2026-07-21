# Testing

| Поле | Значение |
|------|----------|
| Status | DRAFT |
| Owner | Tech Lead |
| Last updated | 2026-07-20 |
| Related | Rules, Combat, API |
| Full map | [DocMap.md](../00_meta/DocMap.md) |

## 1. Цель документа

Стратегия тестов: что обязательно покрывать.

## 2. Политика (направление)

| Уровень | Фокус |
|---------|--------|
| Unit | Правила хода, победы, валидации армии |
| Integration | Match session / engine переходы |
| E2E (позже) | Критические UI-флоу: старт локального матча, сдача |

Обязательный регресс при изменении Game Rules / Combat / Army Builder.

## 3. TBD

- Выбор раннера и CI gates
- Покрытие online

## 4–6

CI, рефакторинг движка. ← Rules, Combat, API; → Roadmap, DoD. Обновление: да.
