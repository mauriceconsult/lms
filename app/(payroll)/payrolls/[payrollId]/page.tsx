import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LayoutDashboard} from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
// import { PayrollActions } from "./_components/payroll-actions";
import Link from "next/link";
import { getPayroll } from "@/actions/get-payroll";
import { Banner } from "@/components/banner";

const PayrollIdpage = async ({ params }: { params: Promise<{ payrollId: string }> }) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const { payroll, school } = await getPayroll({
    userId,
    schoolId: (await params).payrollId,
    payrollId: (await params).payrollId,
  });
  if (!school || !payroll) {
    return redirect("/");
  }
  // const isLocked = !payroll.userId;

  // return redirect(`/payrolls/${payroll.id}`);
  return (
    <>
      {!payroll.isPublished && (
        <Banner
          variant="warning"
          label="This Payroll is unpublished. Please publish for it to be visible to faculty."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/payrolls/${payroll.id}`}
              className="text-blue-600 hover:underline"
            >
              View Payroll
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Payroll creation</h1>
                {/* <div className="text-sm text-slate-700">
                  <div>Completed fields {completionText}</div>
                </div> */}
              </div>
              {/* <PayrollActions
            disabled={!isComplete}
            payrollId={params.payrollId}
            isPublished={payroll.isPublished}
          /> */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-x-2">
                    <IconBadge icon={LayoutDashboard} />
                    <h2 className="text-xl">Enter the Payroll details</h2>
                  </div>
                  {/* <PayrollTitleForm
                    initialData={payroll}
                    payrollId={payroll.id}
                  />               */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>    
    </>
  );
};

export default PayrollIdpage;
