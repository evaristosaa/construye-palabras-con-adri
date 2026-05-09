import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Cambia este valor a "/" si no despliegas en GitHub Pages.
  base: "/construye-palabras-con-adri/",
});
