import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VideoPlayer } from "@/app/(faculty)/faculties/[facultyId]/courses/[courseId]/tutors/[tutorId]/_components/video-player";
import VideoUploadForm from "@/app/(faculty)/faculties/[facultyId]/courses/[courseId]/tutors/[tutorId]/_components/video-upload-form";

const TutorIdPage = async ({
  params,
}: {
  params: Promise<{
    facultyId: string;
    courseId: string;
    tutorId: string;
  }>;
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const resolvedParams = await params;
  const tutor = await db.tutor.findUnique({
    where: {
      id: resolvedParams.tutorId,
    },
    include: {
      course: {
        select: {
          id: true,
          facultyId: true,
        },
      },
      muxData: true, // Should now work with corrected schema
    },
  });

  if (!tutor) {
    throw new Error("Tutor not found");
  }

  if (
    tutor.course?.id !== resolvedParams.courseId ||
    tutor.course?.facultyId !== resolvedParams.facultyId
  ) {
    throw new Error("Tutor does not belong to the specified course or faculty");
  }

  const isTutor = userId === tutor.userId;
  const hasVideo = !!tutor.muxDataId && !!tutor.muxData?.playbackId;
  const isPublished = tutor.isPublished ?? false;
  const nextTutor = await db.tutor.findFirst({
    where: {
      courseId: resolvedParams.courseId,
      facultyId: resolvedParams.facultyId,
      position: { gt: tutor.position ?? 0 },
    },
    orderBy: { position: "asc" },
  });
  const nextTutorId = nextTutor?.id;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium">
        Tutor: {tutor.title ?? "Untitled Tutor"}
      </h1>
      {!isPublished && (
        <p className="text-yellow-600">This tutor is not published yet.</p>
      )}
      {isPublished && !hasVideo && isTutor && (
        <VideoUploadForm
          tutorId={resolvedParams.tutorId}
          courseId={resolvedParams.courseId}
          facultyId={resolvedParams.facultyId}
        />
      )}
      {isPublished && hasVideo && (
        <VideoPlayer
          playbackId={tutor.muxData?.playbackId ?? null}
          title={tutor.title ?? "Untitled Tutor"}
          tutorId={resolvedParams.tutorId}
          courseId={resolvedParams.courseId}
          facultyId={resolvedParams.facultyId}
          nextTutorId={nextTutorId}
          isLocked={false} // Adjust based on locking logic
          completeOnEnd={!!nextTutorId}
          additionalPlaybacks={[]} // No multiple videos; adjust if needed
          isEligible={true} // Replace with eligibility logic
        />
      )}
      {!isPublished && isTutor && (
        <form
          action={async () => {
            "use server";
            await db.tutor.update({
              where: { id: resolvedParams.tutorId },
              data: { isPublished: true },
            });
            redirect(
              `/faculty/${resolvedParams.facultyId}/course/${resolvedParams.courseId}/tutor/${resolvedParams.tutorId}`
            );
          }}
        >
          <button
            type="submit"
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Publish Tutor
          </button>
        </form>
      )}
    </div>
  );
};

export default TutorIdPage;
