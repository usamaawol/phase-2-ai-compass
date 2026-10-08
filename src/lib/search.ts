import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { emptyFilters } from "./catalog";
export const discoverySearch = zodValidator(
  z.object({
    q: fallback(z.string(), "").default(""),
    category: fallback(z.string(), "").default(""),
    tag: fallback(z.string(), "").default(""),
    pricing: fallback(z.string(), "").default(""),
    source: fallback(z.string(), "").default(""),
    platform: fallback(z.string(), "").default(""),
    skill: fallback(z.string(), "").default(""),
    sort: fallback(z.string(), emptyFilters.sort).default(emptyFilters.sort),
  }),
);
