import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "./icon-badge";
import { BookOpen } from "lucide-react";
import { formatAmount } from "@/lib/format";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  tutorsLength: number;
  amount: number;
  progress: number | null;
  faculty: string;
}

export const CourseCard = ({
  id,
  title,
  imageUrl,
  tutorsLength,
  amount,
  progress,
  faculty,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image fill className="object-cover" alt="title" src={imageUrl} />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{faculty}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size={"sm"} icon={BookOpen} />
              <span>
                {tutorsLength} {tutorsLength === 1 ? "Topic" : "Topics"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <div>
              TODO: Progress component
            </div>
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
