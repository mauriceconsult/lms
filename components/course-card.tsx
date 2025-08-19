"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
  id: string;
  facultyId: string;
  title: string;
  imageUrl?: string | null;
  amount: string | null;
  faculty: string;
  description?: string | null;
  role: "admin" | "student" | null;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  id,
  facultyId,
  title,
  imageUrl,
  amount,
  faculty,
  description,
  role,
}) => {
  console.log(`[${new Date().toISOString()} CourseCard] Rendering course:`, {
    id,
    facultyId,
    title,
    amount,
    amountType: typeof amount,
    imageUrl,
    role,
  });

  const formattedAmount = amount != null ? amount : "0.00";
  console.log(`[${new Date().toISOString()} CourseCard] Formatted amount:`, {
    id,
    amount,
    formattedAmount,
  });

  return (
    <Link href={`/courses/${id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-40 w-full mb-4">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover rounded-md"
              />
            ) : (
              <div className="h-full w-full bg-slate-200 rounded-md flex items-center justify-center">
                <span className="text-sm text-slate-500">No Image</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 truncate">
            {description
              ? description
                  .replace(/<[^>]+>/g, "")
                  .replace(/\s+/g, " ")
                  .trim()
              : "No description available"}
          </p>
          <p className="text-xs text-gray-500 mt-2">Faculty: {faculty}</p>
          <p className="text-xs text-gray-500">Amount: ${formattedAmount}</p>
        </CardContent>
      </Card>
    </Link>
  );
};
