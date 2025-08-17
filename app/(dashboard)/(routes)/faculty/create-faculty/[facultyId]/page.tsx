import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LayoutDashboard, ListChecks, File } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { FacultyTitleForm } from "./_components/faculty-title-form";
import { FacultyImageForm } from "./_components/faculty-image-form";
import { FacultyDescriptionForm } from "./_components/faculty-description-form";
import { FacultySchoolForm } from "./_components/faculty-school-form";
import { FacultyCourseForm } from "./_components/faculty-course-form";
import { FacultyAttachmentForm } from "./_components/faculty-attachment-form";
import { Banner } from "@/components/banner";
import { FacultyActions } from "./_components/faculty-actions";
import { FacultyNoticeboardForm } from "./_components/faculty-noticeboard-form";

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
  console.log("Resolved params:", resolvedParams);

  if (!resolvedParams.facultyId) {
    console.error("No facultyId provided in params");
    return <div>No faculty ID provided</div>;
  }

  const faculty = await db.faculty.findUnique({
    where: {
      id: resolvedParams.facultyId,
      userId,
    },
    include: {
      attachments: true, // Include all Attachment fields
      courses: true, // Include all Course fields
      noticeboards: true, // Include all Noticeboard fields
    },
  });

  console.log("Faculty query result:", JSON.stringify(faculty, null, 2));

  const school = await db.school.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  console.log("School query result:", school);

  if (!faculty) {
    console.error(
      `[${new Date().toISOString()} FacultyIdPage] Faculty not found:`,
      { facultyId: resolvedParams.facultyId, userId }
    );
    return <div>Faculty not found</div>;
  }

  if (school.length === 0) {
    console.error("No schools found in the database");
    return <div>No schools available</div>;
  }

  const initialData = {
    ...faculty,
    description: faculty.description ?? "",
    courses: faculty.courses ?? [],
    noticeboards: faculty.noticeboards ?? [],
    attachments: faculty.attachments ?? [],
  };

  const requiredFields = [
    initialData.title,
    initialData.description,
    initialData.imageUrl,
    initialData.schoolId,
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
          label="This Faculty is not published yet. To publish, complete the required* fields and ensure you have at least one published Course."
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
                <h2 className="text-xl">Enter Faculty details</h2>
              </div>
              <FacultyTitleForm
                initialData={initialData}
                facultyId={resolvedParams.facultyId}
              />
              <FacultySchoolForm
                initialData={initialData}
                facultyId={resolvedParams.facultyId}
                options={school.map((cat) => ({
                  label: cat.name,
                  value: cat.id,
                }))}
              />
              <FacultyDescriptionForm
                initialData={initialData}
                facultyId={resolvedParams.facultyId}
              />
              <FacultyImageForm
                initialData={initialData}
                facultyId={resolvedParams.facultyId}
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
                  facultyId={resolvedParams.facultyId}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-xl">Courses</h2>
                </div>
                <FacultyCourseForm
                  initialData={initialData}
                  facultyId={resolvedParams.facultyId}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-xl">Faculty notices</h2>
                </div>
                <FacultyNoticeboardForm
                  initialData={initialData}
                  facultyId={resolvedParams.facultyId}
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
