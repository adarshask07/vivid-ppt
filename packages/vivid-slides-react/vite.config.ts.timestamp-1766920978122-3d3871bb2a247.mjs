// vite.config.ts
import { defineConfig } from "file:///C:/Users/adarsh.satpute/Downloads/vivid---ai-presentation-builder/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.3/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/adarsh.satpute/Downloads/vivid---ai-presentation-builder/node_modules/.pnpm/@vitejs+plugin-react@4.7.0_vite@5.4.21_@types+node@22.19.3_/node_modules/@vitejs/plugin-react/dist/index.js";
import dts from "file:///C:/Users/adarsh.satpute/Downloads/vivid---ai-presentation-builder/node_modules/.pnpm/vite-plugin-dts@3.9.1_@type_f0196dbfe7290a076f04aaf668c8d191/node_modules/vite-plugin-dts/dist/index.mjs";
import { resolve } from "path";
var __vite_injected_original_dirname = "C:\\Users\\adarsh.satpute\\Downloads\\vivid---ai-presentation-builder\\packages\\vivid-slides-react";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ["src"],
      outDir: "dist"
    })
  ],
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "VividSlides",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime"
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "styles.css";
          return assetInfo.name || "";
        }
      }
    },
    sourcemap: true,
    minify: "esbuild"
  },
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhZGFyc2guc2F0cHV0ZVxcXFxEb3dubG9hZHNcXFxcdml2aWQtLS1haS1wcmVzZW50YXRpb24tYnVpbGRlclxcXFxwYWNrYWdlc1xcXFx2aXZpZC1zbGlkZXMtcmVhY3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFkYXJzaC5zYXRwdXRlXFxcXERvd25sb2Fkc1xcXFx2aXZpZC0tLWFpLXByZXNlbnRhdGlvbi1idWlsZGVyXFxcXHBhY2thZ2VzXFxcXHZpdmlkLXNsaWRlcy1yZWFjdFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYWRhcnNoLnNhdHB1dGUvRG93bmxvYWRzL3ZpdmlkLS0tYWktcHJlc2VudGF0aW9uLWJ1aWxkZXIvcGFja2FnZXMvdml2aWQtc2xpZGVzLXJlYWN0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIGR0cyh7XG4gICAgICBpbnNlcnRUeXBlc0VudHJ5OiB0cnVlLFxuICAgICAgaW5jbHVkZTogW1wic3JjXCJdLFxuICAgICAgb3V0RGlyOiBcImRpc3RcIixcbiAgICB9KSxcbiAgXSxcbiAgYnVpbGQ6IHtcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvaW5kZXgudHNcIiksXG4gICAgICBuYW1lOiBcIlZpdmlkU2xpZGVzXCIsXG4gICAgICBmb3JtYXRzOiBbXCJlc1wiLCBcImNqc1wiXSxcbiAgICAgIGZpbGVOYW1lOiAoZm9ybWF0KSA9PiBgaW5kZXguJHtmb3JtYXQgPT09IFwiZXNcIiA/IFwianNcIiA6IFwiY2pzXCJ9YCxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGV4dGVybmFsOiBbXCJyZWFjdFwiLCBcInJlYWN0LWRvbVwiLCBcInJlYWN0L2pzeC1ydW50aW1lXCJdLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICByZWFjdDogXCJSZWFjdFwiLFxuICAgICAgICAgIFwicmVhY3QtZG9tXCI6IFwiUmVhY3RET01cIixcbiAgICAgICAgICBcInJlYWN0L2pzeC1ydW50aW1lXCI6IFwianN4UnVudGltZVwiLFxuICAgICAgICB9LFxuICAgICAgICBhc3NldEZpbGVOYW1lczogKGFzc2V0SW5mbykgPT4ge1xuICAgICAgICAgIGlmIChhc3NldEluZm8ubmFtZSA9PT0gXCJzdHlsZS5jc3NcIikgcmV0dXJuIFwic3R5bGVzLmNzc1wiO1xuICAgICAgICAgIHJldHVybiBhc3NldEluZm8ubmFtZSB8fCBcIlwiO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICBtaW5pZnk6IFwiZXNidWlsZFwiLFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmNcIiksXG4gICAgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1ZCxTQUFTLG9CQUFvQjtBQUNwZixPQUFPLFdBQVc7QUFDbEIsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsZUFBZTtBQUh4QixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixJQUFJO0FBQUEsTUFDRixrQkFBa0I7QUFBQSxNQUNsQixTQUFTLENBQUMsS0FBSztBQUFBLE1BQ2YsUUFBUTtBQUFBLElBQ1YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLEtBQUs7QUFBQSxNQUNILE9BQU8sUUFBUSxrQ0FBVyxjQUFjO0FBQUEsTUFDeEMsTUFBTTtBQUFBLE1BQ04sU0FBUyxDQUFDLE1BQU0sS0FBSztBQUFBLE1BQ3JCLFVBQVUsQ0FBQyxXQUFXLFNBQVMsV0FBVyxPQUFPLE9BQU8sS0FBSztBQUFBLElBQy9EO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsU0FBUyxhQUFhLG1CQUFtQjtBQUFBLE1BQ3BELFFBQVE7QUFBQSxRQUNOLFNBQVM7QUFBQSxVQUNQLE9BQU87QUFBQSxVQUNQLGFBQWE7QUFBQSxVQUNiLHFCQUFxQjtBQUFBLFFBQ3ZCO0FBQUEsUUFDQSxnQkFBZ0IsQ0FBQyxjQUFjO0FBQzdCLGNBQUksVUFBVSxTQUFTLFlBQWEsUUFBTztBQUMzQyxpQkFBTyxVQUFVLFFBQVE7QUFBQSxRQUMzQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxJQUMvQjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
