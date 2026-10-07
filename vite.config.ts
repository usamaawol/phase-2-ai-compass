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
    build: {
      // Raise chunk warning threshold (admin panel is intentionally large)
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          // Split vendor libraries into separate chunks for better caching
          manualChunks: {
            // Core React runtime — changes rarely
            "vendor-react": ["react", "react-dom"],
            // Router — changes with app upgrades
            "vendor-router": [
              "@tanstack/react-router",
              "@tanstack/react-start",
              "@tanstack/react-query",
            ],
            // Radix UI primitives — changes rarely
            "vendor-radix": [
              "@radix-ui/react-dialog",
              "@radix-ui/react-dropdown-menu",
              "@radix-ui/react-select",
              "@radix-ui/react-tooltip",
              "@radix-ui/react-tabs",
            ],
            // Icons — large but static
            "vendor-icons": ["lucide-react"],
            // Firebase — lazy-loaded but chunk it separately
            "vendor-firebase": ["firebase"],
          },
        },
      },
    },
  },
});
