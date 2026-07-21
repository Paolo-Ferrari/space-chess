# Coding Standards

| Поле | Значение |
|------|----------|
| Status | DRAFT |
| Owner | Tech Lead |
| Last updated | 2026-07-20 |
| Related | Architecture, Testing |
| Full map | [DocMap.md](../00_meta/DocMap.md) |

## 1. Цель документа

Единый стиль и запреты для TypeScript / React / Node.

## 2. Обязательные правила проекта

1. **Нет механик вне docs.** Если правила нет в APPROVED/DRAFT профильном документе — спросить, не выдумывать.
2. TypeScript strict-мышление: явные типы на границах domain/API.
3. UI ≠ rules: игровая логика в `domain` / `services`, не в JSX «на глаз».
4. Имена и структура папок — как в Frontend/Backend Architecture.
5. PR: описание «зачем»; ссылка на docs, если меняется поведение игры.
6. Не коммитить секреты.

Наследие соглашений: [`archive/legacy/PROJECT_RULES.md`](../archive/legacy/PROJECT_RULES.md).

## 3. TBD

- Линтеры/форматтеры как единый конфиг команды
- Чеклист code review (расширенный)

## 4–6

Каждый PR. ← Architecture; → Testing, DoD. Обновление: периодически.
