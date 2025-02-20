import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        server: path.resolve(__dirname, 'src/server.ts'),
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
  plugins: [
    react()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      "react-beautiful-dnd",
      "react-beautiful-dnd/dist/react-beautiful-dnd.esm"
    ]
  }
}));
