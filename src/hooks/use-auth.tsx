import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Lightweight auth state — no Firebase SDK required until the user actually signs in.
// We lazy-load firebase/auth only when needed to keep the initial bundle small.

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  banned: boolean;
  banMessage?: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  loading: true,
  banned: false,
  banMessage: null,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [banned, setBanned] = useState(false);
  const [banMessage, setBanMessage] = useState<string | null>(null);

  useEffect(() => {
    // Dynamically import firebase only on the client
    let unsub: (() => void) | undefined;
    import("@/lib/firebase")
      .then(async ({ auth, onAuthStateChanged, resolvePendingRedirect }) => {
        // If the user just returned from a signInWithRedirect() Google flow,
        // consume the pending result so onAuthStateChanged fires the signed-in user.
        try {
          await resolvePendingRedirect();
        } catch {}

        const { isUserBanned, recordUserActivity } = await import("@/lib/admin-db");
        unsub = onAuthStateChanged(auth, async (u) => {
          const authUser = u
            ? { uid: u.uid, email: u.email, displayName: u.displayName, photoURL: u.photoURL }
            : null;
          setUser(authUser);

          if (authUser) {
            // Check ban status + kick banned users
            try {
              const disabled = await isUserBanned(authUser.uid);
              if (disabled) {
                // Fetch ban info
                const snap = await import("@/lib/firebase").then(async (m) => {
                  const snap = await m.getDoc(m.doc(m.db, "users", authUser.uid));
                  return snap.exists() ? snap.data() : {};
                });
                setBanned(true);
                setBanMessage(
                  (snap.ban_reason as string) ||
                    "Your account has been disabled. Contact an administrator for help.",
                );
                // Force sign-out banned user
                const { signOutUser } = await import("@/lib/firebase");
                await signOutUser();
                setUser(null);
                setLoading(false);
                return;
              } else {
                setBanned(false);
                setBanMessage(null);
              }
            } catch {
              setBanned(false);
            }

            // Log sign-in / user activity
            try {
              await recordUserActivity(authUser.uid, {
                email: authUser.email,
                displayName: authUser.displayName,
                photoURL: authUser.photoURL,
              });
            } catch {
              /* fire-and-forget */
            }
          }

          setLoading(false);
        });
      })
      .catch(() => setLoading(false));
    return () => unsub?.();
  }, []);

  async function signIn() {
    try {
      const { signInWithGoogle } = await import("@/lib/firebase");
      await signInWithGoogle();
    } catch (err) {
      // signInWithGoogle already handles popup-blocked → redirect fallback
      // internally. For user-initiated cancellations, silently no-op so we
      // don't flash a misleading error. For any *other* error (Firebase not
      // configured, Google provider disabled, unauthorized domain, etc.),
      // re-throw so the calling UI (LoginModal / auth gate) can surface it.
      const code = (err as { code?: string })?.code;
      const cancelled =
        code === "auth/popup-blocked" ||
        code === "auth/cancelled-popup-request" ||
        code === "auth/popup-closed-by-user" ||
        code === "auth/user-cancelled";

      if (cancelled) return;

      if (typeof window !== "undefined") console.warn("[sign-in]", err);
      throw err;
    }
  }

  async function signOut() {
    setBanned(false);
    setBanMessage(null);
    const { signOutUser } = await import("@/lib/firebase");
    await signOutUser();
  }

  return (
    <AuthContext.Provider value={{ user, loading, banned, banMessage, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
