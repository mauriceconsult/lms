import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTutor } from "@/actions/get-tutor";
import { Banner } from "@/components/banner";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File, LayoutDashboard } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { PartyIdForm } from "./_components/partyId-form";

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
    attachments,
    nextTutor,
    userProgress,
    tuition,
  } = await getTutor({
    userId,
    courseId: params.courseId,
    tutorId: params.tutorId,
  });
  if (!tutor || !course) {
    return redirect("/");
  }
  const isLocked = !tutor.isFree && !tuition;
  const completeOnEnd = !!tuition && !userProgress?.isCompleted;
  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner label="You have completed this topic" variant="success" />
      )}
      {isLocked && (
        <Banner
          label="This topic is locked. Please enroll in the course to access it."
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Pay with MTN MoMo</h2>
              </div>
              <PartyIdForm
                initialData={{
                  partyId: "",
                }}
                courseId={params.courseId}
                tutorId={params.tutorId}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{tutor.title}</h2>

            {tuition ? (
              <div>{/** //TODO: Course Progress button */}</div>
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                amount={course.amount!}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={tutor.description!} />
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    target="_blank"
                    href={attachment.url}
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
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

export default TutorIdPage;
