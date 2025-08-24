import { EduplatNavbar } from "./_components/eduplat-navbar";
import { EduplatSidebar } from "./_components/eduplat-sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      {/* Fixed Navbar */}
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <EduplatNavbar />
      </div>
      {/* Sidebar (visible on medium and larger screens) */}
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <EduplatSidebar />
      </div>
      {/* Main content area with padding to accommodate navbar and sidebar */}
      <main className="md:pl-56 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
