import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 1432,
    proxy: {
      "/api": {
        target: "http://192.168.134.225:5000",
        changeOrigin: true,
        secure: false,
      },
    }
  },
  plugins: [react(), tailwindcss()],
});
