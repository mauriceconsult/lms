"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseCardProps {
  id: string;
  title: string;
  amount: string | null;
  isPublished: boolean;
}

export const CourseCard = ({
  id,
  title,
  amount,
  isPublished,
}: CourseCardProps) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          Price: {amount && isPublished ? `$${amount}` : "Not available"}
        </p>
        {isPublished ? (
          <Link
            href={`/courses/${id}`}
            className="text-blue-600 hover:underline"
          >
            View Course
          </Link>
        ) : (
          <p className="text-gray-500">Coming soon</p>
        )}
      </CardContent>
    </Card>
  );
};
