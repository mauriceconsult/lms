import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default async function CourseIdPage({
  params,
}: {
  params: Promise<{ facultyId: string; courseId: string }>;
}) {
  console.log(`[${new Date().toISOString()} CourseIdPage] Route accessed:`, {
    params,
  });

  const { userId } = await auth();
  const { facultyId, courseId } = await params;

  if (!userId) {
    return redirect(
      `/sign-in?redirect=/faculties/${facultyId}/courses/${courseId}`
    );
  }

  console.log(`[${new Date().toISOString()} CourseIdPage] Fetching course:`, {
    courseId,
    facultyId,
    userId,
  });

  const course = await db.course.findUnique({
    where: { id: courseId, isPublished: true },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      amount: true,
      enrollments: {
        select: { id: true },
        where: { userId },
      },
      tutors: {
        select: { id: true, title: true },
        orderBy: { createdAt: "asc" },
        take: 1, // Get first tutor
      },
    },
  });

  if (!course) {
    console.error(
      `[${new Date().toISOString()} CourseIdPage] Course not found or not published:`,
      { courseId, userId }
    );
    return redirect(`/faculties/${facultyId}`);
  }

  const isEnrolled = course.enrollments.length > 0;
  const firstTutorId = course.tutors.length > 0 ? course.tutors[0].id : null;

  // Redirect to first tutor if exists and user is enrolled or admin
  if (
    firstTutorId &&
    (isEnrolled || userId === "user_2pOqv2tzOq6guQnvrQ8POLYPQ4q")
  ) {
    console.log(
      `[${new Date().toISOString()} CourseIdPage] Redirecting to first tutor:`,
      {
        courseId,
        tutorId: firstTutorId,
        userId,
      }
    );
    return redirect(
      `/faculties/${facultyId}/courses/${courseId}/tutors/${firstTutorId}`
    );
  }

  const defaultImageUrl = "/placeholder.png";
  const isValidImageUrl =
    course.imageUrl && course.imageUrl.startsWith("https://utfs.io/")
      ? course.imageUrl
      : defaultImageUrl;
  const formattedAmount = course.amount || "0.00";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium">
        {course.title || "Untitled Course"}
      </h1>
      <div className="text-sm text-slate-700 mb-6">
        {course.description
          ? course.description
              .replace(/<[^>]+>/g, "")
              .replace(/\s+/g, " ")
              .trim()
          : "No description available"}
      </div>
      <div className="relative h-60 w-full mb-6">
        <Image
          src={isValidImageUrl}
          alt={course.title || "Course Image"}
          fill
          className="object-cover rounded-md"
        />
      </div>
      {userId === "user_2pOqv2tzOq6guQnvrQ8POLYPQ4q" ? (
        <div className="mb-6">
          <h2 className="text-xl font-medium">Create Tutor</h2>
          <form
            action={async (formData: FormData) => {
              "use server";
              const title = formData.get("tutorTitle") as string;
              try {
                await db.tutor.create({
                  data: {
                    courseId,
                    userId,
                    title,
                    description: "New tutor",
                  },
                });
                console.log(
                  `[${new Date().toISOString()} CourseIdPage] Tutor created:`,
                  { courseId, title }
                );
              } catch (error) {
                console.error(
                  `[${new Date().toISOString()} CourseIdPage] Tutor creation error:`,
                  error
                );
              }
            }}
          >
            <Input
              name="tutorTitle"
              placeholder="Tutor Title"
              className="mb-2"
            />
            <Button type="submit">Create Tutor</Button>
          </form>
          <p className="text-sm text-slate-700 mt-4">
            No tutors available. Create one to add content.
          </p>
        </div>
      ) : (
        <div className="mb-6">
          <h2 className="text-xl font-medium">Enroll in Course</h2>
          <p className="text-sm text-slate-700 mb-4">
            Cost: ${formattedAmount}
          </p>
          <Button
            onClick={async () => {
              console.log(
                `[${new Date().toISOString()} CourseIdPage] Initiating MoMo payment:`,
                {
                  courseId,
                  amount: formattedAmount,
                  userId,
                }
              );
              try {
                const response = await fetch("/api/momo", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    amount: formattedAmount,
                    courseId,
                    userId,
                  }),
                });
                const data = await response.json();
                if (data.paymentUrl) {
                  window.location.href = data.paymentUrl;
                } else {
                  console.error(
                    `[${new Date().toISOString()} CourseIdPage] MoMo payment failed:`,
                    data
                  );
                }
              } catch (error) {
                console.error(
                  `[${new Date().toISOString()} CourseIdPage] MoMo payment error:`,
                  error
                );
              }
            }}
          >
            Enroll with MoMo
          </Button>
          <p className="text-sm text-slate-700 mt-4">
            No tutors available. Check back later for content.
          </p>
        </div>
      )}
    </div>
  );
}
