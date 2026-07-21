# Faction: Arasaka

| Поле | Значение |
|------|----------|
| Status | DRAFT (catalog live in Army Builder) |
| Id | `faction-arasaka` |
| Implementation | `src/data/catalog/armyBuilder/arasaka.catalog.ts` |

## Идентичность

Элитная корпорация: высокая стоимость, качество вместо количества, дисциплина, технопревосходство.

Ощущение игрока: *меньше бойцов — каждый опасен*.

## Ростер (v1)

| Id | Имя | Тип | Cost |
|----|-----|-----|------|
| arasaka-commander | Arasaka Commander | commander | 30 |
| arasaka-ripperdoc | Arasaka Clinic Ripper | ripperdoc | 20 |
| arasaka-soldier | Arasaka Trooper | regular | 12 |
| arasaka-elite | Arasaka Elite Trooper | regular | 18 |
| arasaka-cyber-ninja | Arasaka Cyber Ninja | regular | 20 |
| arasaka-heavy | Arasaka Heavy Assault | regular | 24 |
| arasaka-recon | Arasaka Recon Operative | regular | 14 |
| arasaka-adam-smasher | Adam Smasher | legendary | 38 |

Статы: HP / Attack / Defense / Movement / Range.  
Abilities: `[]` до боевой системы.

## Как добавить следующую фракцию

1. Новый файл `src/data/catalog/armyBuilder/<faction>.catalog.ts`  
2. Зарегистрировать в `armyBuilder/index.ts`  
3. Не трогать Army Builder UI  

## TBD

- Импланты командира  
- Эффекты Clinic Ripper  
- Способности Adam Smasher  
