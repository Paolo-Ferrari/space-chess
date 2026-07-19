export type ArmyDragPayload =
  | { source: "pool"; unitId: string }
  | { source: "slot"; unitId: string; fromIndex: number };

export const ARMY_DRAG_MIME = "application/x-mvs-army-unit";

export function writeArmyDragPayload(
  dataTransfer: DataTransfer,
  payload: ArmyDragPayload,
): void {
  const json = JSON.stringify(payload);
  dataTransfer.setData(ARMY_DRAG_MIME, json);
  dataTransfer.setData("text/plain", json);
  dataTransfer.effectAllowed = "move";
}

export function readArmyDragPayload(
  dataTransfer: DataTransfer,
): ArmyDragPayload | null {
  const raw =
    dataTransfer.getData(ARMY_DRAG_MIME) ||
    dataTransfer.getData("text/plain");
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as ArmyDragPayload;
    if (parsed.source === "pool" && typeof parsed.unitId === "string") {
      return parsed;
    }
    if (
      parsed.source === "slot" &&
      typeof parsed.unitId === "string" &&
      typeof parsed.fromIndex === "number"
    ) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}
