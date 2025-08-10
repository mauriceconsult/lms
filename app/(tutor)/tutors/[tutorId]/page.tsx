import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function TutorIdPage({
  params,
}: {
  params: Promise<{ facultyId: string; courseId: string; tutorId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    return redirect(
      `/sign-in?redirect=/faculties/${(await params).facultyId}/courses/${
        (await params).courseId
      }/tutors/${(await params).tutorId}`
    );
  }

  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  if (!isAdmin) {
    return redirect(`/faculties/${(await params).facultyId}/courses`);
  }

  const { facultyId, courseId, tutorId } = await params;

  const tutor = await db.tutor.findUnique({
    where: { id: tutorId, isPublished: true },
    select: { id: true, title: true, createdAt: true },
  });

  if (!tutor) {
    return redirect(`/faculties/${facultyId}/courses/${courseId}?role=admin`);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link
        className="flex items-center text-sm hover:opacity-75 transition mb-6"
        href={`/faculties/${facultyId}/courses/${courseId}?role=admin`}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Course
      </Link>
      <h1 className="text-2xl font-medium">
        Tutor: {tutor.title || "Untitled Tutor"}
      </h1>
      <div className="mt-6">
        <h2 className="text-xl font-medium">Tutor Details</h2>
        <div className="space-y-4 mt-4">
          <div>
            <h3 className="text-lg font-medium">Name</h3>
            <p className="text-sm text-gray-600">{tutor.title || "Untitled"}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Created</h3>
            <p className="text-sm text-gray-600">
              {new Date(tutor.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-medium">Edit Tutor</h2>
        <form className="space-y-4 mt-4">
          <div>
            <Input
              placeholder="Update tutor title"
              defaultValue={tutor.title || ""}
            />
            <Button type="submit" className="mt-2">
              <Save className="w-4 h-4 mr-2" />
              Update Tutor
            </Button>
          </div>
        </form>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-medium">Point of Sale (P.O.S.)</h2>
        <p className="text-sm text-gray-600 mt-2">
          Placeholder for P.O.S. functionality (e.g., payment processing, tutor
          assignments).
        </p>
        {/* Add P.O.S. implementation here when requirements are clear */}
      </div>
    </div>
  );
}
