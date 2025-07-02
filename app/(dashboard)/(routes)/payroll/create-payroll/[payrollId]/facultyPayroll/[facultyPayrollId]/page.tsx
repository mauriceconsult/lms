import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Banner } from "@/components/banner";
import { FacultyPayrollActions } from "./_components/facultyPayroll-actions";
import { FacultyPayrollTitleForm } from "./_components/facultyPayroll-title-form";
import { FacultyPayrollForm } from "./_components/facultyPayroll-payroll-form";


const FacultyPayrollIdPage = async ({
  params,
}: {
  params: {
    payrollId: string;
    facultyPayrollId: string;
  };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const facultyPayroll = await db.facultyPayroll.findUnique({
    where: {
      id: params.facultyPayrollId,
      payrollId: params.payrollId,
      userId,
    },
    include: {
      attachments: true,
    },
  });

  const payroll = await db.payroll.findMany({
    orderBy: {
      title: "asc",
    },
  });
  console.log(payroll);
  if (!payroll || !facultyPayroll) {
    return redirect("/");
  }
  const requiredFields = [
    facultyPayroll.payrollId,
    facultyPayroll.title,
  ];
  const optionalFields = [
    facultyPayroll.attachments.length > 0,
  ];
  const allFields = [...requiredFields, ...optionalFields];
  const totalFields = allFields.length;
  const completedFields = allFields.filter(Boolean).length;
  const completionText = `(${completedFields} of ${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!facultyPayroll.isPaid && (
        <Banner
          variant="warning"
          label="This FacultyPayroll is unpaid. Please pay to publish it."
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
              Back to Faculty creation.
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">
                  FacultyPayroll creation
                </h1>
                <div className="text-sm text-slate-700">
                  <div>Completed fields {completionText}</div>
                </div>
              </div>
              <FacultyPayrollActions
                disabled={!isComplete}
                payrollId={params.payrollId}
                facultyPayrollId={params.facultyPayrollId}
                isPublished={facultyPayroll.isPaid}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your facultyPayroll</h2>
              </div>
            </div>
            <FacultyPayrollTitleForm
              initialData={facultyPayroll}
              payrollId={facultyPayroll.payrollId || ""}
              facultyPayrollId={facultyPayroll.id}
            />

            <FacultyPayrollForm
              initialData={facultyPayroll}
              facultyPayrollId={facultyPayroll.id}
              payrollId={facultyPayroll.payrollId || ""}
              options={payroll.map((cat) => ({
                label: cat.title,
                value: cat.id,
              }))}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default FacultyPayrollIdPage;
