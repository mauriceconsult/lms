import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

export default async function CourseIdPage({
  params,
}: {
  params: Promise<{ facultyId: string; courseId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    return redirect(
      `/sign-in?redirect=/faculties/${(await params).facultyId}/courses/${
        (await params).courseId
      }`
    );
  }

  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  if (!isAdmin) {
    return redirect(`/faculties/${(await params).facultyId}/courses`);
  }

  const { facultyId, courseId } = await params;

  const course = await db.course.findUnique({
    where: { id: courseId, facultyId, isPublished: true },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      amount: true,
      faculty: { select: { title: true } },
      tutors: { select: { id: true, title: true } },
      courseworks: { select: { id: true, title: true } },
      courseNoticeboards: { select: { id: true, description: true } },
    },
  });

  if (!course) {
    return redirect(`/faculties/${facultyId}/courses/list`);
  }

  // Utility function to strip HTML tags
  const stripHtmlTags = (html: string | null): string => {
    if (!html) return "";
    return html
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link
        className="flex items-center text-sm hover:opacity-75 transition mb-6"
        href={`/faculties/${facultyId}/courses/list`}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Course List
      </Link>
      <h1 className="text-2xl font-medium text-gray-900 mb-4">
        Course: {course.title || "Untitled Course"}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            Course Details
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Title</h3>
              <p className="text-sm text-gray-600">
                {course.title || "Untitled"}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Faculty</h3>
              <p className="text-sm text-gray-600">
                {course.faculty?.title || "Unknown Faculty"}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Description</h3>
              <p className="text-sm text-gray-600">
                {stripHtmlTags(course.description) ||
                  "No description available"}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Amount</h3>
              <p className="text-sm text-gray-600">
                {course.amount ? `$${course.amount}` : "Not set"}
              </p>
            </div>
            <div className="relative h-40 w-full">
              <Image
                src={course.imageUrl || "/mcalogo.png"}
                alt={course.title}
                width={400}
                height={160}
                className="object-cover rounded-md"
              />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            Edit Course
          </h2>
          <form className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Tutors</h3>
              <ul className="text-sm text-gray-600">
                {course.tutors.length > 0 ? (
                  course.tutors.map((tutor) => (
                    <li key={tutor.id}>{tutor.title || "Untitled Tutor"}</li>
                  ))
                ) : (
                  <li>No tutors assigned</li>
                )}
              </ul>
              <Input placeholder="Add tutor by ID or title" className="mt-2" />
              <Button type="submit" className="mt-2">
                <Save className="w-4 h-4 mr-2" />
                Update Tutors
              </Button>
            </div>
            <div>
              <h3 className="text-lg font-medium">Coursework</h3>
              <ul className="text-sm text-gray-600">
                {course.courseworks.length > 0 ? (
                  course.courseworks.map((work) => (
                    <li key={work.id}>{work.title || "Untitled Coursework"}</li>
                  ))
                ) : (
                  <li>No coursework assigned</li>
                )}
              </ul>
              <Input placeholder="Add coursework title" className="mt-2" />
              <Button type="submit" className="mt-2">
                <Save className="w-4 h-4 mr-2" />
                Update Coursework
              </Button>
            </div>
            <div>
              <h3 className="text-lg font-medium">Noticeboard</h3>
              <ul className="text-sm text-gray-600">
                {course.courseNoticeboards.length > 0 ? (
                  course.courseNoticeboards.map((notice) => (
                    <li key={notice.id}>
                      {stripHtmlTags(notice.description) || "Empty notice"}
                    </li>
                  ))
                ) : (
                  <li>No notices</li>
                )}
              </ul>
              <Textarea placeholder="Add notice description" className="mt-2" />
              <Button type="submit" className="mt-2">
                <Save className="w-4 h-4 mr-2" />
                Update Noticeboard
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
