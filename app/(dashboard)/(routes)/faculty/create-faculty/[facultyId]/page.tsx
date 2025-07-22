import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FacultyTitleForm } from "./_components/faculty-title-form";
import { LayoutDashboard, ListChecks, File } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { FacultyImageForm } from "./_components/faculty-image-form";
import { FacultyDescriptionForm } from "./_components/faculty-description-form";
import { FacultySchoolForm } from "./_components/faculty-school-form";
import { FacultyCourseForm } from "./_components/faculty-course-form";
import { FacultyAttachmentForm } from "./_components/faculty-attachment-form";
import { Banner } from "@/components/banner";
import { FacultyActions } from "./_components/faculty-actions";
import { FacultyNoticeboardForm } from "./_components/faculty-noticeboard-form";
import { FacultyCourseworkForm } from "./_components/faculty-coursework-form";

const FacultyIdPage = async ({
  params,
}: {
  params: Promise<{
    facultyId: string;
  }>;
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const resolvedParams = await params;
  const faculty = await db.faculty.findUnique({
    where: {
      id: resolvedParams.facultyId,
      userId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      courses: {
        orderBy: {
          position: "asc",
        },
      },
      noticeboards: true,
      courseworks: true,
    },
  });

  const school = await db.school.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!faculty || school.length === 0) {
    console.error(
      `[${new Date().toISOString()} FacultyIdPage] Faculty or school not found:`,
      { facultyId: resolvedParams.facultyId, userId }
    );
    return redirect("/");
  }

  // Memoize faculty data to ensure stability
  const initialData = {
    ...faculty,
    description: faculty.description ?? "", // Ensure description is never null
  };

  const requiredFields = [
    initialData.title,
    initialData.description,
    initialData.imageUrl,
    initialData.schoolId,
    initialData.courseworks.length > 0,
    initialData.courses.length > 0,
  ];
  const optionalFields = [
    initialData.noticeboards.length > 0,
    initialData.attachments.length > 0,
  ];
  const allFields = [...requiredFields, ...optionalFields];
  const totalFields = allFields.length;
  const completedFields = allFields.filter(Boolean).length;
  const completionText = `(${completedFields} of ${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!initialData.isPublished && (
        <Banner
          variant="warning"
          label="This faculty is not published yet. You can publish it once you have completed all required* fields."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Faculty creation</h1>
                <div className="text-sm text-slate-700">
                  <div>Completed fields {completionText}</div>
                </div>
              </div>
              <FacultyActions
                disabled={!isComplete}
                facultyId={resolvedParams.facultyId}
                isPublished={initialData.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Enter the Faculty details</h2>
              </div>
              <FacultyTitleForm
                initialData={initialData}
                facultyId={initialData.id}
              />
              <FacultySchoolForm
                initialData={initialData}
                facultyId={initialData.id}
                options={school.map((cat) => ({
                  label: cat.name,
                  value: cat.id,
                }))}
              />
              <FacultyDescriptionForm
                initialData={initialData}
                facultyId={initialData.id}
              />
              <FacultyImageForm
                initialData={initialData}
                facultyId={initialData.id}
              />
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={File} />
                  <h2 className="text-xl">Resources & Attachments</h2>
                </div>
                <FacultyAttachmentForm
                  initialData={initialData}
                  facultyId={initialData.id}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-xl">Courses</h2>
                </div>
                <FacultyCourseForm
                  initialData={initialData}
                  facultyId={initialData.id}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-xl">Courseworks</h2>
                </div>
                <FacultyCourseworkForm
                  initialData={initialData}
                  facultyId={initialData.id}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-xl">Noticeboards</h2>
                </div>
                <FacultyNoticeboardForm
                  initialData={initialData}
                  facultyId={initialData.id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FacultyIdPage;
