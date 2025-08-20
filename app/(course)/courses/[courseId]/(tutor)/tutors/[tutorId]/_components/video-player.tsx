"use client";

import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


interface VideoPlayerProps {
  playbackId: string;
  courseId: string | null;
  tutorId: string;
  nextTutorId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
}

export const VideoPlayer = ({
  playbackId,
  courseId,
  tutorId,
  nextTutorId,
  isLocked,
  completeOnEnd,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  const handleCompletion = async () => {
    if (!completeOnEnd || !courseId) return;

    try {
      const response = await fetch(`/api/tutor/${tutorId}/complete`, {
        method: "POST",
      });
      if (response.ok) {
        toast.success("Tutorial Completed, You've successfully completed this tutorial!");
        console.log(
          `[${new Date().toISOString()} VideoPlayer] Tutorial completed`,
          { tutorId, courseId }
        );
      } else {
        toast.error("Error,Failed to mark tutorial as completed.");
      }
    } catch (error) {
      console.error(
        `[${new Date().toISOString()} VideoPlayer] Completion error:`,
        error
      );
      toast.error("Error, An error occurred while marking completion.");
    }
  };

  const handleNextTutorial = () => {
    if (nextTutorId) {
      router.push(`/tutor/${nextTutorId}`);
    }
  };

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
          <p className="text-sm">This Tutorial is locked</p>
        </div>
      )}
      {!isLocked && (
        <div className="relative">
          <MuxPlayer
            title={title}
            className={cn(!isReady && "hidden")}
            onCanPlay={() => setIsReady(true)}
            onEnded={() => {
              handleCompletion();
              if (nextTutorId) {
                handleNextTutorial();
              }
            }}
            autoPlay
            playbackId={playbackId}
          />
          {nextTutorId && (
            <button
              onClick={handleNextTutorial}
              className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Next Tutorial
            </button>
          )}
        </div>
      )}
    </div>
  );
};
