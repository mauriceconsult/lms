import Image from "next/image";
import Link from "next/link";

interface FacultyCardProps {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  facultyTitle: string; // Added to match CoursesList and Faculties
}

export const FacultyCard = ({ id, title, imageUrl, description, facultyTitle }: FacultyCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="bg-white shadow-sm rounded-lg p-4 hover:bg-gray-100 transition">
        {imageUrl && (
          <div className="relative h-32 w-full mb-4">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover rounded-md"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        <p className="text-sm text-gray-500 mt-2">Faculty: {facultyTitle}</p>
      </div>
    </Link>
  );
};