import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import CourseworkSidebar from "./_components/coursework-sidebar";
import { CourseworkNavbar } from "./_components/coursework-navbar";
import { redirect } from "next/navigation";

const CourseworkLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseworkId: string };
}) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const coursework = await db.coursework.findUnique({
    where: {
      id: params.courseworkId,
    },
    include: {
      attachments: true,
    },
  });
  if (!coursework) {
    return <div>Coursework not found.</div>;
  }
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseworkNavbar coursework={[coursework]} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col inset-y-0 z-50">
        <CourseworkSidebar coursework={[coursework]} />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};
export default CourseworkLayout;
