# Brand Identity — CyberChess: Overclock Protocol

| Поле | Значение |
|------|----------|
| Status | ACTIVE |
| Owner | Product / UI |
| Last updated | 2026-07-21 |
| Code source | `src/brand/brand.config.ts` |

## Product names

| Role | Value |
|------|-------|
| Full | CyberChess: Overclock Protocol |
| Short | Overclock |
| Wordmark | OVERclock |

Единый источник строк: `src/brand/brand.config.ts` (`BRAND`, `BRAND_TERMS`, `BRAND_STATUS`).  
UI не должен хардкодить название игры вне этого модуля.

## Visual system

- Style: Cyberpunk + Tactical Chess + Futuristic Military Interface
- Palette: CP yellow `#fcee0a`, cyan `#00f0ff`, magenta `#ff2a6d`, deep `#050506`
- Type: Oxanium (display), Rajdhani (body), Share Tech Mono (HUD)
- Logo mark: chess king fused with cyber implant, circuit nodes, overload arcs

## Logo variants

| Variant | Component prop | Use |
|---------|----------------|-----|
| Full | `Logo variant="full"` | Main menu, boot |
| Mark | `Logo variant="mark"` | Favicon-adjacent, compact chrome |
| Mono | `Logo variant="mono"` | Loading footer, docs, print/UI ink |

Components:

- `src/ui/brand/Logo`
- `src/ui/brand/BrandHeader`
- `src/ui/brand/SystemBanner`
- `src/ui/brand/LoadingScreen`

Theme tokens: `src/styles/variables.css`, `src/styles/brand.css`, `src/brand/theme.ts`.

## In-game naming

| Concept | Brand term (EN) | RU UI |
|---------|-----------------|-------|
| Match | Protocol Match | Протокол-матч |
| Army | Combat Network | Боевая сеть |
| Commander | Neural Commander | Нейро-командир |
| Implants | Cyber Modules | Кибер-модули |
| Edgerunners | Independent Operators | Независимые операторы |

## System messages

- `SYSTEM READY`
- `OVERCLOCK ENABLED`
- `NEURAL LINK ACTIVE`
- `CORE TEMPERATURE CRITICAL`
- `BOOT SEQUENCE COMPLETE`

## Boot flow

`App` shows `LoadingScreen` once, then main menu with `BrandHeader` + product title from config.
