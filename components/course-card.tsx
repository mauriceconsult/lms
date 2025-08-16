
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

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
    <Card
      className="cursor-pointer hover:shadow-lg transition"
     
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-40 w-full mb-4">
          <Image
            src={imageUrl || ""}
            alt={title}
            fill
            className="object-cover rounded-md"
          />
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
  );
};
