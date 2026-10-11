import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 min — catalog data doesn't change at runtime
        gcTime: 1000 * 60 * 10,   // keep in cache 10 min
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",          // preload route on link hover/focus
    defaultPreloadDelay: 80,           // start after 80ms hover — avoids noisy preloads
    defaultPreloadStaleTime: 0,
    defaultPendingMs: 200,             // only show pending spinner after 200ms
    defaultPendingMinMs: 300,          // keep spinner at least 300ms to avoid flash
  });

  return router;
};
