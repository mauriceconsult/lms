import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PartyIdForm } from "../../../../(faculty)/faculties/[facultyId]/courses/[courseId]/tutors/[tutorId]/_components/partyId-form";

export default async function TuitionPaymentPage({
  params,
}: {
  params: { facultyId: string; courseId: string };
}) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const course = await db.course.findUnique({
    where: { id: params.courseId, facultyId: params.facultyId },
    select: { title: true, amount: true },
  });

  if (!course) {
    return redirect(`/faculties/${params.facultyId}`);
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-medium text-gray-900 mb-4">
        Enroll in {course.title}
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        Tuition Fee: {course.amount ? parseFloat(course.amount).toFixed(2) : "N/A"} EUR
      </p>
      <PartyIdForm
        initialData={{ partyId: "" }}
        courseId={params.courseId}
        tutorId="" // Not needed for checkout
        facultyId={params.facultyId} // Added for checkout route
      />
    </div>
  );
}
