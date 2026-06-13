import fs from "node:fs";
import path from "node:path";

// Remove the auto-generated wrangler.json from dist/client
// Cloudflare Pages should use the root wrangler.jsonc instead
const clientWranglerJson = path.resolve("dist/client/wrangler.json");
if (fs.existsSync(clientWranglerJson)) {
  fs.unlinkSync(clientWranglerJson);
  console.log("✓ Removed incompatible wrangler.json from dist/client");
}
