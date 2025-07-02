import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "./_components/payroll-data-table";
import { columns } from "./_components/payroll-columns";

const PayrollsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const payrolls = await db.payroll.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="p-6">
      <DataTable columns={columns} data={payrolls} />
    </div>
  );
};
export default PayrollsPage;
