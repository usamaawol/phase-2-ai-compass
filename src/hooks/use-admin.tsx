/**
 * useAdmin — provides { isAdmin, loading } based on the current Firebase user
 * and their Supabase user_roles row.
 *
 * Usage:
 *   const { isAdmin, loading } = useAdmin();
 *   if (!isAdmin) return <AccessDenied />;
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./use-auth";
import { isAdminUser } from "@/lib/admin-db";

interface AdminCtx {
  isAdmin: boolean;
  loading: boolean;
}

const AdminContext = createContext<AdminCtx>({ isAdmin: false, loading: true });

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    isAdminUser(user.uid)
      .then(setIsAdmin)
      .catch(() => setIsAdmin(false))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  return <AdminContext.Provider value={{ isAdmin, loading }}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  return useContext(AdminContext);
}
