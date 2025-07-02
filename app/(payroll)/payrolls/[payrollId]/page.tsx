import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const PayrollIdpage = async ({ params }: { params: { payrollId: string } }) => {
  const payroll = await db.payroll.findUnique({
    where: {
      id: params.payrollId,
    },
    include: {
      facultyPayrolls: {
        where: {
          isPaid: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!payroll) {
    return redirect("/")
  }
 return redirect(`/payrolls/${payroll.id}/facultyPayrolls/${payroll.facultyPayrolls[0].id}`);
};

export default PayrollIdpage;
