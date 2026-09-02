import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/admin-shell";
import { getCrewSession } from "@/lib/session.functions";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const session = await getCrewSession();
    if (!session.isAdmin) {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
