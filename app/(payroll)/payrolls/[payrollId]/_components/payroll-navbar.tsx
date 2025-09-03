// import { NavbarRoutes } from "@/components/navbar-routes";
import { Payroll } from "@prisma/client";
import { PayrollMobileSidebar } from "./payroll-mobile-sidebar";

interface PayrollNavbarProps {
    payroll: Payroll[];
    }

export const PayrollNavbar = ({
    payroll,
}: PayrollNavbarProps) => {
    return <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
        <PayrollMobileSidebar
            payroll={payroll}            
        />
        {/* <NavbarRoutes />       */}
  </div>
};
