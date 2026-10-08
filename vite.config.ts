// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    resolve: {
      tsconfigPaths: true,
    },
    build: {
      target: "es2022",
      cssMinify: "lightningcss",
      minify: "esbuild",
      cssCodeSplit: true,
      sourcemap: false,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            // Core React runtime — changes rarely, excellent cache hit
            if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
              return "vendor-react";
            }
            // Router & query
            if (id.includes("@tanstack/react-router") || id.includes("@tanstack/react-start")) {
              return "vendor-router";
            }
            if (id.includes("@tanstack/react-query")) {
              return "vendor-query";
            }
            if (id.includes("@tanstack/zod-adapter") || id.includes("node_modules/zod/")) {
              return "vendor-zod";
            }
            // Icons — huge but static, cache forever
            if (id.includes("lucide-react")) {
              return "vendor-icons";
            }
            // Firebase — lazy loaded on demand
            if (id.includes("node_modules/firebase/")) {
              if (id.includes("/auth/")) return "vendor-firebase-auth";
              if (id.includes("/firestore/")) return "vendor-firebase-firestore";
              if (id.includes("/storage/")) return "vendor-firebase-storage";
              if (id.includes("/app/")) return "vendor-firebase-app";
              return "vendor-firebase";
            }
            // Forms
            if (id.includes("react-hook-form") || id.includes("@hookform/resolvers")) {
              return "vendor-forms";
            }
            // UI helpers
            if (
              id.includes("class-variance-authority") ||
              id.includes("clsx") ||
              id.includes("tailwind-merge") ||
              id.includes("cmdk") ||
              id.includes("sonner") ||
              id.includes("tw-animate-css")
            ) {
              return "vendor-ui";
            }
            // Charts (admin only)
            if (id.includes("recharts")) {
              return "vendor-charts";
            }
            // Extra UI libs
            if (
              id.includes("embla-carousel-react") ||
              id.includes("react-day-picker") ||
              id.includes("date-fns") ||
              id.includes("vaul") ||
              id.includes("react-resizable-panels")
            ) {
              return "vendor-extra-ui";
            }
            // Radix primitives — core used on every page
            if (id.includes("@radix-ui/")) {
              const core = [
                "react-dialog",
                "react-dropdown-menu",
                "react-select",
                "react-tooltip",
                "react-tabs",
                "react-slot",
                "react-label",
              ];
              if (core.some((c) => id.includes(`@radix-ui/${c}`))) return "vendor-radix-core";
              return "vendor-radix-extra";
            }
            return undefined;
          },
          // Use content-based hash filenames for aggressive HTTP caching
          chunkFileNames: "assets/chunk-[name]-[hash:8].js",
          entryFileNames: "assets/entry-[name]-[hash:8].js",
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name ?? "";
            if (/\.(png|jpe?g|svg|webp|gif|ico)$/i.test(name)) {
              return "assets/img/[name]-[hash:6][extname]";
            }
            if (/\.css$/i.test(name)) {
              return "assets/css/[name]-[hash:8][extname]";
            }
            if (/\.(woff2?|ttf|eot|otf)$/i.test(name)) {
              return "assets/fonts/[name]-[hash:6][extname]";
            }
            return "assets/[ext]/[name]-[hash:6][extname]";
          },
        },
      },
    },
    esbuild: {
      target: "es2022",
      legalComments: "none",
    },
  },
});
