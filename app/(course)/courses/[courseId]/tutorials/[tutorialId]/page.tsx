// app/(course)/courses/[courseId]/tutorials/[tutorialId]/page.tsx
import { getTutor } from "@/actions/get-tutor";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CourseEnrollButton from "./_components/course-enroll-button";
// import ProgressButton from "./_components/progress-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { BookOpen, File } from "lucide-react";
import { VideoPlayer } from "./_components/video-player";
// import { CourseProgress } from "@/components/course-progress";
import { CourseProgressButton } from "./_components/course-progress-button";

const TutorialIdPage = async ({
  params,
}: {
  params: Promise<{ courseId: string; tutorialId: string }>;
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const resolvedParams = await params;
  const {
    tutorial,
    course,
    muxData,
    assignments,
    attachments,
    nextTutorial,
    userProgress,
    tuition,
  } = await getTutor({
    userId,
    tutorId: resolvedParams.tutorialId,
    courseId: resolvedParams.courseId,
  });

  if (!tutorial || !course) {
    return redirect("/");
  }

  const isLocked = !tutorial.isFree && !tuition;
  // const completeOnEnd = !!tuition && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          variant={"success"}
          label="You already completed this Tutorial."
        />
      )}
      {isLocked && (
        <Banner
          variant={"warning"}
          label="You need to pay for this Course to watch this Tutorial."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            tutorialId={resolvedParams.tutorialId}
            title={tutorial.title}
            courseId={resolvedParams.courseId}
            nextTutorialId={nextTutorial?.id ?? ""}
            playbackId={muxData?.playbackId ?? ""}
            isLocked={isLocked}           
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{tutorial.title}</h2>
            {tuition ? (
              <CourseProgressButton
                tutorialId={(await params).tutorialId}
                courseId={(await params).courseId}
                nextTutorialId={nextTutorial?.id ?? ""}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton
                courseId={resolvedParams.courseId}
                amount={course.amount ?? ""}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={tutorial.objective} />
          </div>
          {!!assignments.length && (
            <>
              <Separator />
              <div className="p-4">
                {assignments.map((assignment) => (
                  <a
                    href={assignment.description ?? ""}
                    target="_blank"
                    key={assignment.title}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <BookOpen />
                    <p className="line-clamp-1">{assignment.title}</p>
                  </a>
                ))}
              </div>
            </>
          )}
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url ?? ""}
                    target="_blank"
                    key={attachment.url}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.url}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorialIdPage;
