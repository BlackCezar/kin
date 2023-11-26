import { defineConfig } from 'vite'
import EnvironmentPlugin from "vite-plugin-environment";
import vue from "@vitejs/plugin-vue";
import {resolveDirective} from "vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    EnvironmentPlugin({
      NODE_ENV: "development",
      VUE_APP_BACKEND_HOST: null,
    }),
    vue(),
  ],
  optimizeDeps: {
    include: ["vue"],
  },
  build: {
    lib: {
      entry: resolveDirective('./src/main.ts'),
      name: 'vue-cart',
      fileName: 'vue-cart'
    },
    emptyOutDir: false,
    outDir: './assets',
    rollupOptions: {}
  }
})
