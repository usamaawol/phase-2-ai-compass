/**
 * useBookmarks — manages per-user bookmarked tools.
 * Signed-in users sync to Firestore: users/{uid}/bookmarks/{toolId}
 * Guests store bookmarks in localStorage only (no cross-device sync).
 */
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./use-auth";

const GUEST_KEY = "ai-compass-bookmarks";

function loadGuestBookmarks(): Set<string> {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveGuestBookmarks(ids: Set<string>) {
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify([...ids]));
  } catch {
    /* storage unavailable */
  }
}

export function useBookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  /* ── Load bookmarks ─────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setBookmarks(loadGuestBookmarks());
      setLoading(false);
      return;
    }

    setLoading(true);
    import("@/lib/admin-db")
      .then(({ getBookmarks }) => getBookmarks(user.uid))
      .then((ids) => {
        if (!cancelled) {
          setBookmarks(new Set(ids));
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  /* ── Toggle ─────────────────────────────────────────────── */
  const toggle = useCallback(
    (toolId: string) => {
      const next = new Set(bookmarks);
      const willAdd = !next.has(toolId);
      if (willAdd) next.add(toolId);
      else next.delete(toolId);

      setBookmarks(next);

      if (!user) {
        saveGuestBookmarks(next);
      } else {
        import("@/lib/admin-db")
          .then(({ addBookmark, removeBookmark }) =>
            willAdd ? addBookmark(user.uid, toolId) : removeBookmark(user.uid, toolId),
          )
          .catch(() => {
            /* sync failures are silent; local state already updated */
          });
      }
    },
    [bookmarks, user],
  );

  const isBookmarked = useCallback((toolId: string) => bookmarks.has(toolId), [bookmarks]);

  return { bookmarks, isBookmarked, toggle, loading };
}
