import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const PayrollIdpage = async ({ params }: { params: { payrollId: string } }) => {
  const payroll = await db.payroll.findUnique({
    where: {
      id: params.payrollId,
    },
    include: {
      attachments: true,
    },
  });
  if (!payroll) {
    return redirect("/")
  }
 return redirect(`/payrolls/${payroll.id}`);
};

export default PayrollIdpage;
