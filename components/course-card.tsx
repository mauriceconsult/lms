"use client";

import Image from "next/image";
import Link from "next/link";
import { Preview } from "./preview";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  tutorialsLength: number;
  description: string;
  progress: number | null;
  admin: string;
}

export const CourseCard = ({
  id,
  title,
  imageUrl,
  tutorialsLength,
  description,
  progress,
  admin,
}: CourseCardProps) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
      <Link href={`/courses/${id}`}>
        <div className="relative w-full aspect-video">
          <Image
            fill
            className="object-cover rounded-md"
            alt={title}
            src={imageUrl}
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mt-3">{title}</h3>
        <p className="text-sm text-gray-600">By {admin}</p>
        <p className="text-sm text-gray-500 mt-1">
          {tutorialsLength} tutorial{tutorialsLength !== 1 ? "s" : ""}
        </p>
        <p className="text-sm text-gray-700 mt-1 line-clamp-2">
          <Preview value={description || "No description available."} />
        </p>
        {progress !== null && (
          <p className="text-sm text-gray-500 mt-1">Progress: {progress}%</p>
        )}
      </Link>
    </div>
  );
};
