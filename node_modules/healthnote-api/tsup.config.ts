import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  sourcemap: true,
  clean: true,
  target: "es2020",
  format: ["cjs"],
  dts: true,
}); 