import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  sourcemap: true,
  clean: true,
  dts: true,
  format: ["esm"],
  target: "esnext",
  minify: false,
  esbuildOptions(options) {
    options.platform = "node"; // Ensure the platform is set to Node.js
    options.mainFields = ["module", "main"]; // Prioritize ESM entry points
    options.conditions = ["module"]; // Enforce use of ESM
  },
  external: [],
});
