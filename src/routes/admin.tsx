/**
 * /admin layout route — wraps all /admin/* pages.
 * The AdminLayout component handles auth guard + admin sidebar.
 */
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminProvider } from "@/hooks/use-admin";

export const Route = createFileRoute("/admin")({
  component: AdminRoot,
});

function AdminRoot() {
  return (
    <AdminProvider>
      <AdminLayout />
    </AdminProvider>
  );
}
