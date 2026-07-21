# Architecture Decision Records (ADR)

| Поле | Значение |
|------|----------|
| Status | DRAFT |
| Owner | Lead Software Architect |
| Last updated | 2026-07-20 |
| Related | Architecture |
| Full map | [DocMap.md](../../00_meta/DocMap.md) |

## Зачем

Фиксировать **почему** принято архитектурное решение. Через год команда не теряет контекст.

## Как вести

1. Файл: `NNNN-short-title.md` (номер по порядку)
2. Статусы ADR: Proposed → Accepted → Superseded
3. Старые ADR **не переписывать** — помечать Superseded и ссылаться на новый

## Шаблон ADR

```markdown
# NNNN. Title

Date: YYYY-MM-DD
Status: Proposed | Accepted | Superseded by NNNN

## Context
## Decision
## Consequences
```

## Известные решения к переносу в ADR

- Локальный матч через BroadcastChannel + localStorage (вместо WebSocket на MVP)
- Поле 8×8
- (далее — по мере решений)
