import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "./icon-badge";
import { BookOpen } from "lucide-react";
import { formatAmount } from "@/lib/format";

interface AssignmentCardProps {
  id: string;
  title: string;
  assignmentsLength: number;
  amount: number;
  progress: number | null;
  course: string;
}

export const AssignmentCard = ({
  id,
  title,
  assignmentsLength,
  amount,
  progress,
  course,
}: AssignmentCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image
            fill
            className="object-cover"
            alt="title"
            src={"/mcalogo.png"}
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{course}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size={"sm"} icon={BookOpen} />
              <span>
                {assignmentsLength}{" "}
                {assignmentsLength === 1 ? "Assignment" : "Assignments"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <div>TODO: Progress component</div>
          ) : (
            <p className="text-md md:text-sm font-medium text-slate-700">
              {formatAmount(amount.toString())}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
