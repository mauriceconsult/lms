"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import axios from "axios";

interface VideoPlayerProps {
  playbackId: string;
  courseId: string;
  tutorId: string;
  nextTutorId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
}

export default function VideoPlayer({
  playbackId,
  courseId,
  tutorId,
  nextTutorId,
  isLocked,
  completeOnEnd,
  title,
}: VideoPlayerProps) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const onEnded = async () => {
    if (!completeOnEnd) return;

    try {
      await axios.patch(`/api/courses/${courseId}/tutors/${tutorId}/complete`);
      toast.success("Tutorial marked as completed.");
      if (nextTutorId) {
        console.log(
          `[${new Date().toISOString()} VideoPlayer] Navigating to next tutor: ${nextTutorId}`
        );
        router.push(`/courses/${courseId}?tutorialId=${nextTutorId}`);
      } else {
        console.log(
          `[${new Date().toISOString()} VideoPlayer] No next tutor available`
        );
        router.refresh();
      }
    } catch (error) {
      console.error(
        `[${new Date().toISOString()} VideoPlayer] Error marking tutor as completed:`,
        error
      );
      toast.error("Failed to mark tutorial as completed.");
    }
  };

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="relative aspect-video bg-slate-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm text-slate-500">Loading...</span>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="relative aspect-video bg-slate-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm text-slate-500">
            This tutorial is locked. Please enroll to access.
          </span>
        </div>
      </div>
    );
  }

  if (!playbackId) {
    return (
      <div className="relative aspect-video bg-slate-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm text-slate-500">
            No video available for this tutorial.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video">
      <video
        className={cn("w-full h-full")}
        controls
        autoPlay
        onEnded={onEnded}
        title={title}
      >
        <source src={playbackId} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
