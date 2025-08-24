// app/(eduplat)/_components/courseNoticeboard-card.tsx
"use client";

import Link from "next/link";
import { IconBadge } from "@/components/icon-badge";
import { BookOpen } from "lucide-react";
import Image from "next/image";

interface CourseNoticeboardCardProps {
  id: string;
  title: string;
  courseNoticeboardsLength: number;
  progress: number | null;
  course: string;
  description?: string;
  adminId: string | null;
  courseId: string | null;
}

export const CourseNoticeboardCard = ({
  id,
  title,
  courseNoticeboardsLength,
  progress,
  course,
  description,
  adminId,
  courseId,
}: CourseNoticeboardCardProps) => {
  const stripHtml = (html?: string) => {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, " ")
      .trim();
  };

  return (
    <Link
      href={
        adminId && courseId
          ? `/admins/${adminId}/courses/${courseId}/courseNoticeboards/${id}`
          : "#"
      }
    >
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image
            fill
            className="object-cover"
            alt={title}
            src={"/instaskul_logo.svg"}
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{course}</p>
          {description && (
            <span className="text-slate-950 text-muted-foreground font-normal line-clamp-3">
              {stripHtml(description)}
            </span>
          )}
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size={"sm"} icon={BookOpen} />
              <span>
                {courseNoticeboardsLength}{" "}
                {courseNoticeboardsLength === 1 ? "Topic" : "Topics"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <div>{/* TODO: Progress component */}</div>
          ) : null}
        </div>
      </div>
    </Link>
  );
};
