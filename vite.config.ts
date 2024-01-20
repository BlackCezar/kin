import { defineConfig } from "vite";
import EnvironmentPlugin from "vite-plugin-environment";
import vue from "@vitejs/plugin-vue";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    EnvironmentPlugin({
      NODE_ENV: "development",
      VUE_APP_BACKEND_HOST: null,
      VUE_APP_YMAPS_KEY: null,
      VUE_APP_RECAPTCHA: null,
    }),
    vue(),
  ],
  publicDir: './src/public',
  build: {
    lib: {
      entry: path.resolve("./src/main.ts"),
      name: "vue-cart",
      fileName: "vue-cart",
    },
    emptyOutDir: false,
    outDir: "./assets",
    rollupOptions: {},
  },
});
