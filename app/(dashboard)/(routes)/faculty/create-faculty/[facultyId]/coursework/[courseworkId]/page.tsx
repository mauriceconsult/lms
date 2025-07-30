import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LayoutDashboard, File, ArrowLeft } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { CourseworkFacultyForm } from "./_components/coursework-faculty-form";
import { Banner } from "@/components/banner";
import { CourseworkDescriptionForm } from "./_components/coursework-description-form";
import { CourseworkTitleForm } from "./_components/coursework-title-form";
import { CourseworkAttachmentForm } from "./_components/coursework-attachment-form";
import { CourseworkActions } from "./_components/coursework-actions";
import Link from "next/link";

const CourseworkIdPage = async ({
  params,
}: {
  params: Promise<{
    facultyId: string;
    courseworkId: string;
  }>;
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const resolvedParams = await params;
  const coursework = await db.coursework.findFirst({
    where: {
      id: resolvedParams.courseworkId,
      facultyId: resolvedParams.facultyId,
      createdBy: userId, // Replaced userId with createdBy
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  const faculty = await db.faculty.findMany({
    orderBy: {
      title: "asc",
    },
  });
  if (!coursework || !faculty) {
    return redirect("/");
  }
  const requiredFields = [coursework.title, coursework.description];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} of ${totalFields})`;
  const isComplete = requiredFields.every(Boolean);
  return (
    <>
      {!coursework.isPublished && (
        <Banner
          variant="warning"
          label="This Coursework is unpublished. Once published, students can submit their projects."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
              href={`/faculty/create-faculty/${resolvedParams.facultyId}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Faculty creation.
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Coursework creation</h1>
                <div className="text-sm text-slate-700">
                  <div>Completed fields {completionText}</div>
                </div>
              </div>
              <CourseworkActions
                disabled={!isComplete}
                courseworkId={resolvedParams.courseworkId}
                facultyId={resolvedParams.facultyId}
                isPublished={coursework.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Enter the Coursework details</h2>
              </div>
              <CourseworkTitleForm
                initialData={coursework}
                courseworkId={coursework.id}
                facultyId={coursework.facultyId || ""}
              />
              <CourseworkFacultyForm
                initialData={coursework}
                courseworkId={coursework.id}
                facultyId={coursework.facultyId || ""}
                options={faculty.map((cat) => ({
                  label: cat.title,
                  value: cat.id,
                }))}
              />
              <CourseworkDescriptionForm
                initialData={coursework}
                courseworkId={coursework.id}
                facultyId={coursework.facultyId || ""}
              />
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={File} />
                  <h2 className="text-xl">Resources & Attachments</h2>
                </div>
                <CourseworkAttachmentForm
                  initialData={coursework}
                  courseworkId={coursework.id}
                  facultyId={coursework.facultyId || ""}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseworkIdPage;
