import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Banner } from "@/components/banner";

import { getNotice } from "@/actions/get-notice";

const TutorIdPage = async ({
  params,
}: {
  params: { noticeId: string; facultyId: string };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const {
    
  } = await getNotice({


  })
  
  return (
    <div>
    
        <Banner label="Notices" />
     
    
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          {/* <VideoPlayer
            tutorId={tutor.id}
            title={tutor.title}
            courseId={params.courseId}
            nextTutorId={nextTutor?.id}
            playbackId={muxData?.playbackId ?? null}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default TutorIdPage;
