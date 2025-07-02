import { auth } from "@clerk/nextjs/server";
import { Payroll } from "@prisma/client";
import { PayrollSidebarItem } from "./payroll-sidebar-item";

interface PayrollSidebarProps {
  payroll: Payroll[];
};
  
export const PayrollSidebar = async ({ payroll }: PayrollSidebarProps) => {
  const { userId } = await auth();
    if (!userId) {
        return <div>Please log in to view this page.</div>
    }
    return (
      <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
        <div className="p-8 flex flex-col border-b">
          <h1 className="font-semibold">
            {payroll.length > 0 ? payroll[0].title : "No Payrolls"}
          </h1>
            </div>
            <div className="flex flex-col w-full">
              {payroll.map((faculty) => (
                  <PayrollSidebarItem
                  key={faculty.id}
                  id={faculty.id}
                  label={faculty.title}
                  payrollId={faculty.id}
                  isCompleted={false} />
              ))}
            </div>
        </div>
    );
};
export default PayrollSidebar;