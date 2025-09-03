"use client";

import Link from "next/link";
import { IconBadge } from "./icon-badge";
import { BookOpen } from "lucide-react";

interface AssignmentCardProps {
  id: string;
  title: string;
  assignmentsLength: number;
  description: string;
  progress: number | null;
  tutorialId: string;
}
export const AssignmentCard = ({
  id,
  title,
  assignmentsLength,
  description,
  progress,
  tutorialId,
}: AssignmentCardProps) => {
  return (
    <Link href={`/courses/${id}/tutorials/${tutorialId}/assignments/${id}`}>
      <div className="group hover:shadow-md transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          {/* <p className="text-xs text-muted-foreground">{tutorial}</p> */}
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size={"sm"} icon={BookOpen} />
              <span>
                {assignmentsLength}{" "}
                {assignmentsLength === 1 ? "Assignment" : "Assignments"}
              </span>
            </div>
          </div>
          <div>{progress}</div>
        </div>
        <div>
          <p className="text-base">{description}</p>
        </div>
      </div>
    </Link>
  );
};
