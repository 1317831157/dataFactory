import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import legacy from "@vitejs/plugin-legacy"
import path from "path"
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],
  base: "./", // 使用相对路径
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8001",
        changeOrigin: true,
        // 移除这个 rewrite，因为我们的后端路由已经包含 /api 前缀
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
