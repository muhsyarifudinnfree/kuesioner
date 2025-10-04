import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // Tambahkan baris ini
  base: "/kuesioner/",
  plugins: [react()],
});
