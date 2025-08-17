// components/DashboardLayout.tsx
import { ReactNode } from "react";
import { NavbarRoutes } from "./navbar-routes";


interface DashboardLayoutProps {
  children: ReactNode;
  facultyId?: string;
  courseId?: string;
}

export const DashboardLayout = ({
  children,
  facultyId,
  courseId,
}: DashboardLayoutProps) => {
  return (
    <div className="h-full">
      <div className="h-[80px]">
        <NavbarRoutes facultyId={facultyId} courseId={courseId} />
      </div>
      {children}
    </div>
  );
};
