import { getProgress } from "@/actions/get-progress";
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
    return redirect("/");
  }

  const tuition = await db.tuition.findUnique({
    where: {
      id: params.tuitionId,
    },
    include: {
      courseTuitions: {
        where: {
          isSubmitted: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!tuition) {
    return <div>Tuition not found.</div>;
  }
  const progressCount = await getProgress(userId, tuition.id);
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <TuitionNavbar tuition={tuition} progressCount={progressCount} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col inset-y-0 z-50">
        <TuitionSidebar tuition={tuition} progressCount={progressCount} />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};
export default TuitionLayout;
