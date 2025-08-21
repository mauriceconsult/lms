"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Course } from "@prisma/client";

interface CourseCardProps {
  course: Course & {
    tutors: { id: string; title: string }[];
  };
}

export function CourseCard({ course }: CourseCardProps) {
  const { id, title, description, imageUrl, amount, tutors } = course;

  return (
    <div className="border rounded-lg shadow-sm p-4">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          width={300}
          height={200}
          className="rounded-md object-cover mb-4"
        />
      ) : (
        <div className="w-[300px] h-[200px] bg-slate-200 rounded-md flex items-center justify-center mb-4">
          <span className="text-sm text-slate-500">Image Coming Soon</span>
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">
        {description || "No description available."}
      </p>
      <p className="text-gray-600 mb-4">
        Tutors:{" "}
        {(tutors ?? []).length > 0
          ? tutors.map((t) => t.title).join(", ")
          : "None assigned"}
      </p>
      <p className="text-gray-600 mb-4">
        Price: {amount ? `$${amount}` : "Free"}
      </p>
      <Link href={`/courses/${id}`}>
        <Button>View Course</Button>
      </Link>
    </div>
  );
}
