import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CourseCard } from "@/components/course-card";
import { Preview } from "@/components/preview";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatAmount } from "@/lib/format";

interface AdminIdPageProps {
  params: Promise<{
    adminId: string;
  }>;
}

const AdminIdPage = async ({ params }: AdminIdPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const { adminId } = await params;

  const admin = await db.admin.findUnique({
    where: {
      id: adminId,
      isPublished: true,
    },
    include: {
      school: true,
      courses: {
        where: {
          isPublished: true,
        },
        include: {
          tutors: {
            where: {
              isPublished: true,
            },
          },
        },
      },
    },
  });

  if (!admin) {
    return redirect("/");
  }

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Admin Details */}
        <div className="border rounded-lg p-4 bg-white shadow-sm w-full md:w-1/3">
          <div className="relative w-full aspect-square rounded-md overflow-hidden">
            <Image
              fill
              className="object-cover"
              alt={admin.title}
              src={admin.imageUrl ?? "/placeholder.jpg"}
            />
          </div>
          <div className="flex flex-col pt-4">
            <h1 className="text-2xl md:text-xl font-bold text-slate-800">
              {admin.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {admin.school?.name ?? "No school"}
            </p>
            {admin.position && (
              <p className="text-sm text-slate-600 mt-1">
                Position: {admin.position}
              </p>
            )}
            <div className="mt-3">
              <Preview value={admin.description} />
            </div>
            <Link href={`/admin/admins/${adminId}/noticeboards`}>
              <Button variant="outline" className="mt-4 w-full">
                View Noticeboards
              </Button>
            </Link>
          </div>
        </div>

        {/* Courses List */}
        <div className="flex-1">
          <h2 className="text-xl md:text-lg font-semibold text-slate-800 mb-4">
            Courses by {admin.title}
          </h2>
          {admin.courses.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No courses found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {admin.courses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  imageUrl={course.imageUrl ?? "/placeholder.jpg"}
                  tutorialsLength={course.tutors.length}
                  amount={formatAmount("")}
                  description={course.description ?? ""}
                  progress={null} // TODO: Implement progress if needed
                  admin={admin.title}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminIdPage;
