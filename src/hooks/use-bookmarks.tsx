/**
 * useBookmarks — manages per-user bookmarked tools.
 * Stores in Supabase: users/{uid}/bookmarks/{toolId}
 * Falls back to localStorage when not signed in.
 */
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./use-auth";

export function useBookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  /* ── Load bookmarks ─────────────────────────────────────── */
  useEffect(() => {
    if (!user) {
      // Fall back to localStorage for guests
      try {
        const raw = localStorage.getItem("ai-compass-bookmarks");
        setBookmarks(new Set(raw ? JSON.parse(raw) : []));
      } catch {
        setBookmarks(new Set());
      }
      return;
    }

    // Load bookmarks from localStorage (keyed by uid when signed in)
    const key = user ? `ai-compass-bookmarks-${user.uid}` : "ai-compass-bookmarks";
    try {
      const raw = localStorage.getItem(key);
      setBookmarks(new Set(raw ? JSON.parse(raw) : []));
    } catch {
      setBookmarks(new Set());
    }
    setLoading(false);
  }, [user]);

  /* ── Persist helper ─────────────────────────────────────── */
  const persist = useCallback(
    (next: Set<string>) => {
      setBookmarks(next);
      try {
        const key = user ? `ai-compass-bookmarks-${user.uid}` : "ai-compass-bookmarks";
        localStorage.setItem(key, JSON.stringify([...next]));
      } catch {
        /* storage unavailable */
      }
    },
    [user],
  );

  /* ── Toggle ─────────────────────────────────────────────── */
  const toggle = useCallback(
    (toolId: string) => {
      const next = new Set(bookmarks);
      if (next.has(toolId)) next.delete(toolId);
      else next.add(toolId);
      persist(next);
    },
    [bookmarks, persist],
  );

  const isBookmarked = useCallback((toolId: string) => bookmarks.has(toolId), [bookmarks]);

  return { bookmarks, isBookmarked, toggle, loading };
}
