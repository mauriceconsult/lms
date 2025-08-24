"use client";

import { VideoPlayer } from "@/app/(course)/courses/[courseId]/(tutor)/tutors/[tutorId]/_components/video-player";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Tutor } from "@/actions/get-dashboard-courses";

interface TutorListProps {
  tutorials: Tutor[];
  courseId: string;
  isEnrolled: boolean;
}

export default function TutorList({ tutorials, courseId, isEnrolled }: TutorListProps) {
  const searchParams = useSearchParams();
  const selectedTutorId = searchParams.get("tutorId");

  const getTutorStatus = (tutor: Tutor, index: number) => {
    const nextTutor = tutorials[index + 1];
    return {
      isLocked: !(tutor.isFree ?? false) && !isEnrolled,
      completeOnEnd: !(tutor.isFree ?? false) && isEnrolled,
      nextTutorId: nextTutor?.id ?? null,
    };
  };

  return (
    <div className="space-y-2 text-sm sm:text-base">
      {tutorials.map((tutor, index) => {
        const { isLocked, completeOnEnd, nextTutorId } = getTutorStatus(tutor, index);
        return (
          <div key={tutor.id} className="space-y-2">
            <Link
              href={isLocked ? "#" : `/courses/${courseId}?tutorialId=${tutor.id}`}
              className={`block p-2 rounded-md ${
                selectedTutorId === tutor.id
                  ? "bg-blue-100"
                  : isLocked
                  ? "bg-gray-200 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
              onClick={() =>
                isLocked
                  ? console.log(`[${new Date().toISOString()} TutorList] Locked tutor clicked: ${tutor.id}`)
                  : console.log(`[${new Date().toISOString()} TutorList] Navigating to tutor: ${tutor.id}`)
              }
            >
              <div className="flex items-center justify-between">
                <span>{tutor.title}</span>
                {(tutor.isFree ?? false) ? (
                  <span className="text-green-500 text-xs sm:text-sm">(Free)</span>
                ) : isLocked ? (
                  <span className="text-red-500 text-xs sm:text-sm">(Locked)</span>
                ) : (
                  <span className="text-blue-500 text-xs sm:text-sm">(Unlocked)</span>
                )}
              </div>
            </Link>
            {selectedTutorId === tutor.id && !isLocked && (
              <VideoPlayer
                playbackId={tutor.playbackId ?? ""}
                courseId={courseId}
                tutorialId={tutor.id}
                nextTutorId={nextTutorId ?? ""}
                isLocked={isLocked}
                completeOnEnd={completeOnEnd}
                title={tutor.title}
              />
            )}
          </div>
        );
      })}
      {tutorials.length === 0 && (
        <div className="text-center text-xs sm:text-sm text-muted-foreground mt-4">
          No Tutorials found.
        </div>
      )}
    </div>
  );
}
