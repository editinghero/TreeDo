import fs from "node:fs";
import path from "node:path";

// Try to find the worker entry - Cloudflare plugin can output to different locations
const possibleWorkerPaths = [
  "dist/tanstack_start_app/index.js",  // Local build
  "dist/server/server.js",              // CI build
];

let srcWorker = null;
for (const workerPath of possibleWorkerPaths) {
  const fullPath = path.resolve(workerPath);
  if (fs.existsSync(fullPath)) {
    srcWorker = fullPath;
    break;
  }
}

if (!srcWorker) {
  console.error("Error: Worker not found at any expected location:");
  possibleWorkerPaths.forEach(p => console.error(`  - ${p}`));
  process.exit(1);
}

const destWorker = path.resolve("dist/client/_worker.js");
fs.copyFileSync(srcWorker, destWorker);
console.log(`✓ Copied worker entry from ${path.basename(path.dirname(srcWorker))}/${path.basename(srcWorker)} to dist/client/_worker.js`);

// Copy server assets to client/assets for the worker to access
const srcAssets = path.resolve("dist/server/assets");
const destAssets = path.resolve("dist/client/assets");

if (fs.existsSync(srcAssets)) {
  const files = fs.readdirSync(srcAssets);
  for (const file of files) {
    const srcFile = path.join(srcAssets, file);
    const destFile = path.join(destAssets, file);
    fs.copyFileSync(srcFile, destFile);
  }
  console.log(`✓ Copied ${files.length} server assets to dist/client/assets`);
}

// Create a Pages-compatible wrangler.json WITHOUT pages_build_output_dir
// (that field is only for the root config, not the deployed one)
const wranglerConfig = {
  name: "tanstack-start-app",
  compatibility_date: "2025-09-24",
  compatibility_flags: ["nodejs_compat"],
  d1_databases: [
    {
      binding: "DB",
      database_name: "treedo",
      database_id: "aa800f81-1fff-4767-a9ac-402ce1f09e18",
      migrations_dir: "db/migrations"
    },
  ],
};

const wranglerPath = path.resolve("dist/client/wrangler.json");
fs.writeFileSync(wranglerPath, JSON.stringify(wranglerConfig, null, 2));
console.log("✓ Created Pages-compatible wrangler.json");

console.log("✓ Pages package completed successfully in dist/client!");
