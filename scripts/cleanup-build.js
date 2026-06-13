import fs from "node:fs";
import path from "node:path";

// Copy all server assets into client/assets (flat structure for Pages)
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

// Copy the server.js as the worker entry point
const srcWorker = path.resolve("dist/server/server.js");
const destWorker = path.resolve("dist/client/_worker.js");

if (fs.existsSync(srcWorker)) {
  fs.copyFileSync(srcWorker, destWorker);
  console.log("✓ Copied server.js as _worker.js");
}

console.log("✓ Cloudflare Pages build completed!");
