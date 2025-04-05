import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths"; // For resolving tsconfig.json paths

export default defineConfig({
  plugins: [tsconfigPaths()],
  server: {
    port: 3000,
    open: true,
  },
  base: "./",
  build: {
    outDir: "dist",
    copyPublicDir: true,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "js/[name].[hash].js",
        chunkFileNames: "js/[name].[hash].js",
        assetFileNames: ({ names }) => {
          const [fileName] = names;
          return fileName?.endsWith(".css")
            ? `css/[name]-[hash][extname]`
            : `assets/[name]-[hash][extname]`;
        },
      },
    },
  },
});
