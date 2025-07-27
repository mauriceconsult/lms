import { FacultyNavbarRoutes } from "./_components/faculty-navbar";
import { FacultySidebar } from "./_components/faculty-sidebar";

export default async function FacultyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ facultyId?: string }>;
}) {
  const { facultyId } = await params;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <FacultySidebar facultyId={facultyId} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <FacultyNavbarRoutes facultyId={facultyId} />

        {/* Page Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
