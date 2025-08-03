"use client";

import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";

interface VideoPlayerProps {
  playbackId: string | null; // Onboarding video playbackId
  title: string;
  tutorId: string; // Fixed typo from TutorId
  courseId: string;
  facultyId: string;
  nextTutorId?: string | null;
  isLocked: boolean;
  completeOnEnd: boolean;
  additionalPlaybacks?: string[]; // Array of additional video playbackIds
  isEligible: boolean; // Add eligibility check
}

export const VideoPlayer = ({
  playbackId,
  title,
  tutorId,
  courseId,
  facultyId,
  nextTutorId,
  isLocked,
  completeOnEnd,
  additionalPlaybacks = [],
  isEligible,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const [currentPlaybackId, setCurrentPlaybackId] = useState(playbackId);
  const router = useRouter();

  const handleEnded = async () => {
    if (completeOnEnd && nextTutorId) {
      try {
        await axios.post("/api/course/progress", {
          tutorId,
          courseId,
          facultyId,
        }); // Assume progress tracking
        toast.success("Progress saved");
        router.push(
          `/faculties/${facultyId}/courses/${courseId}/tutors/${nextTutorId}`
        );
      } catch (error) {
        toast.error("Failed to save progress");
      }
    }
  };

  if (!isEligible) {
    return (
      <div className="relative aspect-video bg-slate-800 flex items-center justify-center text-secondary">
        <Lock className="h-8 w-8" />
        <p className="text-sm ml-2">
          You are not eligible to view this content.
        </p>
      </div>
    );
  }

  if (!currentPlaybackId && !isLocked) {
    return (
      <div className="relative aspect-video bg-slate-800 flex items-center justify-center text-secondary">
        <p className="text-sm">No video available yet.</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This Topic is locked.</p>
        </div>
      )}
      {!isLocked && currentPlaybackId && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={handleEnded}
          autoPlay
          playbackId={currentPlaybackId}
        />
      )}
      {additionalPlaybacks.length > 0 && !isLocked && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Other Videos</h3>
          <select
            value={currentPlaybackId || ""}
            onChange={(e) => setCurrentPlaybackId(e.target.value || playbackId)}
            className="mt-2 block w-full p-2 border rounded"
          >
            <option value={playbackId || ""}>Onboarding: {title}</option>
            {additionalPlaybacks.map((pb, index) => (
              <option key={index} value={pb}>
                Video {index + 2}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
