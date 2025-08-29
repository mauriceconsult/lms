"use client";

import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { Preview } from "@/components/preview";

interface AdminCardProps {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  school: string;
}

export const AdminCard: FC<AdminCardProps> = ({
  id,
  title,
  imageUrl,
  description,
  school,
}) => {
  return (
    <Link href={`/admin/admins/${id}`}>
      <div className="group hover:shadow-md transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image fill className="object-cover" alt={title} src={imageUrl} />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{school || "No school"}</p>
          <div className="my-3">
            <Preview value={description} />
          </div>
        </div>
      </div>
    </Link>
  );
};
