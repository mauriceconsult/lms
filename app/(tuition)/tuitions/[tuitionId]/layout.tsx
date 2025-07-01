import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import TuitionSidebar from "./_components/tuition-sidebar";
import { TuitionNavbar } from "./_components/tuition-navbar";
import { redirect } from "next/navigation";

const TuitionLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { tuitionId: string };
}) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const tuition = await db.tuition.findUnique({
    where: {
      id: params.tuitionId,
    },
    include: {
      attachments: true,
    },
  });
  if (!tuition) {
    return <div>Tuition not found.</div>;
  }
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <TuitionNavbar tuition={[tuition]} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col inset-y-0 z-50">
        <TuitionSidebar tuition={[tuition]} />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};
export default TuitionLayout;
