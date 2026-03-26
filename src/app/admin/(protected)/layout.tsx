import { isAdminAuthenticated } from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}

