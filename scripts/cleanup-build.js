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

// Sanitize the auto-generated wrangler.json — it contains Worker-only fields
// that Cloudflare Pages rejects during deployment
const generatedConfig = path.resolve("dist/client/wrangler.json");
if (fs.existsSync(generatedConfig)) {
  const raw = JSON.parse(fs.readFileSync(generatedConfig, "utf-8"));
  delete raw.assets;
  delete raw.definedEnvironments;
  delete raw.durable_objects;
  delete raw.workflows;
  delete raw.migrations;
  delete raw.kv_namespaces;
  delete raw.d1_databases;
  delete raw.vectorize;
  delete raw.ai_search_namespaces;
  delete raw.ai_search;
  delete raw.agent_memory;
  delete raw.hyperdrive;
  delete raw.services;
  delete raw.analytics_engine_datasets;
  delete raw.dispatch_namespaces;
  delete raw.mtls_certificates;
  delete raw.pipelines;
  delete raw.secrets_store_secrets;
  delete raw.artifacts;
  delete raw.unsafe_hello_world;
  delete raw.flagship;
  delete raw.worker_loaders;
  delete raw.ratelimits;
  delete raw.vpc_services;
  delete raw.vpc_networks;
  delete raw.logfwdr;
  delete raw.python_modules;
  delete raw.cloudchamber;
  delete raw.send_email;
  delete raw.queues;
  delete raw.r2_buckets;
  delete raw.triggers;
  delete raw.rules;
  delete raw.jsx_factory;
  delete raw.jsx_fragment;
  if (raw.dev) {
    delete raw.dev.enable_containers;
    delete raw.dev.generate_types;
  }
  fs.writeFileSync(generatedConfig, JSON.stringify(raw, null, 2));
  console.log("✓ Sanitized wrangler.json for Pages compatibility");
}

console.log("✓ Cloudflare Pages build completed!");
