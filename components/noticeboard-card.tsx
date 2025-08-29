"use client";

// import Image from "next/image";
import Link from "next/link";

interface NoticeboardCardProps {
  id: string;
  title: string;
  // imageUrl: string;
  description: string;
  noticeboard: string;
}

export const NoticeboardCard = ({
  id,
  title,
  // imageUrl,
  description,
  noticeboard,
}: NoticeboardCardProps) => {
  <Link href={`/admins/${id}/noticeboards/${id}`}>
    <div className="group hover:shadow-md transition overflow-hidden border rounded-lg p-3 h-full">
      {/* <div className="relative w-full aspect-video rounded-md overflow-hidden">
        <Image fill className="object-cover" alt={title} src={imageUrl} />
      </div> */}
      <div className="flex flex-col pt-2">
        <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
          {title}
        </div>
        <p className="text-xs text-muted-foreground">{noticeboard}</p>
        <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
          <p className="text-base">{description}</p>
        </div>
      </div>
    </div>
  </Link>;
};
