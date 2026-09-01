import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { AdminShell } = await import("@/components/admin/AdminShell");

  return <AdminShell userName={session.name}>{children}</AdminShell>;
}
