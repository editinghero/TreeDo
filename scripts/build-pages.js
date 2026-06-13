import fs from "node:fs";
import path from "node:path";

const srcWorker = path.resolve("dist/server/index.js");
const destWorker = path.resolve("dist/client/_worker.js");
const srcAssets = path.resolve("dist/server/assets");
const destAssets = path.resolve("dist/client/assets");

console.log("Packaging TanStack Start build for Cloudflare Pages...");

// Copy worker entry
if (fs.existsSync(srcWorker)) {
  fs.copyFileSync(srcWorker, destWorker);
  console.log(`✓ Copied worker entry to ${destWorker}`);
} else {
  console.error(`Error: Compiled worker not found at ${srcWorker}`);
  process.exit(1);
}

// Copy server assets recursively
if (fs.existsSync(srcAssets)) {
  if (!fs.existsSync(destAssets)) {
    fs.mkdirSync(destAssets, { recursive: true });
  }
  const files = fs.readdirSync(srcAssets);
  for (const file of files) {
    const srcFile = path.join(srcAssets, file);
    const destFile = path.join(destAssets, file);
    fs.copyFileSync(srcFile, destFile);
    console.log(`✓ Copied server asset: ${file}`);
  }
} else {
  console.error(`Error: Server assets not found at ${srcAssets}`);
  process.exit(1);
}

console.log("✓ Pages package completed successfully in dist/client!");
