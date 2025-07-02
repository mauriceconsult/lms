import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import PayrollSidebar from "./payroll-sidebar";
import { Payroll } from "@prisma/client";

interface PayrollMobileSidebarProps {
    payroll: Payroll[];
    }
export const PayrollMobileSidebar = ({
    payroll,
}: PayrollMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 bg-white w-72">
        <PayrollSidebar payroll={payroll} />
      </SheetContent>
    </Sheet>
  );
};
