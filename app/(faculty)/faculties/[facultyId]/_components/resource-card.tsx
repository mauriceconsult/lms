"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface ResourceCardProps {
  id: string;
  title: string;
  type: "tutor" | "coursework" | "courseNoticeboard";
  createdAt: Date;
  muxPlaybackId?: string | null;
  description?: string | null;
  role: "admin" | "student";
  facultyId: string;
  courseId: string;
  isPublished: boolean;
  isEditable: boolean;
}

export const ResourceCard = ({
  id,
  title,
  type,
  createdAt,
  muxPlaybackId,
  description,
  role,
  facultyId,
  courseId,
  isPublished,
  isEditable,
}: ResourceCardProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const getLink = () => {
    if (role === "admin") {
      return type === "tutor"
        ? `/faculties/${facultyId}/courses/${courseId}/tutors/${id}?role=admin`
        : type === "coursework"
        ? `/faculties/${facultyId}/courses/${courseId}/courseworks/${id}?role=admin`
        : `/faculties/${facultyId}/courses/${courseId}/noticeboards/${id}?role=admin`;
    }
    return type === "tutor"
      ? `/faculties/${facultyId}/courses/${courseId}/tutors/${id}`
      : type === "coursework"
      ? `/faculties/${facultyId}/courses/${courseId}/courseworks/${id}`
      : `/faculties/${facultyId}/courses/${courseId}/noticeboards/${id}`;
  };

  const handleEdit = async () => {
    if (!isEditing || !isEditable) {
      setIsEditing(true);
      return;
    }
    try {
      const endpoint =
        type === "tutor"
          ? `/api/faculties/${facultyId}/courses/${courseId}/tutors/${id}`
          : type === "coursework"
          ? `/api/faculties/${facultyId}/courses/${courseId}/courseworks/${id}`
          : `/api/faculties/${facultyId}/courses/${courseId}/noticeboards/${id}`;
      await axios.patch(endpoint, { title: newTitle });
      toast.success("Title updated!");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update title");
      console.error(error);
    }
  };

  return (
    <Link href={getLink()}>
      <div
        className={`group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full ${
          !isPublished && isEditable ? "border-2 border-yellow-400" : ""
        }`}
      >
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          {type === "tutor" && muxPlaybackId ? (
            <MuxPlayer
              playbackId={muxPlaybackId}
              className="w-full h-full object-cover"
              no-controls
            />
          ) : (
            <Image
              className="w-full h-full object-cover"
              alt={title}
              src="/mcalogo.png"
              width={300}
              height={169}
            />
          )}
        </div>
        <div className="flex flex-col pt-2">
          {isEditable && isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="text-lg font-medium"
              />
              <Button onClick={handleEdit} size="sm">
                Save
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-lg font-medium group-hover:text-sky-700 transition line-clamp-2">
                {title}
              </p>
              {isEditable && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {type.charAt(0).toUpperCase() + type.slice(1)}
            {isEditable && !isPublished && " (Draft)"}
          </p>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {description}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Created: {createdAt.toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
};
