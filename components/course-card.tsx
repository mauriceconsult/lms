"use client";

import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "./icon-badge";
import { BookOpen } from "lucide-react";
import { formatAmount } from "@/lib/format";
import { Preview } from "./preview";
import { CourseProgress } from "./course-progress";
// import { CourseProgress } from "./tutorial-progress";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  tutorialsLength: number;
  amount: string;
  description: string;
  progress: number | null;
  admin: string;
}
export const CourseCard = ({
  id,
  title,
  imageUrl,
  tutorialsLength,
  amount,
  description,
  progress,
  admin,
}: CourseCardProps) => {
  return (
    <Link href={`/tutorials/${id}`}>
      <div className="group hover:shadow-md transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image fill className="object-cover" alt={title} src={imageUrl} />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{admin}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size={"sm"} icon={BookOpen} />
              <span>
                {tutorialsLength} {tutorialsLength === 1 ? "Course" : "Courses"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            // <div>{ }</div>
            <CourseProgress value={progress}
            variant={progress === 100 ? "success" : "default"}
              size="sm"
              // value={progress}              
            />
          ) : (
            <p className="text-md md:text-sm font-medium text-slate-700">
              {formatAmount(amount)}
            </p>
          )}
        </div>
        <div className="my-3 md:text-base font-normal group-hover:text-sky-700 transition">
          <Preview value={description} />
        </div>
      </div>
    </Link>
  );
};
