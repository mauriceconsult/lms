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
  params: {
    facultyId: string;
  };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const faculty = await db.faculty.findUnique({
    where: {
      id: params.facultyId,
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
  if (!faculty || !school) {
    return redirect("/");
  }
  const requiredFields = [
    faculty.title,
    faculty.description,
    faculty.imageUrl,
    faculty.schoolId,
    faculty.courseworks.length > 0,
    faculty.courses.length > 0,
  ];
  const optionalFields = [
    faculty.noticeboards.length > 0,
    faculty.attachments.length > 0,
  ];
  const allFields = [...requiredFields, ...optionalFields];
  const totalFields = allFields.length;
  const completedFields = allFields.filter(Boolean).length;
  const completionText = `(${completedFields} of ${totalFields})`;
  const isComplete = requiredFields.every(Boolean);
  return (
    <>
      {!faculty.isPublished && (
        <Banner
          variant="warning"
          label="This faculty is not published yet. You can publish it once you have completed all required fields."
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
                facultyId={params.facultyId}
                isPublished={faculty.isPublished}
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
              <FacultyTitleForm initialData={faculty} facultyId={faculty.id} />
              <FacultySchoolForm
                initialData={faculty}
                facultyId={faculty.id}
                options={school.map((cat) => ({
                  label: cat.name,
                  value: cat.id,
                }))}
              />
              <FacultyDescriptionForm
                initialData={faculty}
                facultyId={faculty.id}
              />
              <FacultyImageForm initialData={faculty} facultyId={faculty.id} />
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={File} />
                  <h2 className="text-xl">Resources & Attachments</h2>
                </div>
                <FacultyAttachmentForm
                  initialData={faculty}
                  facultyId={faculty.id}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-xl">Faculty Courses</h2>
                </div>
                <FacultyCourseForm
                  initialData={faculty}
                  facultyId={faculty.id}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-xl">Faculty Coursework</h2>
                </div>
                <FacultyCourseworkForm
                  initialData={faculty}
                  facultyId={faculty.id}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-xl">Faculty Noticeboard</h2>
                </div>
                <FacultyNoticeboardForm
                  initialData={faculty}
                  facultyId={faculty.id}
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
