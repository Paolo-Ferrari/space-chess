# Account & Progress System

| Поле | Значение |
|------|----------|
| Status | DRAFT |
| Owner | Lead Software Architect |
| Implementation | `src/domain/account`, `src/services/account` |

## Принцип

Локальный прогресс с архитектурой, готовой к HTTP/DB:

| Слой | Сейчас | Позже |
|------|--------|-------|
| Domain | `PlayerAccount`, `MatchHistoryEntry`, stats | shared-contracts |
| Application | `AuthService`, `MatchHistoryService`, `ProgressService` | `apps/api` use-cases |
| Infra | `AccountStore` (localStorage DB snapshot) | Postgres / Redis |
| Security | PBKDF2 password hash + session token | server auth |

**Не входит:** магазин, донат, боевой пропуск, рейтинг.

## Данные аккаунта

- id, displayName, createdAt
- settings (сложность по умолчанию, locale)
- stats (wins / losses / draws / favorite faction & mode)

## Auth

- register / login / logout / getSession
- пароль **не** хранится в открытом виде
- сессия: token + expiry (30 дней)

## Армии

`Army.ownerId` привязывает loadout к аккаунту.  
Сохранение через `saveArmyDraft(draft, { ownerId })`.

## Match History

Запись при завершении матча (если есть сессия): дата, противник, результат, армия, длительность, ходы.

## UI

Главное меню: Профиль · Мои армии · История матчей (+ вход/регистрация).

## Расширение

Рейтинг / матчмейкинг / друзья / турниры / достижения — новые таблицы и сервисы рядом, без переписывания профиля.
