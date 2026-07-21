# Visual Polish — CyberChess: Overclock Protocol

| Поле | Значение |
|------|----------|
| Status | ACTIVE |
| Last updated | 2026-07-21 |
| Code | `src/styles/visual.css`, `src/ui/battle/*`, `src/services/audio` |

## Design system

- Dark HUD + neon accents (yellow / cyan / magenta)
- Atmosphere city backdrop (`.atmosphere-city`)
- Motion: `oc-strike`, `oc-heal-rise`, `oc-hack-flow`, `oc-shield-ring`, `oc-shutdown`
- `prefers-reduced-motion` respected

## Battle visuals

| Piece | Path |
|-------|------|
| Unit tokens | `UnitToken` — faction color, HP bar, statuses, Smasher scale |
| Cell states | move / attack / ability / ally / enemy / effect |
| VFX layer | `BattleFxLayer` — capped CSS bursts from GameEvents |
| Commander card | `CommanderCombatCard` |

## Audio

`AudioManager` — Web Audio synth (no asset pack required):

- menu drone music
- select / confirm / move / attack / hit / destroy
- ability heal / hack / heavy / shield
- victory / defeat

Settings persist to `localStorage` (`overclock.audio.v1`).

## UX

- Main menu: Play / Army / Collection / Profile / Settings
- `TutorialBanner` — 3-step brief (dismissible)
- In-match HUD hint line

## Performance notes

- CSS-only bursts (max ~8)
- No canvas/WebGL
- Prefer transform/opacity animations
