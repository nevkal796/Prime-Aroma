import AdminSidebar from "./AdminSidebar";
import AdminMobileNav from "./AdminMobileNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#EDE8D0] md:flex-row">
      <AdminMobileNav />
      <AdminSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
