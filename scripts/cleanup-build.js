import fs from "node:fs";
import path from "node:path";

// Copy the worker entry from the Cloudflare plugin output
const srcWorker = path.resolve("dist/tanstack_start_app/index.js");
const destWorker = path.resolve("dist/client/_worker.js");

if (fs.existsSync(srcWorker)) {
  fs.copyFileSync(srcWorker, destWorker);
  console.log("✓ Copied worker entry to dist/client/_worker.js");
} else {
  console.error(`Error: Worker not found at ${srcWorker}`);
  process.exit(1);
}

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

// Create a Pages-compatible wrangler.json
const wranglerConfig = {
  name: "tanstack-start-app",
  compatibility_date: "2025-09-24",
  compatibility_flags: ["nodejs_compat"],
  pages_build_output_dir: "dist/client",
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
