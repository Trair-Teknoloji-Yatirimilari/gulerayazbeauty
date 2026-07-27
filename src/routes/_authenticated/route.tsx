import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getAdminSession } from "@/lib/auth.functions";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const session = await getAdminSession();
    if (!session) throw redirect({ to: "/auth" });
    return { user: session };
  },
  component: () => <Outlet />,
});
