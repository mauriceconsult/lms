import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PayrollTitleForm } from "./_components/payroll-title-form";
import { LayoutDashboard, ListChecks, File, ArrowLeft } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { PayrollSchoolForm } from "./_components/payroll-school-form";
import { PayrollAttachmentForm } from "./_components/payroll-attachment-form";
import { Banner } from "@/components/banner";
import { PayrollActions } from "./_components/payroll-actions";
import { PayrollFacultyPayrollForm } from "./_components/payroll-facultyPayroll-form";
import Link from "next/link";

const PayrollIdPage = async ({
  params,
}: {
  params: {
    payrollId: string;
  };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const payroll = await db.payroll.findUnique({
    where: {
      id: params.payrollId,
      userId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      facultyPayrolls: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  const school = await db.school.findMany({
    orderBy: {
      name: "asc",
    },
  });
  if (!payroll || !school) {
    return redirect("/");
  }
  const requiredFields = [
    payroll.title,
    payroll.schoolId,
    payroll.facultyPayrolls.length > 0,
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} of ${totalFields})`;
  const isComplete = requiredFields.every(Boolean);
  return (
    <>
      {!payroll.isPublished && (
        <Banner
          variant="warning"
          label="This Payroll is unpublished. A paid Faculty Payroll is required for this Payroll to be publishable."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
              href={`/payroll/create-payroll/${params.payrollId}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Payroll creation.
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Payroll creation</h1>
                <div className="text-sm text-slate-700">
                  <div>Completed fields {completionText}</div>
                </div>
              </div>
              <PayrollActions
                disabled={!isComplete}
                payrollId={params.payrollId}
                isPublished={payroll.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Enter the Payroll details</h2>
              </div>
              <PayrollTitleForm initialData={payroll} payrollId={payroll.id} />
              <PayrollSchoolForm
                initialData={payroll}
                payrollId={payroll.id}
                options={school.map((cat) => ({
                  label: cat.name,
                  value: cat.id,
                }))}
              />
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={File} />
                  <h2 className="text-xl">Payroll Resources & Attachments</h2>
                </div>
                <PayrollAttachmentForm
                  initialData={payroll}
                  payrollId={payroll.id}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-xl">Faculty Payrolls</h2>
                </div>
                <PayrollFacultyPayrollForm
                  initialData={payroll}
                  payrollId={payroll.id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayrollIdPage;
