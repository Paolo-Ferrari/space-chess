import "./UnitStatBadge.css";

export type UnitStatKind = "cost" | "attack" | "health";

interface UnitStatBadgeProps {
  kind: UnitStatKind;
  value: number;
}

function clampStat(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(99, Math.round(value)));
}

function UnitStatBadge({ kind, value }: UnitStatBadgeProps) {
  const shown = clampStat(value);
  const title =
    kind === "cost" ? "Стоимость" : kind === "attack" ? "Атака" : "Здоровье";

  return (
    <span
      className={`unit-stat-badge unit-stat-badge--${kind}`}
      title={title}
      aria-label={`${title}: ${shown}`}
    >
      <svg
        className="unit-stat-badge-art"
        viewBox="0 0 40 40"
        aria-hidden
        focusable="false"
      >
        {kind === "cost" && (
          <>
            <circle cx="20" cy="20" r="17" className="unit-stat-coin-rim" />
            <circle cx="20" cy="20" r="14.5" className="unit-stat-coin-face" />
            <circle cx="20" cy="20" r="12" className="unit-stat-coin-inner" />
          </>
        )}

        {kind === "attack" && (
          <>
            <path
              className="unit-stat-shield"
              d="M20 3 L33 8.5 V18.5 C33 28 27 33.5 20 37 C13 33.5 7 28 7 18.5 V8.5 Z"
            />
            <path
              className="unit-stat-shield-inner"
              d="M20 6.5 L30 10.5 V18.5 C30 26.2 25.2 31 20 33.5 C14.8 31 10 26.2 10 18.5 V10.5 Z"
            />
            <g className="unit-stat-swords">
              <path d="M11.5 10.5 L28.5 27.5" />
              <path d="M28.5 10.5 L11.5 27.5" />
              <path d="M10.5 9.5 L13.8 8.3 L14.8 11.5" />
              <path d="M29.5 9.5 L26.2 8.3 L25.2 11.5" />
              <path d="M10.5 29.5 L13.8 30.7 L14.8 27.5" />
              <path d="M29.5 29.5 L26.2 30.7 L25.2 27.5" />
            </g>
          </>
        )}

        {kind === "health" && (
          <path
            className="unit-stat-heart"
            d="M20 35 C11 28.5 5.5 22.5 5.5 16.2 C5.5 11.2 9.2 7.5 13.8 7.5 C16.8 7.5 19 9.1 20 11.2 C21 9.1 23.2 7.5 26.2 7.5 C30.8 7.5 34.5 11.2 34.5 16.2 C34.5 22.5 29 28.5 20 35 Z"
          />
        )}
      </svg>
      <span className="unit-stat-badge-value">{shown}</span>
    </span>
  );
}

export default UnitStatBadge;
