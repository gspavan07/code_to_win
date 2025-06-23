import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 1432,
    proxy: {
      "/api": {
        target: "http://10.50.25.119:5000",
        changeOrigin: true,
        secure: false,
      },
    }
  },
  plugins: [react(), tailwindcss()],
});
