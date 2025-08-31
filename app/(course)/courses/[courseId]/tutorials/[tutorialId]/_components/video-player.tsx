"use client";

import { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface VideoPlayerProps {
  tutorialId: string;
  title: string;
  courseId: string;
  nextTutorialId: string;
  playbackId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
}

export default function VideoPlayer({
  tutorialId,
  title,
  courseId,
  nextTutorialId,
  playbackId,
  isLocked,
  completeOnEnd,
}: VideoPlayerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const markComplete = async () => {
    try {
      const response = await fetch("/api/mark-completed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorialId, courseId }),
      });
      if (!response.ok) {
        throw new Error("Failed to mark as completed");
      }
      console.log("[VideoPlayer] Marked as completed:", tutorialId);
      if (nextTutorialId) {
        router.push(`/courses/${courseId}/tutorials/${nextTutorialId}`);
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error("[VideoPlayer] Error marking complete:", err);
      setError("Failed to mark tutorial as completed");
    }
  };

  const handleEnded = () => {
    console.log("[VideoPlayer] Video ended:", {
      tutorialId,
      completeOnEnd,
      nextTutorialId,
    });
    if (completeOnEnd) {
      markComplete();
    }
  };

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!playbackId || isLocked) {
    setError(isLocked ? "This tutorial is locked" : "No video available");
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="relative aspect-video">
      <MuxPlayer
        playbackId={playbackId}
        title={title}
        onError={(e) => {
          console.error("[MuxPlayer] Error:", e);
          setError("Failed to load video");
        }}
        onEnded={handleEnded}
        autoPlay
        className="w-full h-full"
      />
      {error && (
        <div className="absolute top-0 left-0 w-full p-4 text-red-500 bg-black/50">
          {error}
        </div>
      )}
    </div>
  );
}
