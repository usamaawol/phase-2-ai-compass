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
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "lucide-react",
        "@tanstack/react-query",
        "clsx",
        "tailwind-merge",
        "sonner",
        "class-variance-authority",
      ],
      exclude: [],
      holdUntilCrawlEnd: true,
    },
    build: {
      target: "es2022",
      cssMinify: "lightningcss",
      minify: "esbuild",
      cssCodeSplit: true,
      sourcemap: false,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1500,
      modulePreload: {
        polyfill: false,
      },
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
              return "vendor-react";
            }
            if (id.includes("node_modules/react-dom/client") || id.includes("react-dom/server")) {
              return "vendor-react";
            }
            if (id.includes("@tanstack/react-router") || id.includes("@tanstack/react-start")) {
              return "vendor-router";
            }
            if (id.includes("@tanstack/react-query")) {
              return "vendor-query";
            }
            if (id.includes("@tanstack/zod-adapter") || id.includes("node_modules/zod/")) {
              return "vendor-zod";
            }
            if (id.includes("lucide-react")) {
              return "vendor-icons";
            }
            if (id.includes("node_modules/firebase/")) {
              if (id.includes("/auth/")) return "vendor-firebase-auth";
              if (id.includes("/firestore/")) return "vendor-firebase-firestore";
              if (id.includes("/storage/")) return "vendor-firebase-storage";
              if (id.includes("/app/")) return "vendor-firebase-app";
              return "vendor-firebase";
            }
            if (id.includes("react-hook-form") || id.includes("@hookform/resolvers")) {
              return "vendor-forms";
            }
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
            if (id.includes("recharts")) {
              return "vendor-charts";
            }
            if (
              id.includes("embla-carousel-react") ||
              id.includes("react-day-picker") ||
              id.includes("date-fns") ||
              id.includes("vaul") ||
              id.includes("react-resizable-panels")
            ) {
              return "vendor-extra-ui";
            }
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
    oxc: {
      transform: {
        target: "es2022",
        legalComments: "none",
      },
    },
    ssr: {
      noExternal: ["lucide-react"],
    },
  },
});
