import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CourseCard } from "@/components/course-card";

export default async function FacultyIdPage({
  params,
}: {
  params: Promise<{ facultyId: string }>;
}) {
  console.log(`[${new Date().toISOString()} FacultyIdPage] Route accessed:`, {
    params,
  });

  const { userId } = await auth();
  const { facultyId } = await params;

  if (!userId) {
    return redirect(`/sign-in?redirect=/faculties/${facultyId}`);
  }

  console.log(`[${new Date().toISOString()} FacultyIdPage] Fetching faculty:`, {
    facultyId,
    userId,
  });

  const faculty = await db.faculty.findUnique({
    where: { id: facultyId, isPublished: true },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      courses: {
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          amount: true,
          isPublished: true,
          createdAt: true,
        },
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
      },
      noticeboards: {
        select: { id: true, title: true },
        where: { isPublished: true },
      },
      attachments: { select: { id: true, url: true } },
    },
  });

  if (!faculty) {
    console.error(
      `[${new Date().toISOString()} FacultyIdPage] Faculty not found or not published:`,
      { facultyId, userId }
    );
    return redirect("/faculties");
  }

  console.log(`[${new Date().toISOString()} FacultyIdPage] Faculty fetched:`, {
    facultyId: faculty.id,
    title: faculty.title,
    imageUrl: faculty.imageUrl,
    courses: faculty.courses.length,
    noticeboards: faculty.noticeboards.length,
    attachments: faculty.attachments.length,
  });

  // Process description
  const processedDescription = faculty.description
    ? faculty.description
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim()
    : "No description available";

  // Validate and process courses
  const defaultImageUrl = "/placeholder.png";
  const courses = faculty.courses
    .filter((course) => {
      if (!course.id || typeof course.id !== "string") {
        console.error(
          `[${new Date().toISOString()} FacultyIdPage] Invalid course ID:`,
          { course }
        );
        return false;
      }
      return true;
    })
    .map((course) => {
      const isValidImageUrl =
        course.imageUrl && course.imageUrl.startsWith("https://utfs.io/")
          ? course.imageUrl
          : defaultImageUrl;
      if (
        !course.imageUrl ||
        course.imageUrl.includes("via.placeholder.com") ||
        !course.imageUrl.startsWith("https://utfs.io/")
      ) {
        console.warn(
          `[${new Date().toISOString()} FacultyIdPage] Invalid imageUrl for course:`,
          { id: course.id, imageUrl: course.imageUrl, isValidImageUrl }
        );
      }
      return {
        ...course,
        amount: course.amount != null ? course.amount.toString() : "0.00",
        imageUrl: isValidImageUrl,
      };
    });

  console.log(
    `[${new Date().toISOString()} FacultyIdPage] Courses processed:`,
    {
      courses: courses.map((c) => ({
        id: c.id,
        amount: c.amount,
        amountType: typeof c.amount,
        imageUrl: c.imageUrl,
      })),
    }
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium">
        {faculty.title || "Untitled Faculty"}
      </h1>
      <div className="text-sm text-slate-700 mb-6">{processedDescription}</div>
      <h2 className="text-xl font-medium mt-6">Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              facultyId={faculty.id}
              title={course.title || "Untitled Course"}
              imageUrl={course.imageUrl}
              amount={course.amount}
              faculty={faculty.title || "Unknown Faculty"}
              description={course.description}
              createdAt={course.createdAt}
              role={
                userId === "user_2pOqv2tzOq6guQnvrQ8POLYPQ4q"
                  ? "admin"
                  : "student"
              }
            />
          ))
        ) : (
          <p>No published courses available.</p>
        )}
      </div>
      <h2 className="text-xl font-medium mt-6">Noticeboards</h2>
      {faculty.noticeboards.map((noticeboard) => (
        <div key={noticeboard.id} className="p-4 border rounded-md">
          <p>{noticeboard.title}</p>
        </div>
      ))}
      <h2 className="text-xl font-medium mt-6">Attachments</h2>
      {faculty.attachments.map((attachment) => (
        <div key={attachment.id} className="p-4 border rounded-md">
          <a href={attachment.url} className="text-blue-500">
            {attachment.url}
          </a>
        </div>
      ))}
    </div>
  );
}
