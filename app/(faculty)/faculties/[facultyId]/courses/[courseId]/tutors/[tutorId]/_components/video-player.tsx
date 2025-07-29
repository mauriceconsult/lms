"use client";

import MuxPlayer from "@mux/mux-player-react";
// import { useState } from "react";
// import axios from "axios";
// import { MuxPlayer } from "@mux/mux-player-react";
// import { toast } from "react-hot-toast";
// import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  playbackId: string | null;
  title: string;
  tutorId: string;
  courseId: string;
  facultyId: string;
  nextTutorId?: string | null;
  isLocked: boolean;
  completeOnEnd: boolean;
}
export const VideoPlayer = ({
  playbackId,
  title,
  // facultyId,
  // TutorId,
  // courseId,
  // nextTutorId,
  isLocked,
}: // completeOnEnd,
VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
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
      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={() => {}}
          autoPlay
          playbackId={playbackId ?? undefined}
        />
      )}
    </div>
  );
};
