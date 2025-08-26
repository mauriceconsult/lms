import { Sidebar } from "@/app/(dashboard)/_components/sidebar";
import { AdminNavbar } from "../../_components/admin-navbar";
// import { AdminSidebar } from "../../_components/admin-sidebar";

const AdminLayout = ({ children }: {
    children: React.ReactNode
}) => {
  return (
      <div className="h-full">
          <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
              <AdminNavbar/>              
          </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-[80px] h-full">{children}</main>
    </div>
  );
}
export default AdminLayout;
