/**
 * Creates PNG stubs for every unit id in armyBuilder + edgerunner catalogs.
 * Replace individual files under public/assets/units/ with final art later.
 *
 * Usage: node scripts/generate-unit-placeholders.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "assets", "units");
const catalogDir = path.join(root, "src", "data", "catalog");

/** Minimal valid 64×64 PNG (solid dark cyan-ish pixel pattern via tiny encoded PNG). */
function makePlaceholderPng() {
  // Precomputed 1×1 PNG (#0a1a22), expanded visually by CSS object-fit.
  // Valid PNG file signature + IHDR/IDAT/IEND for 1x1 RGB.
  return Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  );
}

function collectUnitIds() {
  const ids = new Set();
  const files = [
    ...fs
      .readdirSync(path.join(catalogDir, "armyBuilder"))
      .filter((f) => f.endsWith(".catalog.ts"))
      .map((f) => path.join(catalogDir, "armyBuilder", f)),
    path.join(catalogDir, "edgerunners", "testEdgerunners.catalog.ts"),
  ];

  const idRe = /^\s*id:\s*"([a-z0-9-]+)"/gm;
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    let match;
    while ((match = idRe.exec(text))) {
      const id = match[1];
      if (id.startsWith("faction-")) continue;
      if (id.startsWith("edgerunner-")) continue;
      ids.add(id);
    }
  }
  return [...ids].sort();
}

fs.mkdirSync(outDir, { recursive: true });
const png = makePlaceholderPng();
const placeholderPath = path.join(outDir, "_placeholder.png");
fs.writeFileSync(placeholderPath, png);

const ids = collectUnitIds();
for (const id of ids) {
  const target = path.join(outDir, `${id}.png`);
  if (!fs.existsSync(target)) {
    fs.copyFileSync(placeholderPath, target);
  }
}

console.log(
  `Unit art stubs: ${ids.length} unit PNGs + _placeholder.png → ${outDir}`,
);
