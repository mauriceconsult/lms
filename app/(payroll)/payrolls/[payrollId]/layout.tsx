import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import PayrollSidebar from "./_components/payroll-sidebar";
import { PayrollNavbar } from "./_components/payroll-navbar";
import { redirect } from "next/navigation";

const PayrollLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { payrollId: string };
}) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const payroll = await db.payroll.findUnique({
    where: {
      id: params.payrollId,
    },
    include: {
      attachments: true,
    },
  });
  if (!payroll) {
    return <div>Payroll not found.</div>;
  }
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <PayrollNavbar payroll={[payroll]} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col inset-y-0 z-50">
        <PayrollSidebar payroll={[payroll]} />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};
export default PayrollLayout;
