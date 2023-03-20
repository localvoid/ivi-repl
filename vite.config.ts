import { defineConfig } from "vite";
import { ivi } from "@ivi/rollup-plugin";

export default defineConfig({
  plugins: [ivi()],
  build: {
    modulePreload: false,
    outDir: "docs",
  },
});
