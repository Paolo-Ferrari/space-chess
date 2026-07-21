# Risk Register

| Поле | Значение |
|------|----------|
| Status | DRAFT |
| Owner | Tech Lead |
| Last updated | 2026-07-20 |
| Related | Vision, Roadmap |
| Full map | [DocMap.md](../00_meta/DocMap.md) |

## 1. Цель документа

Фиксировать риски scope / legal / tech и меры смягчения.

## 2. Известные риски (начальный список)

| Риск | Тип | Митигация |
|------|-----|-----------|
| Эстетика/имена близки к CDPR IP | Legal | Роли как классы; юридическая проверка перед коммерциализацией; не позиционировать как официальный продукт CDPR |
| Scope creep механик без docs | Process | Coding Standards + DoD: нет механик вне docs |
| Миграция каталога ломает сейвы армий | Tech | Версионирование persistence; миграции в Content Pipeline |
| Online без authority = читы | Security | Authoritative server + Security.md до публичного online |
| Одиночный разработчик → команда 20 | Org | Docs-first онбординг; ADR; Glossary |

## 3. Режим обновления

На каждый major milestone.
