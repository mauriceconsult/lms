"use client"

// import { useState } from "react";
// import axios from "axios";
// import { MuxPlayer } from "@mux/mux-player-react";
// import { toast } from "react-hot-toast";
// import { useRouter } from "next/navigation";
import {
    Loader2,
    // Lock
} from "lucide-react";
// import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  playbackId: string | null;
  title: string;
  tutorId: string;
  courseId: string;
  nextTutorId?: string | null;
  isLocked?: boolean;
  completeOnEnd?: boolean;
}
export const VideoPlayer = ({
    // playbackId,
    // title,
    // tutorId,
    // courseId,
    // nextTutorId,
    isLocked,
    // completeOnEnd,
}: VideoPlayerProps) => { 
    return (
        <div className="relative aspect-video">
            {!isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary"/>
                </div>
           )}
        </div>
    )
}