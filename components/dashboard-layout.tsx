import { ReactNode } from "react";
import NavbarRoutes from "./navbar-routes";


interface DashboardLayoutProps {
  children: ReactNode;
  adminId?: string;
  courseId?: string;
}

export const DashboardLayout = ({
  children,
  adminId,
  courseId,
}: DashboardLayoutProps) => {
  return (
    <div className="h-full">
      <div className="h-[80px]">
        <NavbarRoutes adminId={adminId} courseId={courseId} />
      </div>
      {children}
    </div>
  );
};
