import { NavbarRoutes } from "@/components/navbar-routes";
import { Attachment, Course, Faculty } from "@prisma/client";
import { FacultyMobileSidebar } from "./faculty-mobile-sidebar";

interface FacultyNavbarProps {
  faculty: Faculty & {
    courses: (Course & { attachments: Attachment[] })[];
  };
}

export const FacultyNavbar = ({ faculty }: FacultyNavbarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <FacultyMobileSidebar faculty={faculty} />
      <NavbarRoutes />
    </div>
  );
};
