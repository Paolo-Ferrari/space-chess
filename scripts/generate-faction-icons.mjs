/**
 * Generates per-faction, per-unit board SVG React components.
 * Each unit gets a unique component; faction folder owns visual language.
 *
 * Usage: node scripts/generate-faction-icons.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const catalogDir = path.join(root, "src/data/catalog/armyBuilder");
const outRoot = path.join(root, "src/assets/icons/factions");

const FACTION_FOLDERS = {
  "faction-arasaka": "arasaka",
  "faction-militech": "militech",
  "faction-maelstrom": "maelstrom",
  "faction-tyger-claws": "tygerclaws",
  "faction-valentinos": "valentinos",
  "faction-voodoo-boys": "voodooboys",
  "faction-nomads": "nomads",
  "faction-ncpd": "ncpd",
  "faction-animals": "animals",
  "faction-6th-street": "sixthstreet",
  "pool-edgerunners": "edgerunners",
};

/** Outer frame language — unique geometry per faction (not shared shells). */
const FRAMES = {
  arasaka: `M10 8 L38 8 L42 16 L38 40 L10 40 L6 16 Z`,
  militech: `M8 10 H40 V38 H8 Z M8 16 H40 M8 32 H40`,
  maelstrom: `M8 12 L22 6 L40 14 L36 40 L14 42 L6 28 Z`,
  tygerclaws: `M12 6 L36 10 L40 24 L34 42 L10 38 L6 20 Z`,
  valentinos: `M24 6 L40 18 L34 40 L14 40 L8 18 Z`,
  voodooboys: `M14 8 H34 L42 24 L34 40 H14 L6 24 Z`,
  nomads: `M8 14 L24 6 L40 14 L38 40 L10 40 Z`,
  ncpd: `M24 6 L38 14 V30 L24 42 L10 30 V14 Z`,
  animals: `M10 12 H38 V36 H10 Z M14 12 V36 M34 12 V36`,
  sixthstreet: `M10 10 H38 V38 H10 Z M24 10 V38 M10 24 H38`,
  edgerunners: `M24 4 L30 18 L44 20 L34 30 L36 44 L24 36 L12 44 L14 30 L4 20 L18 18 Z`,
};

const EMBLEMS = {
  arasaka: `M24 14 L34 34 H14 Z M20 28 H28`,
  militech: `M16 16 H32 V32 H16 Z M20 16 V32 M28 16 V32`,
  maelstrom: `M24 16 A8 8 0 1 1 23.9 16 M18 18 L30 30 M30 18 L18 30`,
  tygerclaws: `M14 30 L24 12 L34 30 M18 30 L24 20 L30 30`,
  valentinos: `M24 14 L32 22 L24 36 L16 22 Z`,
  voodooboys: `M24 14 A9 9 0 1 1 23.9 14 M24 14 V32 M15 23 H33`,
  nomads: `M12 30 L24 12 L36 30 Z M18 30 L24 20 L30 30`,
  ncpd: `M24 14 L34 20 V28 L24 36 L14 28 V20 Z M24 20 V30`,
  animals: `M16 28 C16 18 32 18 32 28 M18 20 L14 14 M30 20 L34 14`,
  sixthstreet: `M16 16 H32 V32 H16 Z`,
  edgerunners: `M24 14 L26 22 H34 L28 26 L30 34 L24 30 L18 34 L20 26 L14 22 H22 Z`,
};

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function roleGlyph(unitId, type) {
  const id = unitId.toLowerCase();
  if (type === "commander" || id.includes("commander")) return "commander";
  if (id.includes("adam-smasher")) return "smasher";
  if (id.includes("johnny") || id.includes("silverhand")) return "johnny";
  if (id.includes("songbird")) return "songbird";
  if (/(^|-)v($|-)/.test(id)) return "letter-v";
  if (type === "legendary" || id.includes("legendary")) return "legendary";
  if (id.includes("ripper") || id.includes("medic")) return "ripper";
  if (id.includes("sniper") || id.includes("marksman") || id.includes("gunner"))
    return "sniper";
  if (id.includes("drone")) return "drone";
  if (
    id.includes("heavy") ||
    id.includes("tank") ||
    id.includes("mech") ||
    id.includes("fort") ||
    id.includes("riot")
  )
    return "heavy";
  if (
    id.includes("scout") ||
    id.includes("recon") ||
    id.includes("patrol") ||
    id.includes("rider")
  )
    return "scout";
  if (
    id.includes("netrunner") ||
    id.includes("ghost") ||
    id.includes("signal") ||
    id.includes("-ice")
  )
    return "netrunner";
  if (id.includes("tech") || id.includes("engineer")) return "techie";
  if (
    id.includes("blade") ||
    id.includes("assassin") ||
    id.includes("ninja") ||
    id.includes("solo") ||
    id.includes("monk")
  )
    return "solo";
  if (id.includes("edge-")) return "edgerunner";
  return "infantry";
}

function glyphPaths(role, unitId) {
  const h = hash(unitId);
  const ox = ((h % 5) - 2) * 0.6;
  const oy = (((h >> 3) % 5) - 2) * 0.6;
  const t = (d) =>
    d.replace(/([MLHVCSQTAZmlhvcsqtaz])|(-?\d*\.?\d+)/g, (m, cmd, num) => {
      if (cmd) return cmd;
      // slight per-unit offset on absolute-ish coords mid-range — keep simple: inject translate on group instead
      return num;
    });

  const glyphs = {
    commander: null, // emblem used instead
    smasher: `M16 14 H32 V26 L28 34 H20 L16 26 Z M18 34 H30 M19 18 H22 M26 18 H29 M20 30 H28`,
    johnny: `M14 12 C14 12 16 30 16 34 M34 12 C34 12 32 30 32 34 M18 12 H30 M17 20 H31 M19 18 V22 M29 18 V22`,
    songbird: `M24 18 A8 8 0 1 1 23.9 18 M18 28 H30 V34 H18 Z M12 16 C10 22 10 26 12 30 M36 16 C38 22 38 26 36 30`,
    "letter-v": `M14 14 L24 36 L34 14 H28 L24 28 L20 14 Z`,
    legendary: `M24 12 L34 22 V32 L24 38 L14 32 V22 Z M24 18 V32 M18 24 H30`,
    ripper: `M18 14 H28 V22 L34 30 V36 H28 L24 30 L20 36 H14 V30 L20 22 Z`,
    sniper: `M24 16 A7 7 0 1 1 23.9 16 M24 16 A2.5 2.5 0 1 1 23.9 16 M24 10 V13 M24 27 V30 M15 20 H18 M30 20 H33`,
    drone: `M17 18 H31 V28 H17 Z M21 23 A1.5 1.5 0 1 1 20.9 23 M27 23 A1.5 1.5 0 1 1 26.9 23 M20 18 L18 14 M28 18 L30 14`,
    heavy: `M16 28 V18 C16 14 20 12 24 12 C28 12 32 14 32 18 V28 M14 28 H34 M20 20 H28`,
    scout: `M12 20 H36 L32 28 H16 Z M18 24 H30 M24 16 V20`,
    netrunner: `M24 16 A6 6 0 1 1 23.9 16 M18 24 H30 V32 H18 Z M14 16 L10 12 M34 16 L38 12`,
    techie: `M15 15 H33 V29 H15 Z M18 19 H30 M18 23 H26 M18 27 H28 M30 32 L34 36`,
    solo: `M14 34 L32 12 M12 36 L16 32 M28 14 L34 10 M18 30 H24`,
    edgerunner: `M24 12 L26 20 H34 L28 25 L30 34 L24 29 L18 34 L20 25 L14 20 H22 Z`,
    infantry: `M24 14 A6 6 0 1 1 23.9 14 M16 36 H32 L28 24 H20 Z`,
  };

  const d = glyphs[role] ?? glyphs.infantry;
  return { d, ox, oy, useEmblem: role === "commander" };
}

function componentName(unitId) {
  return (
    "Icon_" +
    unitId
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .map((p) => p[0].toUpperCase() + p.slice(1))
      .join("")
  );
}

function collectCatalogUnits() {
  /** @type {Record<string, {id:string,type:string,factionId:string}[]>} */
  const byFaction = {};
  for (const file of fs.readdirSync(catalogDir)) {
    if (!file.endsWith(".catalog.ts")) continue;
    const text = fs.readFileSync(path.join(catalogDir, file), "utf8");
    const factionMatch = text.match(/id:\s*"(faction-[^"]+)"/);
    if (!factionMatch) continue;
    const factionId = factionMatch[1];
    const units = [];
    const blockRe =
      /\{\s*id:\s*"([^"]+)",\s*factionId:[^,]+,\s*name:\s*"([^"]*)",\s*type:\s*"([^"]+)"/g;
    let m;
    while ((m = blockRe.exec(text))) {
      units.push({ id: m[1], type: m[3], factionId });
    }
    byFaction[factionId] = units;
  }

  // edgerunners
  const edgePath = path.join(
    root,
    "src/data/catalog/edgerunners/testEdgerunners.catalog.ts",
  );
  const edgeText = fs.readFileSync(edgePath, "utf8");
  const edgeUnits = [];
  const edgeRe =
    /\{\s*id:\s*"(edge-[^"]+)",\s*factionId:[^,]+,\s*name:\s*"([^"]*)",\s*type:\s*"([^"]+)"/g;
  let em;
  while ((em = edgeRe.exec(edgeText))) {
    edgeUnits.push({
      id: em[1],
      type: em[3],
      factionId: "pool-edgerunners",
    });
  }
  byFaction["pool-edgerunners"] = edgeUnits;
  return byFaction;
}

function renderUnitComponent(folder, unit) {
  const name = componentName(unit.id);
  const role = roleGlyph(unit.id, unit.type);
  const { d, ox, oy, useEmblem } = glyphPaths(role, unit.id);
  const frame = FRAMES[folder];
  const emblem = EMBLEMS[folder];
  const accentY = 42 + (((hash(unit.id) >> 5) % 3) - 1) * 0.4;

  const inner = useEmblem
    ? `<path d="${emblem}" />`
    : `<g transform="translate(${ox.toFixed(2)} ${oy.toFixed(2)})">
        <path d="${d}" />
      </g>`;

  const pathOpen = `<path fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" d="`;

  const innerJsx = useEmblem
    ? `${pathOpen}${emblem}" />`
    : `<g transform="translate(${ox.toFixed(2)} ${oy.toFixed(2)})">
        ${pathOpen}${d}" />
      </g>`;

  return `import { FactionIconSvg } from "../../shared/FactionIconSvg";

/** Board pictogram — ${unit.id} (${folder}) */
export function ${name}() {
  return (
    <FactionIconSvg data-unit="${unit.id}" data-faction="${folder}">
      <g className="ficon__frame">
        ${pathOpen}${frame}" />
      </g>
      <g className="ficon__glyph">
        ${innerJsx}
      </g>
      <g className="ficon__accent">
        ${pathOpen}M16 ${accentY.toFixed(1)} H32" />
      </g>
    </FactionIconSvg>
  );
}
`;
}

function main() {
  const byFaction = collectCatalogUnits();
  /** @type {Record<string, string>} */
  const registry = {};

  fs.mkdirSync(outRoot, { recursive: true });

  for (const [factionId, folder] of Object.entries(FACTION_FOLDERS)) {
    const units = byFaction[factionId] ?? [];
    const dir = path.join(outRoot, folder);
    fs.mkdirSync(dir, { recursive: true });
    const exports = [];

    for (const unit of units) {
      const name = componentName(unit.id);
      const file = `${unit.id}.tsx`;
      fs.writeFileSync(path.join(dir, file), renderUnitComponent(folder, unit));
      exports.push(`export { ${name} } from "./${unit.id}";`);
      registry[unit.id] = {
        folder,
        exportName: name,
        importPath: `./factions/${folder}/${unit.id}`,
      };
    }

    fs.writeFileSync(
      path.join(dir, "index.ts"),
      `/** ${folder} faction board icons */\n${exports.join("\n")}\n`,
    );
    console.log(`${folder}: ${units.length} icons`);
  }

  // IconRegistry.ts
  const imports = Object.entries(registry)
    .map(
      ([id, meta]) =>
        `import { ${meta.exportName} } from "${meta.importPath}";`,
    )
    .join("\n");

  const mapEntries = Object.entries(registry)
    .map(([id, meta]) => `  "${id}": ${meta.exportName},`)
    .join("\n");

  const registrySource = `import type { ComponentType } from "react";

${imports}

import { IconFallback } from "./shared/IconFallback";

/**
 * Board icon registry — unitId → unique faction SVG component.
 * Add a unit: generate icon file + one line here (or re-run generate-faction-icons.mjs).
 */
export const ICON_REGISTRY: Record<string, ComponentType> = {
${mapEntries}
};

export function getUnitIconComponent(unitId: string): ComponentType {
  return ICON_REGISTRY[unitId] ?? IconFallback;
}
`;

  fs.writeFileSync(
    path.join(root, "src/assets/icons/IconRegistry.ts"),
    registrySource,
  );
  console.log(`Registry entries: ${Object.keys(registry).length}`);
}

main();
