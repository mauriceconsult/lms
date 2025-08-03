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
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="h-[80px] fixed inset-y-0 w-full z-50 bg-white shadow-sm">
        <FacultyNavbarRoutes facultyId={facultyId} />
      </div>
      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <FacultyMobileSidebar facultyId={facultyId} />
      </div>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50 bg-white shadow-sm">
        <FacultySidebar facultyId={facultyId} />
      </div>
      {/* Main Content */}
      <div className="flex-1 md:pl-56 pt-[80px]">
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
