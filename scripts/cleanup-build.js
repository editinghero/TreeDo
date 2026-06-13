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

// Copy server.js to dist/client (so assets can import from ../server.js)
const srcServer = path.resolve("dist/server/server.js");
const destServer = path.resolve("dist/client/server.js");

if (fs.existsSync(srcServer)) {
  fs.copyFileSync(srcServer, destServer);
  console.log("✓ Copied server.js to dist/client");
}

// ALSO copy as _worker.js for Cloudflare Pages entry point
const destWorker = path.resolve("dist/client/_worker.js");
if (fs.existsSync(srcServer)) {
  fs.copyFileSync(srcServer, destWorker);
  console.log("✓ Copied server.js as _worker.js");
}

console.log("✓ Cloudflare Pages build completed!");
