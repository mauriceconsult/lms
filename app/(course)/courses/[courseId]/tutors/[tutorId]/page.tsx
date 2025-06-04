import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTutor } from "@/actions/get-tutor";
import { Banner } from "@/components/banner";
import { VideoPlayer } from "./_components/video-player";

const TutorIdPage = async ({
  params,
}: {
  params: { courseId: string; tutorId: string };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const {
    tutor,
    course,
    muxData,
    // attachments,
    nextTutor,
    userProgress,
    purchase,
  } = await getTutor({
    userId,
    courseId: params.courseId,
    tutorId: params.tutorId,
  });
  if (!tutor || !course) {
    return redirect("/");
  }
  const isLocked = !tutor.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;
  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner label="You have completed this topic" variant="success" />
      )}
      {isLocked && (
        <Banner
          label="You need to purchase this Course to watch this Topic"
          variant="warning"
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            tutorId={tutor.id}
            title={tutor.title}
            courseId={params.courseId}
            nextTutorId={nextTutor?.id}
            playbackId={muxData?.playbackId ?? null}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
      </div>
    </div>
  );
};

export default TutorIdPage;
