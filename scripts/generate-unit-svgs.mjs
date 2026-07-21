/**
 * Generates unique faction-styled SVG files for every unit.
 * Output: public/assets/unit-icons/{unitId}.svg
 *
 * Usage: node scripts/generate-unit-svgs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const catalogDir = path.join(root, "src/data/catalog/armyBuilder");
const outDir = path.join(root, "public/assets/unit-icons");

const FACTION_STYLE = {
  "faction-arasaka": {
    color: "#fcee0a",
    frame: "M8 8 H40 L44 16 V40 H8 L4 16 Z",
    mark: "M24 12 L34 34 H14 Z",
  },
  "faction-militech": {
    color: "#6b8cff",
    frame: "M8 10 H40 V38 H8 Z",
    mark: "M16 16 H32 V32 H16 Z M20 16 V32 M28 16 V32",
  },
  "faction-maelstrom": {
    color: "#ff2a6d",
    frame: "M6 14 L20 6 L42 12 L38 40 L12 42 L4 28 Z",
    mark: "M24 16 A7 7 0 1 1 23.9 16 M18 18 L30 30 M30 18 L18 30",
  },
  "faction-tyger-claws": {
    color: "#ff4d6a",
    frame: "M10 6 L38 10 L42 24 L36 42 L8 38 L4 18 Z",
    mark: "M14 30 L24 12 L34 30 M18 30 L24 20 L30 30",
  },
  "faction-valentinos": {
    color: "#ff6b35",
    frame: "M24 6 L42 18 L36 40 L12 40 L6 18 Z",
    mark: "M24 14 L32 22 L24 36 L16 22 Z",
  },
  "faction-voodoo-boys": {
    color: "#b44dff",
    frame: "M12 8 H36 L44 24 L36 40 H12 L4 24 Z",
    mark: "M24 14 A8 8 0 1 1 23.9 14 M24 14 V32 M16 23 H32",
  },
  "faction-nomads": {
    color: "#e8a54b",
    frame: "M6 16 L24 6 L42 16 L40 40 L8 40 Z",
    mark: "M12 30 L24 12 L36 30 Z",
  },
  "faction-ncpd": {
    color: "#4db8ff",
    frame: "M24 6 L40 14 V30 L24 42 L8 30 V14 Z",
    mark: "M24 14 L34 20 V28 L24 36 L14 28 V20 Z",
  },
  "faction-animals": {
    color: "#c4ff4d",
    frame: "M8 12 H40 V36 H8 Z",
    mark: "M16 28 C16 18 32 18 32 28 M18 20 L14 14 M30 20 L34 14",
  },
  "faction-6th-street": {
    color: "#9aa4b2",
    frame: "M10 10 H38 V38 H10 Z",
    mark: "M16 16 H32 V32 H16 Z M24 16 V32 M16 24 H32",
  },
  "pool-edgerunners": {
    color: "#00f0ff",
    frame:
      "M24 4 L30 16 L44 18 L34 28 L36 42 L24 34 L12 42 L14 28 L4 18 L18 16 Z",
    mark: "M24 14 L26 22 H34 L28 26 L30 34 L24 30 L18 34 L20 26 L14 22 H22 Z",
  },
};

const GLYPHS = {
  commander: null, // use faction mark
  smasher:
    "M16 14 H32 V26 L28 34 H20 L16 26 Z M18 34 H30 M19 18 H22 M26 18 H29 M20 30 H28",
  johnny:
    "M14 12 C14 12 16 32 16 34 M34 12 C34 12 32 32 32 34 M18 12 H30 M17 20 H31 M19 18 V22 M29 18 V22",
  songbird:
    "M24 18 A7 7 0 1 1 23.9 18 M18 28 H30 V34 H18 Z M12 16 C10 22 10 26 12 30 M36 16 C38 22 38 26 36 30",
  "letter-v": "M14 14 L24 36 L34 14 M18 14 H22 L24 28 L26 14 H30",
  legendary: "M24 12 L34 22 V32 L24 38 L14 32 V22 Z M24 18 V32 M18 24 H30",
  ripper:
    "M18 14 H28 V22 L34 30 V36 H28 L24 30 L20 36 H14 V30 L20 22 Z",
  sniper:
    "M24 16 A7 7 0 1 1 23.9 16 M24 16 A2.5 2.5 0 1 1 23.9 16 M24 10 V13 M24 27 V30 M15 20 H18 M30 20 H33",
  drone:
    "M17 18 H31 V28 H17 Z M21 23 A1.5 1.5 0 1 1 20.9 23 M27 23 A1.5 1.5 0 1 1 26.9 23 M20 18 L18 14 M28 18 L30 14",
  heavy:
    "M16 28 V18 C16 14 20 12 24 12 C28 12 32 14 32 18 V28 M14 28 H34 M20 20 H28",
  scout: "M12 20 H36 L32 28 H16 Z M18 24 H30 M24 16 V20",
  netrunner:
    "M24 16 A6 6 0 1 1 23.9 16 M18 24 H30 V32 H18 Z M14 16 L10 12 M34 16 L38 12",
  techie:
    "M15 15 H33 V29 H15 Z M18 19 H30 M18 23 H26 M18 27 H28 M30 32 L34 36",
  solo: "M14 34 L32 12 M12 36 L16 32 M28 14 L34 10 M18 30 H24",
  edgerunner:
    "M24 12 L26 20 H34 L28 25 L30 34 L24 29 L18 34 L20 25 L14 20 H22 Z",
  infantry: "M24 14 A6 6 0 1 1 23.9 14 M16 36 H32 L28 24 H20 Z",
  special: "M24 14 L27 22 H35 L28 27 L31 35 L24 30 L17 35 L20 27 L13 22 H21 Z",
};

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 33 + str.charCodeAt(i)) >>> 0;
  return h;
}

function roleOf(unitId, type) {
  const id = unitId.toLowerCase();
  if (type === "commander" || id.includes("commander")) return "commander";
  if (id.includes("adam-smasher")) return "smasher";
  if (id.includes("johnny") || id.includes("silverhand")) return "johnny";
  if (id.includes("songbird")) return "songbird";
  if (id.includes("legendary")) return "legendary";
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
  if (type === "special") return "special";
  if (type === "legendary") return "legendary";
  return "infantry";
}

function collectUnits() {
  /** @type {{id:string,type:string,factionId:string}[]} */
  const units = [];
  for (const file of fs.readdirSync(catalogDir)) {
    if (!file.endsWith(".catalog.ts")) continue;
    const text = fs.readFileSync(path.join(catalogDir, file), "utf8");
    const factionMatch = text.match(/id:\s*"(faction-[^"]+)"/);
    if (!factionMatch) continue;
    const factionId = factionMatch[1];
    const re =
      /\{\s*id:\s*"([^"]+)",\s*factionId:[^,]+,\s*name:\s*"([^"]*)",\s*type:\s*"([^"]+)"/g;
    let m;
    while ((m = re.exec(text))) {
      units.push({ id: m[1], type: m[3], factionId });
    }
  }
  const edgePath = path.join(
    root,
    "src/data/catalog/edgerunners/testEdgerunners.catalog.ts",
  );
  const edgeText = fs.readFileSync(edgePath, "utf8");
  const edgeRe =
    /\{\s*id:\s*"(edge-[^"]+)",\s*factionId:[^,]+,\s*name:\s*"([^"]*)",\s*type:\s*"([^"]+)"/g;
  let em;
  while ((em = edgeRe.exec(edgeText))) {
    units.push({ id: em[1], type: em[3], factionId: "pool-edgerunners" });
  }
  return units;
}

function renderSvg(unit) {
  const style = FACTION_STYLE[unit.factionId] ?? FACTION_STYLE["pool-edgerunners"];
  const role = roleOf(unit.id, unit.type);
  const h = hash(unit.id);
  const ox = ((h % 5) - 2) * 0.5;
  const oy = (((h >> 4) % 5) - 2) * 0.5;
  const accentY = 42 + (((h >> 8) % 3) - 1) * 0.3;
  const glyph =
    role === "commander" ? style.mark : (GLYPHS[role] ?? GLYPHS.infantry);
  const color = style.color;

  // Unique corner tick per unit so no two files are identical
  const tickX = 6 + (h % 4);
  const tickY = 6 + ((h >> 2) % 4);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" fill="none">
  <rect x="1" y="1" width="46" height="46" rx="2" fill="#0a0a0c" stroke="${color}" stroke-width="1.2" opacity="0.35"/>
  <path d="${style.frame}" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <g transform="translate(${ox.toFixed(2)} ${oy.toFixed(2)})">
    <path d="${glyph}" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
  <path d="M16 ${accentY.toFixed(1)} H32" stroke="${color}" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
  <path d="M${tickX} ${tickY} H${tickX + 3}" stroke="${color}" stroke-width="1.8" stroke-linecap="round" opacity="0.7"/>
</svg>
`;
}

function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const placeholder = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" fill="none">
  <rect x="2" y="2" width="44" height="44" rx="3" stroke="#00f0ff" stroke-width="2"/>
  <path d="M16 24 H32 M24 16 V32" stroke="#00f0ff" stroke-width="2.2" stroke-linecap="round"/>
</svg>
`;
  fs.writeFileSync(path.join(outDir, "_placeholder.svg"), placeholder, "utf8");

  const units = collectUnits();
  const map = {};
  for (const unit of units) {
    const file = path.join(outDir, `${unit.id}.svg`);
    fs.writeFileSync(file, renderSvg(unit), "utf8");
    map[unit.id] = `/assets/unit-icons/${unit.id}.svg`;
  }
  fs.writeFileSync(
    path.join(outDir, "manifest.json"),
    JSON.stringify(map, null, 2),
  );
  console.log(`Generated ${units.length} SVG icons + placeholder → ${outDir}`);
}

main();
