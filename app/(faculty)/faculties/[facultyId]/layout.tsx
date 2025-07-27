import { FacultySidebar } from "./_components/faculty-sidebar";
import { FacultyMobileSidebar } from "./_components/faculty-mobile-sidebar";
import { ReactNode } from "react";
import { FacultyNavbarRoutes } from "./_components/faculty-navbar-routes";

interface FacultyLayoutProps {
  children: ReactNode;
  params: Promise<{ facultyId?: string }>;
}

export default async function FacultyLayout({
  children,
  params,
}: FacultyLayoutProps) {
  const { facultyId } = await params;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <FacultyMobileSidebar facultyId={facultyId} />
      </div>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 fixed top-0 left-0 h-full bg-white shadow-sm">
        <FacultySidebar facultyId={facultyId} />
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Navbar */}
        <div className="p-4 bg-white shadow-sm">
          <FacultyNavbarRoutes facultyId={facultyId} />
        </div>
        {/* Page Content */}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
