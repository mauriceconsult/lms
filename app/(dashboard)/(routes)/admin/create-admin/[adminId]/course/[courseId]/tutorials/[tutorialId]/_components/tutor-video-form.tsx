"use client";

import axios from "axios";
import { Button } from "@/components/ui/button";
import { VideoIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/file-upload";
import { MuxData, Tutor } from "@prisma/client";
import MuxPlayer from "@mux/mux-player-react";

interface TutorVideoFormProps {
  initialData: Tutor & { muxData?: MuxData | null };
  adminId: string;
  courseId: string;
  tutorialId: string;
}

export const TutorVideoForm = ({
  initialData,
  adminId,
  courseId,
  tutorialId,
}: TutorVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const onSubmit = async (values: { videoUrl: string }) => {
    try {
      await axios.patch(
        `/api/create-admins/${adminId}/courses/${courseId}/tutorials/${tutorialId}/videos`,
        values
      );
      toast.success("Tutorial video updated.");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Tutorial video*
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <VideoIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : initialData.muxData?.playbackId ? (
          <div className="relative aspect-video mt-2">
            <MuxPlayer
              playbackId={initialData.muxData.playbackId}
              className="w-full h-full"
            />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <video
              src={initialData.videoUrl}
              controls
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="tutorVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload a video for this tutorial. The video will be displayed in the
            course.
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. If you don&apos;t see the
          video, please refresh the page.
        </div>
      )}
    </div>
  );
};
