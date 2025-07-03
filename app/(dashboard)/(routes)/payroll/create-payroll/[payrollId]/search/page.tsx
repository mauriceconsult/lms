import { db } from "@/lib/db";
import { Schools } from "@/app/(dashboard)/(routes)/search/_components/schools";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getPayrolls } from "@/actions/get-payrolls";
import { SchoolsList } from "./_components/schools-list";
import { PayrollSearchInput } from "./_components/payroll-search-input";

interface PayrollSearchPageProps {
  searchParams: {
    title: string;
    schoolId: string;
  };
}
const PayrollSearchPage = async ({ searchParams }: PayrollSearchPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const schools = await db.school.findMany({
    orderBy: {
      name: "asc",
    },
  });
  const payrolls = await getPayrolls({
    userId,
    ...searchParams,
  });
  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <PayrollSearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Schools items={schools} />
        <SchoolsList item={payrolls} />
      </div>
    </>
  );
};
export default PayrollSearchPage;
