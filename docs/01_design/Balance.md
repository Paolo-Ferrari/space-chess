# Balance — CyberChess: Overclock Protocol

| Поле | Значение |
|------|----------|
| Status | ACTIVE |
| Owner | Lead Game Designer |
| Last updated | 2026-07-21 |
| Code | `src/data/balance/balance.config.ts` · `src/domain/balance` |

## Принцип

Все туновые числа живут в **Balance Config**.  
Менять стоимость / HP / урон / формулы — в конфиге, не в боевом коде.

## Combat Capacity

- Бюджет армии: **100**
- Слоты: **16**
- Edgerunners: **max 2**
- Legendary: **max 1**
- Налог имплантов Командира и модулей легенды входит в Capacity

## Боевая математика

```
damage = max(minDamage, floor(attack - defense * coeff - statusDefense))
```

Параметры: `BALANCE_CONFIG.combat`  
(`catalogDefenseCoefficient`, `minDamage`, …)

## Роли

| Роль | Идея |
|------|------|
| infantry | Дешёвые универсалы |
| heavy | Много HP, дорого |
| scout | MOV / RNG, контроль карты |
| support | Лечение / баффы |
| legendary | Сильные, съедают бюджет |
| commander / edgerunner | Уникальные ограничения |

## Adam Smasher

- Высокая стоимость (~42 EN)
- Сниженные статы относительно «иммортала»
- 3 слота боевых модулей + caps на ATK/HP от модулей
- Налог модулей на Capacity
- Не заменяет полноценную армию

## Командир и импланты

- Caps на суммарный прирост HP / ATK / DEF от имплантов
- Energy tax за сильные модули
- Пресеты стилей: агрессивный / защитный / хакерский

## Фракции

Профили ± в `BALANCE_CONFIG.factions` (UI Army Deployment).

## Симуляции

`runDefaultBalanceSuite()` / `simulateMatchup()` — AI vs AI, win rate, avg turns, флаг `dominant`.

## Changelog баланса

| Дата | Изменение |
|------|-----------|
| 2026-07-21 | v1: Balance Config, defense in damage, Smasher/implants/edgerunner retune, sims |
