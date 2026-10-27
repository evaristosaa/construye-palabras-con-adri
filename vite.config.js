import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { offlinePackagePlugin } from "./scripts/build-offline-package.mjs";

export default defineConfig({
  plugins: [react(), offlinePackagePlugin()],
  build: {rollupOptions:{output:{manualChunks:{vendor:["react","react-dom","react-router-dom"]}}}},
  server: {
    watch: {
      // Reiniciar Vite tras conectar un lote de audios nuevos para actualizar su índice público.
      ignored: ["**/.venv-voice/**", "**/.voice-cache/**", "**/public/audio/**", "**/tmp/**"],
    },
  },
  // Cambia este valor a "/" si no despliegas en GitHub Pages.
  base: "/construye-palabras-con-adri/",
});
