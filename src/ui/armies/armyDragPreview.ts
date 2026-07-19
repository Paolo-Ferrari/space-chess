/** Fallback if composition slots are not in the DOM yet. */
const PREVIEW_WIDTH = 88;
const PREVIEW_HEIGHT = 84;

function measureSlotSize(): { width: number; height: number } {
  const slot = document.querySelector(".armies-slot");
  if (!(slot instanceof HTMLElement)) {
    return { width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT };
  }

  const rect = slot.getBoundingClientRect();
  const width = Math.max(48, Math.round(rect.width));
  const height = Math.max(48, Math.round(rect.height));
  return { width, height };
}

export function setSlotSizedDragImage(
  dataTransfer: DataTransfer,
  options: {
    label: string;
    accent?: "cyan" | "magenta";
  },
): void {
  const { width, height } = measureSlotSize();
  const glyph = options.label.trim().slice(0, 1).toUpperCase() || "?";
  const accent = options.accent ?? "cyan";
  const border =
    accent === "magenta"
      ? "rgba(255, 64, 160, 0.75)"
      : "rgba(0, 196, 255, 0.75)";
  const glow =
    accent === "magenta"
      ? "rgba(255, 64, 160, 0.35)"
      : "rgba(0, 196, 255, 0.35)";
  const color = accent === "magenta" ? "#ff7eb6" : "#6ee7ff";

  const preview = document.createElement("div");
  preview.className = "army-drag-preview";
  preview.style.cssText = [
    "position: fixed",
    "top: -1000px",
    "left: -1000px",
    `width: ${width}px`,
    `height: ${height}px`,
    "box-sizing: border-box",
    "display: flex",
    "flex-direction: column",
    "align-items: center",
    "justify-content: center",
    "gap: 6px",
    "padding: 8px 6px",
    `border: 1px solid ${border}`,
    "background: rgba(4, 12, 22, 0.95)",
    `box-shadow: 0 0 16px ${glow}`,
    "pointer-events: none",
    "z-index: 9999",
  ].join(";");

  const icon = document.createElement("div");
  icon.style.cssText = [
    "width: 40px",
    "height: 40px",
    "display: grid",
    "place-items: center",
    `border: 1px solid ${border}`,
    "background: rgba(0, 30, 45, 0.9)",
    `color: ${color}`,
    "font: 700 16px Consolas, monospace",
  ].join(";");
  icon.textContent = glyph;

  const name = document.createElement("div");
  name.style.cssText = [
    "font-size: 10px",
    "letter-spacing: 0.04em",
    "color: #c8e8f8",
    "text-align: center",
    "max-width: 100%",
    "overflow: hidden",
    "text-overflow: ellipsis",
    "white-space: nowrap",
  ].join(";");
  name.textContent = options.label;

  preview.append(icon, name);
  document.body.appendChild(preview);
  dataTransfer.setDragImage(preview, width / 2, height / 2);

  window.requestAnimationFrame(() => {
    preview.remove();
  });
}
