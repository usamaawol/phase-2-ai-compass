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
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamically import firebase only on the client
    let unsub: (() => void) | undefined;
    import("@/lib/firebase")
      .then(({ auth, onAuthStateChanged }) => {
        unsub = onAuthStateChanged(auth, (u) => {
          setUser(
            u
              ? { uid: u.uid, email: u.email, displayName: u.displayName, photoURL: u.photoURL }
              : null,
          );
          setLoading(false);
        });
      })
      .catch(() => setLoading(false));
    return () => unsub?.();
  }, []);

  async function signIn() {
    const { signInWithGoogle } = await import("@/lib/firebase");
    await signInWithGoogle();
  }

  async function signOut() {
    const { signOutUser } = await import("@/lib/firebase");
    await signOutUser();
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
