import { MAP_CLASSIC_8X8 } from "./classic-8x8.map";
import type { MapDefinition } from "./types";

/**
 * Map registry — append new MapDefinition files here.
 * Battle / deployment should resolve maps through this module.
 */
const MAPS: MapDefinition[] = [MAP_CLASSIC_8X8];

const byId = new Map(MAPS.map((m) => [m.id, m]));

export function listMaps(): MapDefinition[] {
  return MAPS;
}

export function getMapById(id: string): MapDefinition | undefined {
  return byId.get(id);
}

export function getDefaultMap(): MapDefinition {
  return MAP_CLASSIC_8X8;
}

export type { MapDefinition, MapDeploymentZone } from "./types";
export { MAP_CLASSIC_8X8 };
