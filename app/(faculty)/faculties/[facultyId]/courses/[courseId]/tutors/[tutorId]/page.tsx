import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"; // Server-side auth
import { redirect } from "next/navigation";
import MuxPlayer from "@mux/mux-player-react"; // Default import
import { Prisma } from "@prisma/client"; // Import Prisma types

const tutorInclude = Prisma.validator<Prisma.TutorInclude>()({
  course: {
    include: { tutors: true },
  },
});

type TutorWithRelations = Prisma.TutorGetPayload<{
  include: typeof tutorInclude;
}>;

export default async function TutorIdPage({
  params,
}: {
  params: { facultyId: string; courseId: string; tutorId: string };
}) {
  const authResult = await auth();
  if (!authResult.userId) {
    redirect("/");
  }

  const { courseId, tutorId } = params;

  const tutor: TutorWithRelations | null = await db.tutor.findUnique({
    where: { id: tutorId, courseId, isPublished: true },
    include: tutorInclude,
  });

  if (!tutor || !tutor.videoUrl) {
    return <p>Video not available.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {tutor.title || "Untitled Tutor"}
          </h1>
          <MuxPlayer
            playbackId={tutor.videoUrl.split("/").pop() || ""}
            metadata={{ video_title: tutor.title || "Tutor Video" }}
            style={{ width: "100%", aspectRatio: "16/9" }}
            primaryColor="#00CE00"
          />
        </div>
      </div>
    </div>
  );
}
