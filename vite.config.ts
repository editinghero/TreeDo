import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsConfigPaths(),
    tanstackStart({ server: { entry: "server" } }),
    react(),
    cloudflare({
      viteEnvironment: { name: "ssr" },
      persistState: { path: ".wrangler/state/v3" },
    }),
  ],
});
