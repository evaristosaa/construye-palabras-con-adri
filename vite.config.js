import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Reiniciar Vite tras conectar un lote de audios nuevos para actualizar su índice público.
      ignored: ["**/.venv-voice/**", "**/.voice-cache/**", "**/public/audio/**", "**/tmp/**"],
    },
  },
  // Cambia este valor a "/" si no despliegas en GitHub Pages.
  base: "/construye-palabras-con-adri/",
});
