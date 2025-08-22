"use client";

import { VideoPlayer } from "@/app/(course)/courses/[courseId]/(tutor)/tutors/[tutorId]/_components/video-player";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Tutor {
  id: string;
  title: string;
  isFree: boolean | null;
  position: number;
  playbackId: string | null;
}

interface TutorListProps {
  tutors: Tutor[];
  courseId: string;
}

export default function TutorList({ tutors, courseId }: TutorListProps) {
  const searchParams = useSearchParams();
  const selectedTutorId = searchParams.get("tutorId");
  const [enrollment, setEnrollment] = useState<{ isEnrolled: boolean } | null>(null);

  useEffect(() => {
    async function fetchEnrollment() {
      try {
        const response = await fetch(`/api/courses/${courseId}/enrollment`);
        if (response.ok) {
          const data = await response.json();
          setEnrollment(data);
        } else {
          console.error(`[${new Date().toISOString()} TutorList] Failed to fetch enrollment`);
          setEnrollment({ isEnrolled: false });
        }
      } catch (error) {
        console.error(`[${new Date().toISOString()} TutorList] Error fetching enrollment:`, error);
        setEnrollment({ isEnrolled: false });
      }
    }
    fetchEnrollment();
  }, [courseId]);

  const getTutorStatus = (tutor: Tutor, index: number) => {
    const nextTutor = tutors[index + 1];
    return {
      isLocked: !(tutor.isFree ?? false) && !(enrollment?.isEnrolled ?? false),
      completeOnEnd: !(tutor.isFree ?? false) && (enrollment?.isEnrolled ?? false),
      nextTutorId: nextTutor?.id ?? null,
    };
  };

  return (
    <div className="space-y-2">
      {tutors.map((tutor, index) => {
        const { isLocked, completeOnEnd, nextTutorId } = getTutorStatus(tutor, index);
        return (
          <div key={tutor.id} className="space-y-2">
            <Link
              href={`/courses/${courseId}?tutorId=${tutor.id}`}
              className={`block p-2 rounded-md ${selectedTutorId === tutor.id ? "bg-blue-100" : "hover:bg-gray-100"}`}
            >
              {tutor.title} {(tutor.isFree ?? false) && <span className="text-green-500 text-sm">(Free)</span>}
            </Link>
            {selectedTutorId === tutor.id && (
              <VideoPlayer
                playbackId={tutor.playbackId ?? ""}
                courseId={courseId}
                tutorId={tutor.id}
                nextTutorId={nextTutorId ?? ""}
                isLocked={isLocked}
                completeOnEnd={completeOnEnd}
                title={tutor.title}
              />
            )}
          </div>
        );
      })}
      {tutors.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-4">
          No Tutorials found.
        </div>
      )}
    </div>
  );
}
