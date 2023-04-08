import { defineConfig } from "vite";
import { ivi } from "@ivi/vite-plugin";

export default defineConfig({
  plugins: [ivi()],
  base: "./",
  build: {
    modulePreload: false,
    outDir: "docs",
  },
});
